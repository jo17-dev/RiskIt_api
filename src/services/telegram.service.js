const {TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const MonitoredTarget = require("../models/MonitoredTarget.class");
const { Dialog } = require("telegram/tl/custom/dialog");

// Sugession: Ce serai peu être bien qu'il y ai une classe qui gère ça non ?..

/**
 * Conexion d'un clientTelegram à partir de son id de session
 * @param {StringSession} sessionString Session_String
 * @param {number} apiId apiId cible
 * @param {string} apiHash apiHash cible
 * @returns {TelegramClient | null}
 */
const connectClient = async (sessionString, apiId, apiHash)=>{
        const client = new TelegramClient(sessionString, apiId, apiHash, {
            reconnectRetries: 5
        });

        await client.start();

        return client;
}

/**
 * Récupéere les derniers messages dans le temps précisé
 * @param {TelegramClient} client client cible
 * @param {Object} params JSON de l'enseble des parametres
 * @param {number} params.time en mili-secondes; délai maximum de reception des messages. les 10 dernieres minutes par defaut
 * @param {number} params.numberOfMessagesPerChanel nombre de messages à récupérer par channel
 * @param {MonitoredTarget[]} params.chanels Groupes à observer pour les messages
 * 
 * @returns {Array<{chanelTitle: string, chanelId: number, messages: string[], monitoredTarget: MonitoredTarget }>} Un tableau d'objets où chaque objet contient des informations sur un canal.
 */
const getLatestMessages = async (client, {chanels=[], time=(10*60*1000), numberOfMessagesPerChanel=15})=>{
    let result = [];

    // on récupère l'ensemble des discussions concernées
    /**
     * @type {Array<{dialog: Dialog , chanel: MonitoredTarget}>}
     */
    let allChats = (await client.getDialogs({archived: false}))
    .filter((item)=>{
        for(let i=0; i<chanels.length;i++){
            if(item.title == chanels[i].getTargetName() ){
                return item;
             } 
        }
    })
    .map(
        (value)=>{
            for(let i=0; i<chanels.length;i++){
                // console.log( "value", value.date, " target timestamp ", Date.now()-(time*1000));
                // if(value.title == chanels[i].getTargetName() ){
                    console.log("discussion trouvée hahah");
                    return {dialog: value, chanel: chanels[i]};
                // }
            }
        }
    );

    console.log("nombre de discussions récupérés: ", allChats.length);

    for(let i=0; i<allChats.length; i++){ // pour chaque discussion récupérée
        let targetEntity = await client.getEntity(allChats[i].dialog.entity.id);
        let unsanitizedMessages = await client.getMessages(targetEntity, {
            limit: numberOfMessagesPerChanel,
        });

        let sanitizedMessages = [];
        const actual_timestamp = Date.now();

        for(let j=0; j< unsanitizedMessages.length; j++){ // pour chaque message de la discussion
            // la date du message est compatible, avec l'ancieneté recherchée, on le récupère
            if(parseInt(unsanitizedMessages.at(j).date)*1000 - parseInt(actual_timestamp -(time)) >= 0){    
                console.log("message trouvé -- ");
                sanitizedMessages.push(
                    unsanitizedMessages.at(j).message
                );
            }
        }
        
        result.push({
            chanelTitle: targetEntity.title,
            chanelId: targetEntity.id,
            monitoredTarget: allChats[i].chanel,
            messages: sanitizedMessages
        });
    }

    return result;

}

/**
 * @param {TelegramClient} targetClient client cible
 * @returns {boolean} statut de déconnexion du client cible
 */
const stopConnection = async (targetClient)=>{
    console.log("service telegram - fin de la connexion");

    await targetClient.disconnect();

    return targetClient.disconnected;
}

module.exports = {
    connectClient,
    getLatestMessages,
    stopConnection
}