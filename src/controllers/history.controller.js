const TradeDAO = require('../models/dao/Trade.dao');


// récupéer l'historique complet des choses hahah
async function getCompleteHistory(){
    let result = await TradeDAO.getAll();
    return result;
}

module.exports = {getCompleteHistory};