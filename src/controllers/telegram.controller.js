const { StringSession } = require('telegram/sessions');
const TelegramAccountDAO = require('../models/dao/telegramAccount.dao');
const TelegramService = require('../services/telegram.service');


const clientPool = []; // ensemble des clients connectés

// fonction de démarge de l'application telegram
/**
 * Fonction pour initier l'ajout d'un client à la machine de stream
 * @param {string} phoneNumber  numéro de telephone internationale
 */
const startEngine = async (phoneNumber)=>{
    console.log("the telegram engine is starting...")
    // 1st: we make a request to DB to search if une session existe pour ce numéro
    const apiId = process.env.API_ID;
    const apiHash = process.env.API_HASH;
    const sessionString = process.env.SESSION_STRING
    // 2nd: si elle existe, on vas essayer de logger avec telegram.service via sa session id.
    if(true){
        let target = await TelegramService.connectClient(
            // Naaaah ttkkkt j'ai changé ce que tu cherche dans mes commits hahahah
            new StringSession(sessionString),
            apiId,
            apiHash
        );
        clientPool.push(target);

        setInterval(async ()=>{
            let result = await TelegramService.getLatestMessages(target, {
                chanels: ["Crypto Space VIP", "Bob"],
                time: 5000
            });

            console.log("MESSAGES de ", result[0].chanelId);
            console.log(result[0].messages);
            console.log("FIN MESSAGES");
        }, 10000);
    }
    // 3th: si ell n'existe pas, on vas créer un nouvel id de connection et stocker ses infos ( chanels à monitorer, compte, session telegram)
}

/**
 * authentification via le code recu via telegram
 * @param {string} telegramCode 
 */
const processAuth = (telegramCode)=>{
    // On complete le loggin et on logge dans les bases de données et tout
    // 4th: on vas check chaque 10mins s'il existe un nouveau message dans un des chanels
    // 5th: s'il y a un nouveau messsage, on vas l'interpreter, appeler la fonction makeAFutureTrade() des services ou du controleur de trades(lbank), et on envoie un rapport au client par message
}

/**
 * 
 * Retourne le staut complet du service telegram
 * @returns {Object}
 */
const getEngineStatut = ()=>{
    return {
        is_runing: true,
        numberOfClients: 24,
    }
}


// fonction de fermeture de l'app telegram
const closeEngine = ()=>{
    // ici, on vas juster clear le setInterval qui check chaque 5mins
    console.log("closed engine")
    TelegramAccountDAO.getAll();
}



module.exports = {
    startEngine, closeEngine, getEngineStatut
}