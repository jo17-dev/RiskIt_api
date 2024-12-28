const { client, TelegramClient } = require("telegram");

// Sugession: Ce serai peu être bien qu'il y ai une classe qui gère ça non ?..

/**
 * 
 * @param {string} phoneNumber 
 * @returns {client}
 */
const connectClient = (phoneNumber)=>{
    let session_id = "";
    // const client = new TelegramClient(session_id, process.env.API)
    console.log("service telegram - tentative de connexion");
}

/**
 * 
 * @param {string} session_id 
 * @returns {client}
 */
const restaureSession = (session_id)=>{
    console.log("service telegram - restauration de session")
}


const stopConnection = ()=>{
    console.log("service telegram - fin de la connexion");
}

module.exports = {
    connectClient,
    restaureSession,
    stopConnection
}