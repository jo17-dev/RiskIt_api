const kucoinService = require('../services/kucoin.service');
const encryptService = require('../services/encrypt.service');
const Signal = require('../models/Signal.class');
const TraderAgentDAO = require('../models/dao/TraderAgent.dao');
const SignalDAO = require('../models/dao/Signal.dao');
const { Socket } = require('socket.io-client');


const convertpair = (pair)=>{
    return kucoinService.convertSignalPairToKucoinPair(pair);
}

/**
 * @type {Socket<DefaultEventsMap, DefaultEventsMap> | null} socket globale utilisée pour kucoin
 */
let kucoinSocket = null;

/**
 * creer un ordre sur la marché via un signal
 * @param {Signal} signal 
 */
const createmarketOrder = async ()=>{
    let kucoinAgent = await TraderAgentDAO.getById(3);
    let signal = new Signal(
        90,
        1,
        "YFI/USDT",
        7600.0,
        7500.0,
        7415.0,
        7413,
        null,
        Date.now(),
        Date.now()
    ); // signal en buy

    return kucoinService.makeOrder(signal, kucoinAgent, true);
}

const getAllActiveOrders = async ()=>{
    let kucoinAgent = await TraderAgentDAO.getById(3);
    return kucoinService.getAllActiveOrders(kucoinAgent);
}

const cancelOrder = async (pair)=>{
    let kucoinAgent = await TraderAgentDAO.getById(3);
    console.log("test");
    return kucoinService.cancelAllFutureOrdersByPair(pair, kucoinAgent);
}

const createNewWSSToken = async ()=>{
    try{
        let kucoinAgent = await TraderAgentDAO.getById(3);
        
        const result = await kucoinService.createNewWSSToken(kucoinAgent);

        // is l'item wss_token n'est pas présent, ce n'est peux être pas un compte valide/ il n'as pas le crédential ici demandé (wss_token)
        if("wss_token" in kucoinAgent.getCredentials()){
            kucoinAgent.getCredentials().wss_token = result.data.token;
        }else{
            throw new Error();
        }

    }catch(err){
        throw new Error("La création du token n'as pas réussie");
    }
}

const listenWS = async ()=>{
    let kucoinAgent = await TraderAgentDAO.getById(3);
    kucoinSocket =  kucoinService.listenWSS(kucoinAgent);

    console.log("kucoin socket: ", kucoinSocket);
}

const closeKucoinWSS = async ()=>{
    const result = kucoinService.closeWSS(kucoinSocket);

    console.log("closed:: ", result);

    if(!result || kucoinService == null){
        throw new Error("Le service websocket n'as pas été déconnecté");
    }
}

module.exports = {
    convertpair,
    createmarketOrder,
    getAllActiveOrders,
    cancelOrder,
    createNewWSSToken,
    listenWS,
    closeKucoinWSS
}