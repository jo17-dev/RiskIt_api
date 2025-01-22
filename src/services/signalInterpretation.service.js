// OUUIIIII je sait ce fichier ne fait pas de sens étant donné qu'on notre la présente de 
// l'IA hahahaha. Mais promis je vais le changer dans les autres versions

const Signal = require("../models/Signal.class");


/**
 * Extrait les de trading à partir d'un message de signal.
 * Il renvoie un ensemble de signaux lié à celui-ci
 * @param {string} message - Le message du signal de trading contenant les informations à extraire.
 * @param {number} monitored_target_id l'id du compte de provenance dans la db 
 * @returns {Array<Signal | null>} Un tableau contenant les données extraites du signal de trading.
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
    const takeProfits = takeProfitMatches ? takeProfitMatches.map(val => parseFloat(val.replace('🚀', ''))) : [];

    // Extraction du Stop loss (⛔ suivi d'un nombre)
    const stopLossMatch = message.match(/⛔\s*STOP\s*LOSS:\s*(\d+(\.\d+)?)/);
    const stopLoss = stopLossMatch ? parseFloat(stopLossMatch[1]) : null;

    // Extraction du Leverage (exemple: 10x)
    const leverageMatch = message.match(/Leverage\s*:\s*(\d+x)/);
    const leverage = leverageMatch ? leverageMatch[1].replace('x', '') : null;

    const result = [];

    // Si les données essentielles sont présentes, créer le signal
    if (pair && type && entryPrice && takeProfits.length > 0 && stopLoss !== null) {
        // On crée un signal avec les informations extraites

        const date = Date.now();
        // premier signal correspondant
        result.push(
            new Signal(
                null,
                monitored_target_id,
                pair,
                takeProfits[0],
                stopLoss,
                entryPrice,
                entryPrice,
                null,
                date,
                date
            )
        )

        // les signaux pour les autres TP sont mappés
        for(let i=1; i<takeProfits.length; i++){
            result.push(
                new Signal(
                    null,
                    monitored_target_id,
                    pair,
                    takeProfits[i],
                    takeProfits[i-1],
                    takeProfits[i-1],
                    takeProfits[i-1],
                    null,
                    date,
                    date
                )
            )
        }
        return result;
    } else {
        return [];
    }
}

module.exports = {retreiveSignalFromTextV1}