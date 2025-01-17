const {TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const MonitoredTarget = require("../models/MonitoredTarget.class");
// const MonitoredChanel = require("../models/MonitoredChanel.class");

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
 * @param {number} params.time en secondes; délai maximum de reception des messages
 * @param {number} params.numberOfMessagesPerChanel nombre de messages à récupérer par channel
 * @param {MonitoredTarget[]} params.chanels Groupes à observer pour les messages
 * 
 * @returns {Array<{chanelTitle: string, chanelId: number, messages: string[] }>} Un tableau d'objets où chaque objet contient des informations sur un canal.
 */
const getLatestMessages = async (client, {chanels=[], time=300, numberOfMessagesPerChanel=5})=>{
    let result = [];

    // on récupère l'ensemble des discussions concernées
    let allChats = (await client.getDialogs({archived: false})).filter(
        (value)=>{
            for(let i=0; i<chanels.length;i++){
                // console.log( "value", value.date, " target timestamp ", Date.now()-(time*1000));
                if(value.title == chanels[i].getTargetName() ){
                    // console.log(value.title);
                    return value;
                }
            }
        }
    );

    console.log("nombre de discussions récupérés: ", allChats.length);

    for(let i=0; i<allChats.length; i++){ // pour chaque discussion récupérée
        let targetEntity = await client.getEntity(allChats[i].entity.id);
        let unsanitizedMessages = await client.getMessages(targetEntity, {
            limit: numberOfMessagesPerChanel,
        });

        let sanitizedMessages = [];
        const actual_timestamp = Date.now();

        for(let j=0; j< unsanitizedMessages.length; j++){ // pour chaque message de la discussion
            // console.log(unsanitizedMessages.at(j).date.valueOf() - parseInt(actual_timestamp-(time*1000)));

            console.log(
                "date actuelle: ", new Date(actual_timestamp).toLocaleString('fr-FR', {
                    
                }) ,
             " --- date d'envoir du message: ", new Date(unsanitizedMessages.at(j).date).toLocaleString('fr-FR', {
                
                }),
             "-- message: ", unsanitizedMessages.at(j).message
            );
            
            
            // la date du message est compatible, avec l'ancieneté recherchée, on le récupère
            // console.log("date message: ", unsanitizedMessages.at(j).date, "   now ", (actual_timestamp-(time*1000)));
            if(parseInt(unsanitizedMessages.at(j).date.valueOf()) - parseInt(actual_timestamp-(time*1000)) >= 0){
                console.log("message trouvé -- ");
                sanitizedMessages.push(
                    unsanitizedMessages.at(j).message
                );
            }
        }
        
        result.push({
            chanelTitle: targetEntity.title,
            chanelId: targetEntity.id,
            messages: sanitizedMessages
        });
    }


    console.log("/////// nombre de messages au total: ", result.length);

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