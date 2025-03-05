// fichier de toutes les fonctions relatives à l'api de kucoin
// OUIIII je saiiit les fonctions du service ne sont pas factorisées DU TOUT HAHAHA
const { default: axios } = require('axios');
const Signal = require('../models/Signal.class');
const TraderAgent = require('../models/TraderAgent.class');
const encryptService = require('../services/encrypt.service');
const crypto = require('crypto');
require('dotenv').config();
/**
 * @type {{future: string, spot:string}} 
 */
const TradeType = {
    future: "future",
    spot: "spot"
}

/**
 * @type {{GET: string, POST: string, DELETE: string}}
 */
const HttpMethod = {GET: "GET", POST: "POST", DELETE: "DELETE"};


const kucoinApiUrl = process.env.KUCOIN_FUTURES_URL.toString(); // complete endpoint
const kucoinWSSUrl = process.env.KUCOIN_FUTURES_WSS_URL.toString();


/**
 * hasher une string avec sha256 hashmac et retouner le resultat en base64 (pour signer avec hashmac)
 * @param {string} secretKey clé à utiliser
 * @param {string} targetData données à hasher
 * @returns {string} resultat en base 64
 */
const sha256_hashMac_hash = (secretKey, targetData)=>{
    // hashage en sha256 - hashmac
    const hmac = crypto.createHmac('sha256', secretKey);

    hmac.update(targetData);

    return hmac.digest('base64');
}


/**
 * convertir une pair prise du format de l'object signal vert le formet de kucoin
 * @param {string} pair paire à convertir dans le format ADC/UED (format de Signal)
 * @param {TradeType} type type final ( future ? spot ? ) 
 * @returns {string} resultat de la conversion dansvers le format aproprié OU 
 */
const convertSignalPairToKucoinPair = (pair, type=TradeType.future)=>{
    if(type == TradeType.future){
        return (pair.split('/').join('') + "M").toUpperCase();
    }else if( type == TradeType.spot){
        return pair.split('/').join('').toUpperCase() ;
    }
}

/**
 * signer un json avec sha256- hashmac ( kucoin method)
 * @param {object} body le JSON representant le body
 * @param {object} othersToAddInSignature autres choses à ajouter 
 * @param {string | undefined} othersToAddInSignature.method Methode (HttpMethod.POST, HttpMethod.GET, ..) - spécial Kucoin haha
 * @param {string | undefined} othersToAddInSignature.endpoint endpoint dédié à kucoin: - spécial kucoin pour le moment haha
 * @param {number | undefined} othersToAddInSignature.timestamp timestamps re la request (pour synchroniser avec celui de la requette elle meme)
 * @returns {string} signed body
 */
const signBody = (body ,secretKey, othersToAddInSignature)=>{

    const preparedString = othersToAddInSignature.timestamp.toString() + othersToAddInSignature.method + othersToAddInSignature.endpoint + JSON.stringify(body)
    return sha256_hashMac_hash
    (
        secretKey, 
        preparedString
    );
}


/**
 * Faire un ordre avec kucoin
 * @param {Signal} signal le signal à executer
 * @param {boolean} executeNow defaut: true - si on execute l'ordre avec le prix du marché ou pas.
 * @param {TraderAgent} traderAgent 
 */
const makeOrder = async (signal, traderAgent, executeNow=true)=>{
    // OK ici tous les ordres vont êtres stop - limite. pour les ordre market, les borndes d'entrés >0 so ça a vas directement exécutéer et donc simuler le market
    const endpoint = "/api/v1/st-orders";
    const tradeAmount = 5;
    const body =  
    {
        clientOid: signal.getId().toString(),
        side: signal.getTp() > signal.getSl() ? "buy" : "sell",
        symbol: convertSignalPairToKucoinPair(signal.getpair()),
        leverage: 10,
        type: executeNow ? "market":"limit",
        valueQty: tradeAmount.toString(),
        stop: signal.getTp() > signal.getSl() ? "down" : "up",
        stopPriceType: "TP",
        triggerStopUpPrice: signal.getTp().toString(),
        triggerStopDownPrice: signal.getSl().toString()
    };

    if(body.type == "limit"){
        body.price = (signal.getTp() > signal.getSl() && !executeNow) ? signal.getEntryUpperBorn().toString() : signal.getEntryLowerBorn().toString();
    }

    const timestamp = Date.now();
    const method = HttpMethod.POST;
    const signedPassPhrase = sha256_hashMac_hash(
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        encryptService.decryptData(traderAgent.getCredentials().passPhrase)
    )

    const signedBody = signBody(body, 
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        {
            method: method,
            endpoint: endpoint,
            timestamp: timestamp
        }
    )

    const apiKey= encryptService.decryptData(traderAgent.getCredentials().api_key);
    const apiVersion = traderAgent.getCredentials().api_version;

    const response = await axios.request({
        url: kucoinApiUrl+endpoint,
        method: method,
        headers:{
            "Content-Type": "application/json",
            "KC-API-KEY": apiKey,
            "KC-API-SIGN": signedBody,
            "KC-API-TIMESTAMP": timestamp,
            "KC-API-PASSPHRASE": signedPassPhrase,
            "KC-API-KEY-VERSION": apiVersion
        },
        data: body
    });

    console.log((response?.data?.code != '200000') ? "trade non exécuté. stop loss mal set pour celui-ci "+response.data?.msg : "trade executé:");

    // const response = await getLimitRisk(signal);

    return response?.data;
}


/**
 * Placer un ordre "Take profit"
 * @param {Signal} signal le signal à executer le type TP est particulier en ceci qu'il vas inverser les buy/sell pour que ça corresponde prise de profit effective
 * @param {TraderAgent} traderAgent l'agent de trading kucoin qui vas faire le trade
 * @param {boolean} reduceOnly default: true - determine is les ordre sont ceux de tp uniquement
 */
const makeTpOrder = async (signal, traderAgent, reduceOnly=true)=>{
    // OK ici tous les ordres vont êtres stop - limite. pour les ordre market, les borndes d'entrés >0 so ça a vas directement exécutéer et donc simuler le market
    const endpoint = "/api/v1/st-orders";
    const tradeAmount = 3;

    const body =  
    {
        clientOid: signal.getId().toString(),
        side: signal.getTp() > signal.getSl() ? "sell" : "buy",
        symbol: convertSignalPairToKucoinPair(signal.getpair()),
        leverage: 10,
        type: "limit",
        valueQty: tradeAmount.toString(),
        stop: signal.getTp() > signal.getSl() ? "up" : "down",
        stopPriceType: "TP",
        reduceOnly: reduceOnly,
        triggerStopUpPrice: signal.getSl().toString(),
        triggerStopDownPrice: signal.getTp().toString()
    };

    if(body.type == "limit"){
        body.price = (signal.getTp() > signal.getSl()) ? signal.getEntryUpperBorn().toString() : signal.getEntryLowerBorn().toString();
    }

    const timestamp = Date.now();
    const method = HttpMethod.POST;
    const signedPassPhrase = sha256_hashMac_hash(
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        encryptService.decryptData(traderAgent.getCredentials().passPhrase)
    )

    const signedBody = signBody(body, 
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        {
            method: method,
            endpoint: endpoint,
            timestamp: timestamp
        }
    )

    const apiKey= encryptService.decryptData(traderAgent.getCredentials().api_key);
    const apiVersion = traderAgent.getCredentials().api_version;

    const response = await axios.request({
        url: kucoinApiUrl+endpoint,
        method: method,
        headers:{
            "Content-Type": "application/json",
            "KC-API-KEY": apiKey,
            "KC-API-SIGN": signedBody,
            "KC-API-TIMESTAMP": timestamp,
            "KC-API-PASSPHRASE": signedPassPhrase,
            "KC-API-KEY-VERSION": apiVersion
        },
        data: body
    });

    // const response = await getLimitRisk(signal);

    return response?.data;
}


/**
 * Annuler tous les ordres d'une paire.
 * @param {string} pair - format AAS/UROI 
 * @param {TraderAgent} traderAgent - format trader agent
 */
const cancelAllFutureOrdersByPair = async (pair, traderAgent)=>{
    const targetPair = convertSignalPairToKucoinPair(pair, TradeType.future);

    const apiKey= encryptService.decryptData(traderAgent.getCredentials().api_key);
    const apiVersion = traderAgent.getCredentials().api_version;
    const body = {};
    const timestamp = Date.now();
    let endpoint = "/api/v3/orders?symbol="+targetPair;
    const method = HttpMethod.DELETE;
    const signedPassPhrase = sha256_hashMac_hash(
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        encryptService.decryptData(traderAgent.getCredentials().passPhrase)
    )
    let signedBody = signBody(
        body,
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        {
            method: method,
            endpoint: endpoint,
            timestamp: timestamp
        }
    );

    // console.log("targetpairs:", targetPair)

    // non stop orders request
    const response1 = await axios.request({
        url: kucoinApiUrl+endpoint,
        method: method,
        headers:{
            "Content-Type": "application/json",
            "KC-API-KEY": apiKey,
            "KC-API-SIGN": signedBody,
            "KC-API-TIMESTAMP": timestamp,
            "KC-API-PASSPHRASE": signedPassPhrase,
            "KC-API-KEY-VERSION": apiVersion
        },
        data: body
    });

    // resignature du body pour la requette des ordres stops

    
    endpoint = "/api/v1/stopOrders?symbol="+targetPair;
    signedBody = signBody(
        body,
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        {
            method: method,
            endpoint: endpoint,
            timestamp: timestamp
        }
    );

    // stop orders
    const response2 = await axios.request({
        url: kucoinApiUrl+ endpoint,
        method: method,
        headers:{
            "Content-Type": "application/json",
            "KC-API-KEY": apiKey,
            "KC-API-SIGN": signedBody,
            "KC-API-TIMESTAMP": timestamp,
            "KC-API-PASSPHRASE": signedPassPhrase,
            "KC-API-KEY-VERSION": apiVersion
        },
        data: body
    });
    
    return {
        nonStopOders: response1,
        stopOders: response2
    };
}



/**
 * 
 * @param {TraderAgent} traderAgent 
 * @returns 
 */
const getAllActiveOrders = async (traderAgent)=>{
    const endpoint= "/api/v1/orders";
    const urlParams = "?status=active";
    const timestamp = Date.now();

    const apiKey= encryptService.decryptData(traderAgent.getCredentials().api_key);
    const apiVersion = traderAgent.getCredentials().api_version;

    const signedPassPhrase = sha256_hashMac_hash(
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        encryptService.decryptData(traderAgent.getCredentials().passPhrase)
    )


    const response = await axios.request({
        url: kucoinApiUrl + endpoint + urlParams,
        method: HttpMethod.GET,
        headers:{
            "Content-Type": "application/json",
            "KC-API-KEY": apiKey,
            "KC-API-SIGN": signedBody,
            "KC-API-TIMESTAMP": timestamp,
            "KC-API-PASSPHRASE": signedPassPhrase,
            "KC-API-KEY-VERSION": apiVersion
        },
    });

    return response?.data;
}

/**
 * créer un nouveau token public pour l'acces websocket secured
 * @param {TraderAgent} traderAgent 
 */
const createNewWSSToken = async (traderAgent)=>{
    const endpoint = "/api/v1/bullet-public";
    const body ={};

    const timestamp = Date.now();
    const method = HttpMethod.POST;
    const signedPassPhrase = sha256_hashMac_hash(
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        encryptService.decryptData(traderAgent.getCredentials().passPhrase)
    )

    const signedBody = signBody(body, 
        encryptService.decryptData(traderAgent.getCredentials().secret_key),
        {
            method: method,
            endpoint: endpoint,
            timestamp: timestamp
        }
    )

    const apiKey= encryptService.decryptData(traderAgent.getCredentials().api_key);
    const apiVersion = traderAgent.getCredentials().api_version;

    const response = await axios.request({
        url: kucoinApiUrl+endpoint,
        method: method,
        headers:{
            "Content-Type": "application/json",
            "KC-API-KEY": apiKey,
            "KC-API-SIGN": signedBody,
            "KC-API-TIMESTAMP": timestamp,
            "KC-API-PASSPHRASE": signedPassPhrase,
            "KC-API-KEY-VERSION": apiVersion
        },
        data: body
    });

    return response?.data;
}


/**
 * Écouter dans la branche public
 * @param {TraderAgent} traderAgent 
 * @returns {WebSocket} l'object pour manipuler la connexion
 */
const listenWSS = async (traderAgent)=>{
    const endpoint = "?token="+traderAgent.getCredentials().wss_token + "&connectId="+ traderAgent.getId();
    const socket = new WebSocket(kucoinWSSUrl+endpoint);

    socket.onopen = (ev)=>{
        
    }
    return socket;
}

/**
 * 
 * @param {WebSocket} targetSocket socket à télécharger 
 * @returns {boolean} si la socket cible a bien été déconnecté ou pas.
 */
const closeWSS = (targetSocket)=>{
    if(targetSocket != null){
        targetSocket.close();
        return targetSocket.readyState == targetSocket.CLOSED;
    }else{
        return false;
    }
}

/**
 * @param {Signal} signal dont on veut déterminer le rsique limite de la pair
 */
const getLimitRisk = async (signal)=>{
    const response = await axios.request({
        url: kucoinApiUrl+"/api/v1/contracts/risk-limit/"+convertSignalPairToKucoinPair(signal.getpair()),
        method: HttpMethod.GET,
        headers:{
            "Content-Type": "application/json"
        },
    });

    return response;
}


module.exports = {
    cancelAllFutureOrdersByPair,
    convertSignalPairToKucoinPair,
    makeOrder,
    makeTpOrder,
    getAllActiveOrders,
    createNewWSSToken,
    listenWSS,
    closeWSS
}