const TelegramAccountDAO = require('../models/dao/telegramAccount.dao');

// fonction de démarge de l'application telegram
const startEngine = (phoneNumber)=>{
    // 1st: we make a request to DB to search if une session existe pour ce numéro
    // 2nd: si elle existe, on vas essayer de logger avec telegram.service via sa session id.
    // 3th: si ell n'existe pas, on vas créer un nouvel id de connection et stocker ses infos ( chanels à monitorer, compte, session telegram)

    // 4th: on vas check chaque 10mins s'il existe un nouveau message dans un des chanels
    // 5th: s'il y a un nouveau messsage, on vas l'interpreter, appeler la fonction makeAFutureTrade() des services ou du controleur de trades(lbank), et on envoie un rapport au client par message
}


// fonction de fermeture de l'app telegram
const closeEngine = ()=>{
    // ici, on vas juster clear le setInterval qui check chaque 5mins
    console.log("closed engine")
    TelegramAccountDAO.getAll();
}



module.exports = {
    startEngine, closeEngine
}