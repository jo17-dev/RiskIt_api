const TradeDAO = require('../models/dao/Trade.dao');

async function getCompleteHistory(){
    let result = await TradeDAO.searchAll();
    
    return result;
}

module.exports = {getCompleteHistory};