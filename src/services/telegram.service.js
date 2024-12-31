const {TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

// Sugession: Ce serai peu être bien qu'il y ai une classe qui gère ça non ?..

/**
 * Conexion d'un clientTelegram à partir de son id de session
 * @param {StringSession} sessionString Session_String
 * @param {number} apiId apiId cible
 * @param {string} apiHash apiHash cible
 * @returns {TelegramClient}
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
 * @param {string[]} params.chanels Groupes à observer pour les messages
 * 
 * @returns {Array<{chanelTitle: string, chanelId: number, messages: string[] }>} Un tableau d'objets où chaque objet contient des informations sur un canal.
 */
const getLatestMessages = async (client, {chanels=[], time=5000, numberOfMessagesPerChanel=5})=>{
    let result = [];

    // on récupère l'ensemble des discussions concernées
    let allChats = (await client.getDialogs({archived: false})).filter(
        (value)=>{
            for(let i=0; i<chanels.length;i++){
                if(value.title == chanels[i]){
                    console.log(value.title);
                    return value;
                }
            }
        }
    );

    console.log("nombre de discussions récupérés: ", allChats.length);

    for(let i=0; i<allChats.length; i++){
        let targetEntity = await client.getEntity(allChats[i].entity.id);
        let unsanitizedMessages = await client.getMessages(targetEntity, {
            limit: numberOfMessagesPerChanel,
        });
        
        let sanitizedMessages = [];

        for(let j=0; j< unsanitizedMessages.length; j++){
            console.log(unsanitizedMessages.at(i).message)
            sanitizedMessages.push(
                unsanitizedMessages.at(j).message
            );
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