const Trade = require('../models/Trade.class');
const lbankService = require('../services/lbank.service');
const TradeDAO = require("../models/dao/Trade.dao");

//recupération des trades ouverts
async function getTradingPairs(){
    let result = await lbankService.getTradingPairs();
    return result;
}

// creer un trade futures
/**
 * 
 * @param {number} sl
 * @param {number} tp
 * @param {number} entry_price 
 * @returns 
 */
async function makeAFutureTrade(type, sl, tp, position_price) {
    // on crée l'ordre et on fait un log dans la base de données
    TradeDAO.add(type, tp, sl, marge, position_price)
    return false;
}


module.exports = {
    getTradingPairs,
    makeAFutureTrade
}