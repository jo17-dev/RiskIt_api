const { StringSession } = require('telegram/sessions');
const TelegramService = require('../services/telegram.service');
const signalInterpretationService = require('../services/signalInterpretation.service');


const ProviderAccount = require('../models/ProviderAccount.class');
const ProviderAccountDAO = require('../models/dao/ProvidedAccount.dao');
const MonitoredTargetDAO = require('../models/dao/MonitoredTarget.dao');

const encryptService = require('../services/encrypt.service');
const { TelegramClient} = require('telegram');


/**
 * @type {Array<{client: TelegramClient, providerAccount: ProviderAccount}>}
 */
const clientPool = []; // ensemble des clients telegram connectés ( Telegram Connecté)

// fonction de démarge de l'application telegram
/**
 * Fonction pour lancer l'operation de monitoring
 * @returns {()=>{stopEngineMethod()}} phoneNumber  numéro de telephone internationale
 */
const startEngine = async ()=>{
    /**
     * 1st boucler sur tous les comptes à monitorer
     * récupérer son client et check ses derniers messages
     * 
     */
    console.log("the telegram engine is starting...")

    const timingId = setInterval(async ()=>{
        clientPool.forEach(async (clienPoolItem)=>{
            // 1st on recupère les message des différentes cible de monitoring
            let result = await TelegramService.getLatestMessages(clienPoolItem.client, {
                chanels:  await MonitoredTargetDAO.getAllByProviderId(clienPoolItem.providerAccount.getId()),
                time: (10*60*60*1000), // les 10 dernieres heures hahah
                numberOfMessagesPerChanel: 7
            });

            // 2nd on boucle sur chaque message de chaque discussions pour interpreter chacun des message en signal via le servide signalInterpret.service.js
            result.forEach((item)=>{
                // console.log(item.monitoredTarget);
                item.messages.forEach((messageItem)=>{
                    // console.log(messageItem, " -- longeur: ", messageItem.length);
                    let interpretedSignal = signalInterpretationService.retreiveSignalFromTextV1(messageItem, item.monitoredTarget.getId());

                    if(interpretedSignal != null){
                        console.log(interpretedSignal.displayInfo());
                        console.log("message interprete avec succcess");
                        // enregistrement dans la data base
                    }else{
                        console.log("ce message n'était pas un signal");
                    }
                })
            });

            // 3td en suite on le stocke dans la base de données et s'est bon

            console.log("nombre de discussions du client telegram ", clienPoolItem.providerAccount.displayInfo() , " : ", result.length);

            // console.log(result);
        });
    }, 10000);
    
    return ()=>{clearInterval(timingId)};
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