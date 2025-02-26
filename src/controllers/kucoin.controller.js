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
 * @type {WebSocket} socket globale utilisée pour kucoin
 */
let kucoinSocket = null;

/**
 * creer un ordre sur la marché via un signal
 * @param {Signal} signal 
 */
const createmarketOrder = async ()=>{
    let kucoinAgent = await TraderAgentDAO.getById(3);
    let signalParent = new Signal(
        90,
        1,
        "YFI/USDT",
        6650, // le plus grand TP
        6500, // le plus petit stop loss
        6570.0,
        6570.0,
        null,
        Date.now(),
        Date.now()
    ); // signal en buy

    // ceci est un ordre stop-limit correpondant à 30% du premier
    let signalTP = new Signal(
        91,
        1,
        "YFI/USDT",
        6650,// tp: repensete le point de sortie gangante du trade
        6600, // sl: represetne le pointe de sortie perdante du trade
        6600,
        6600,
        null,
        Date.now(),
        Date.now()
    ); // signal en buy

    // on vas exécuter les 2 ordres ici
    const result = {};
    result.ordreParent = await kucoinService.makeOrder(signalParent, kucoinAgent, true);
    result.ordreTP = await kucoinService.makeTpOrder(signalTP, kucoinAgent, true);

    return result;
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
    let kucoinAgent = await TraderAgentDAO.getById(3);
    
    const result = await kucoinService.createNewWSSToken(kucoinAgent);

    // is l'item wss_token n'est pas présent, ce n'est peux être pas un compte valide/ il n'as pas le crédential ici demandé (wss_token)
    if("wss_token" in kucoinAgent.getCredentials()){
        kucoinAgent.getCredentials().wss_token = result.data.token;
        await TraderAgentDAO.update(kucoinAgent);
        return result;
    }else{
        let tmp = kucoinAgent.getCredentials();

        tmp.wss_token = result.data.token;
        kucoinAgent.setCredentials(tmp);
    }
}

const listenWS = async ()=>{
    let kucoinAgent = await TraderAgentDAO.getById(3);
    kucoinSocket =  kucoinService.listenWSS(kucoinAgent);

    // if(kucoinSocket != null){
        console.log("socket prete a fonctionner")

        // kucoinSocket.onopen = (ev)=>{
        //     console.log("////////////////////////////////////////// connexion ouverte //////////////////")
        //     kucoinSocket.onmessage = (messageEvent) =>{
        //         console.log("---");
        //         console.log(messageEvent.data);
        //     }
        //     // lorsque la connexion s'ouvre, on essayer de faire un ping
        //     console.log("socket ready state: ", kucoinAgent.readyState);
        //     kucoinSocket.send(
        //         JSON.stringify({
        //             id: "1545910590801",
        //             type:"ping"
        //         })
        //     );  
    
        // }
    
    // }
}

const closeKucoinWSS = async ()=>{

    const result = kucoinService.closeWSS(kucoinSocket);

    console.log("closed:: ", result);

    if(!result || kucoinService == null){
        throw new Error("Le service websocket n'as pas été déconnecté");
    }
}

/**
 * 
 * @param {object} message 
 */
const sendWSSMessage = (message)=>{
    if(kucoinSocket == null){
        console.log("ce n'est pas possible");
        throw new Error("la socket n'est pas initialisée");
    }else{
        kucoinSocket.send(
            JSON.stringify({
                id: "1545910590801",
                type:"ping"
            })
        );  
        console.log("bob retounr");
    }
}

module.exports = {
    convertpair,
    createmarketOrder,
    getAllActiveOrders,
    cancelOrder,
    createNewWSSToken,
    listenWS,
    closeKucoinWSS,
    sendWSSMessage
}