const { StringSession } = require('telegram/sessions');
const TelegramAccountDAO = require('../models/dao/telegramAccount.dao');
const TelegramService = require('../services/telegram.service');


const clientPool = []; // ensemble des clients connectés
let timingId;

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
            for(let i=0; i<clientPool.length; i++){
                let result = await TelegramService.getLatestMessages(clientPool[i], {
                    chanels: ["Crypto Space VIP", "Bob", "TFXC SIGNALS"],
                    time: 3600
                });

                console.log("nombre de messages du client telegram ", i , " : ", result.length);
                // for(let j=0; j<result.length; j++){
                //     console.log(result[j].messages);
                // }

                console.log(result);


            }
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
    clearInterval(timingId);
}



module.exports = {
    startEngine, closeEngine, getEngineStatut
}