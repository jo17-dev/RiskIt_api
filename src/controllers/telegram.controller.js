const { StringSession } = require('telegram/sessions');
const TelegramService = require('../services/telegram.service');
const signalInterpretationService = require('../services/signalInterpretation.service');
const kucoinService = require('../services/kucoin.service');


const ProviderAccount = require('../models/ProviderAccount.class');
const ProviderAccountDAO = require('../models/dao/ProvidedAccount.dao');
const MonitoredTargetDAO = require('../models/dao/MonitoredTarget.dao');
const MonitoredtargetAndTraderAgentSouscriptionDao = require('../models/dao/MonitoredtargetAndTraderAgentSouscription.dao');

const encryptService = require('../services/encrypt.service');
const { TelegramClient} = require('telegram');
const SignalDAO = require('../models/dao/Signal.dao');

const engineStatus = {isRunning: false};


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
     * recupérer tous ses subs et faire le trade.
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
            result.forEach(async (item)=>{
                // console.log(item.monitoredTarget);
                item.messages.forEach(async (messageItem)=>{
                    // console.log(messageItem, " -- longeur: ", messageItem.length);
                    let interpretedSignal = await signalInterpretationService.retreiveSignalFromTextV1(messageItem, item.monitoredTarget.getId());
                    if(interpretedSignal.length > 0){
                        console.log("message actuel interpreté avec succcess. ", interpretedSignal.length, " signaux cumulés trouvés");
                        
                        for(let i=0; i< interpretedSignal.length; i++){
                            console.log("||| signal ||||");
                            console.log(interpretedSignal[i].displayInfo());
                        }

                        // recupération de tous les agents de tragind qui ont souscrit au signal.
                        const subs = await MonitoredtargetAndTraderAgentSouscriptionDao.getTraderAgentsByMonitoredTarget(interpretedSignal[0].getMonitoredTargetId());
                        // on recupère tous les subs relatifs a la monitored target assiociée au signal.

                        // on fait les trades par type de trading
                        subs.forEach( async (subsItem)=>{
                            if(subsItem.getAgentName() == "kucoin"){
                                // pour kucoin: le 1er signal est le pere, les autres sont limits.
                                interpretedSignal.forEach(async (interpretedSignalItem)=>{
                                    await kucoinService.makeOrder(interpretedSignalItem, subsItem, false);
                                });
                            }else{
                                console.log("en vrai on ne peux rien faire à date hahaha");
                            }
                        });
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
    engineStatus.isRunning = true;
    return ()=>{clearInterval(timingId); engineStatus.isRunning = false;};
}

/**
 * enlever un client de la pool de montoring
 * @param {int} providerAccountId
 */
const removeClientFromPool = async (providerAccountId)=>{
    const targetProviderAccount = await ProviderAccountDAO.getById(providerAccountId);

    if(targetProviderAccount == null){
        throw new Error("Le compte correspondant n'as pas été trouvé")
    }
    if(targetProviderAccount.getPlatformName() != "telegram"){
        throw new Error("Le compte correspondant n'est pas du bon type (telegram)");
    }
    console.log("le priovider a été trouvé")
    let targetPosition = -1;

    for(let i=0; i< clientPool.length; i++) {
        if(clientPool[i].providerAccount.getId() == providerAccountId){
            targetPosition =  i;
            console.log("la position à suprimmer à été trouvé");
            break;
        }
    };

    if(targetPosition != -1){
        clientPool.splice(targetPosition, 1);
        console.log("Le client a été enlevé de la pool");
    }
}

/**
 * recupérer un client de la pool
 * @param {int} providerAccountId
 * @returns {Promise<JSON>}
 */
const getPooledClient = async (providerAccountId)=>{
    const targetProviderAccount = await ProviderAccountDAO.getById(providerAccountId);

    if(targetProviderAccount == null){
        throw new Error("Le compte correspondant n'as pas été trouvé")
    }
    if(targetProviderAccount.getPlatformName() != "telegram"){
        throw new Error("Le compte correspondant n'est pas du bon type (telegram)");
    }
    console.log("le priovider a été trouvé")
    let targetPosition = -1;

    for(let i=0; i< clientPool.length; i++) {
        if(clientPool[i].providerAccount.getId() == providerAccountId){
            return clientPool[i].providerAccount.toString()
        }
    };

    throw new Error("Le compte correspondans à l'id n'as pas été recupéré");
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
 * recupérer la liste des cours disponibles dans la pool de monitoring
 * @returns {Array<JSON>} json des clients
 */
const getPooledClients = ()=>{
    const result = [];
    clientPool.forEach(
        (element)=>{
            result.push(element.providerAccount.toString())
        }
    );

    return result;
}

/**
 * 
 * Retourne le staut complet du service telegram
 * @returns {Object}
 */
const getEngineStatut = ()=>{
    return {
        is_runing: engineStatus.isRunning,
        numberOfClients: clientPool.length,
    }
}



module.exports = {
    startEngine, getEngineStatut, addClientToPool, removeClientFromPool, getPooledClients, getPooledClient
}