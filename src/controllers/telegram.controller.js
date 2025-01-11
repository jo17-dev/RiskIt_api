const { StringSession } = require('telegram/sessions');
const TelegramService = require('../services/telegram.service');


const ProviderAccount = require('../models/ProviderAccount.class');
const ProviderAccountDAO = require('../models/dao/ProvidedAccount.dao');

const encryptService = require('../services/encrypt.service');
const { TelegramClient} = require('telegram');


/**
 * @type {Array<{client: TelegramClient, providerAccount: ProviderAccount}>}
 */
const clientPool = []; // ensemble des clients telegram connectés ( Telegram Connecté)

// fonction de démarge de l'application telegram
/**
 * Fonction pour initier et ajouter un client à la machine de stream
 * @param {string} phoneNumber  numéro de telephone internationale
 */
const startEngine = async (phoneNumber)=>{
    console.log("the telegram engine is starting...")
    let targetTelegramAccount = await TelegramAccountDAO.getById(phoneNumber);
    // 1st: we make a request to DB to search if une session existe pour ce numéro

    if(!targetTelegramAccount || targetTelegramAccount == null){
        console.log("compte telegram non trouvé");
        throw new Error("Le compte telegram n'as correspondant n'as pas été trouvé.");
    }
    // on suppose qu'ici le compte telegram est recupérré


    // on vas récupérer les canaux à monitorer:
    let targetChanels = await MonitoredChanelDAO.getAllByPhoneNumber(targetTelegramAccount.getphoneNumber());


    // 2nd: si elle existe, on vas essayer de logger avec telegram.service via sa session id.

    // 
    if(true){
        let target = await TelegramService.connectClient(
            new StringSession(targetTelegramAccount.getsession_string()), // session_string
            encryptService.decryptData(targetTelegramAccount.getencryptedApiID()), // apiId déchiffré
            encryptService.decryptData(targetTelegramAccount.getencryptedApiHash()) // apiHash déchifré
        );
        clientPool.push(target);

        const timingId = setInterval(async ()=>{
            for(let i=0; i<clientPool.length; i++){
                let result = await TelegramService.getLatestMessages(clientPool[i], {
                    chanels:  targetChanels,
                    time: (360*60)
                });

                console.log("nombre de discussions du client telegram ", i , " : ", result.length);

                console.log(result);


            }
        }, 10000);

        return ()=>{clearInterval(timingId)};

    }

    return null;
    // 3th: si ell n'existe pas, on vas créer un nouvel id de connection et stocker ses infos ( chanels à monitorer, compte, session telegram)
}

/**
 * ajouter un client à la pool de monitoring (en utilisant son provider): le moteur dois être démaré ?
 * @param {int} providerAccountId id du "provider account" à ajouter (compte telgram)
 * 
 */
const addClientToPool = async (providerAccountId)=>{

    // 1st we find the correponding provider
    const targetProviderAccount = await ProviderAccountDAO.getById(providerAccountId);

    // 2nd: try to find if the corresponding provider is a telegram one
    if(targetProviderAccount == null){
        throw new Error("Le compte correspondant n'as pas été trouvé");
    }
    if(targetProviderAccount.getPlatformName() != "telegram"){
        throw new Error("Le compte correspondant n'est pas du bon type (telegram)");
    }

    // 3rd we check if this provider isn't already in the pool
    clientPool.forEach((item)=>{
        if(item.providerAccount.getId() == targetProviderAccount.getId()){
            throw new Error("Le compte est déjas dans un état de monitoring");
        }
    });

    // we create and log in the client and add to the pool

    // console.log(encryptService.decryptData(targetProviderAccount.getCredentials().api_hash));
    console.log(targetProviderAccount.getCredentials().session_string);

    /**
     * @type {TelegramClient}
     */
    const targetClient = await TelegramService.connectClient(
        new StringSession(targetProviderAccount.getCredentials().session_string),
        parseInt(encryptService.decryptData(targetProviderAccount.getCredentials().api_id)),
        encryptService.decryptData(targetProviderAccount.getCredentials().api_hash),
    );
    
    // we vierify if the client is connected
    if(targetClient == null){
        throw new Error("Le compte n'as pas pu se connecter. vérifiez les informations de sessions, l'api id et le hash");
    }

    // On ajoute le client à la pool.. ENFIN hahahaha
    clientPool.push({
        client: targetClient,
        providerAccount: targetProviderAccount

    });

    console.log("le client a été ajouté avec succes");
}

/**
 * 
 * Retourne le staut complet du service telegram
 * @returns {Object}
 */
const getEngineStatut = ()=>{
    return {
        is_runing: clientPool.length > 0,
        numberOfClients: clientPool.length,
    }
}



module.exports = {
    startEngine, getEngineStatut, addClientToPool
}