// OUUIIIII je sait ce fichier ne fait pas de sens étant donné qu'on notre la présente de 
// l'IA hahahaha. Mais promis je vais le changer dans les autres versions

const Signal = require("../models/Signal.class");


/**
 * Extrait les informations d'un signal de trading à partir d'un message de signal.
 *
 * @param {string} message - Le message du signal de trading contenant les informations à extraire.
 * @param {number} monitored_target_id l'id du compte de provenenance dans la db 
 * @returns {Signal | null} Un objet contenant les données extraites du signal de trading.
 */
function retreiveSignalFromTextV1(message, monitored_target_id) {
    // Extraction de la paire de trading (exemple: #XVS/USDT)
    const pairMatch = message.match(/#([A-Za-z0-9]+\/[A-Za-z0-9]+)/);
    const pair = pairMatch ? pairMatch[1] : null;

    // Extraction du type de trading (LONG ou SHORT)
    const typeMatch = message.match(/(LONG|SHORT)\s*:/);
    const type = typeMatch ? typeMatch[1] : null;

    // Extraction du prix d'entrée (après LONG ou SHORT)
    const entryPriceMatch = message.match(/(LONG|SHORT)\s*[:\s]*([\d.]+)/);
    const entryPrice = entryPriceMatch ? parseFloat(entryPriceMatch[2]) : null;

    // Extraction des Take profits (tous les 🚀 suivis de nombres)
    const takeProfitMatches = message.match(/🚀(\d+(\.\d+)?)/g);
    const takeProfits = takeProfitMatches ? takeProfitMatches.map(val => parseFloat(val.replace('🚀', ''))) : null;

    // Extraction du Stop loss (⛔ suivi d'un nombre)
    const stopLossMatch = message.match(/⛔\s*STOP\s*LOSS:\s*(\d+(\.\d+)?)/);
    const stopLoss = stopLossMatch ? parseFloat(stopLossMatch[1]) : null;

    // Extraction du Leverage (exemple: 10x)
    const leverageMatch = message.match(/Leverage\s*:\s*(\d+x)/);
    const leverage = leverageMatch ? leverageMatch[1].replace('x', '') : null;

    if(pair && type && takeProfits ){
        return new Signal(null, monitored_target_id, pair ,takeProfits[0], stopLoss, entryPrice, entryPrice, null ,Date.now(), Date.now());
    }else{
        return null;
    }

}


module.exports = {retreiveSignalFromTextV1}