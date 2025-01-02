// ce fichier contient les routes accessibles l'utilisation de lbank

const router = require('express').Router();
const lbankController = require('../controllers/lbank.controller');
const Trade = require('../models/Trade.class');


// creation d'un trade 
router.get('/pairs', (req, res)=>{
    console.log("get --lbank trades pais");

    lbankController.getTradingPairs().then(
        (value)=>{
            res.json({
                datas: value
            })
            console.log("pairs récupéré")
        }
    ).catch(
        (reason)=>{
            console.log(reason);
            console.log("echec de la recuperation de pairs de trading dispo");
            
            res.json({
                message: "echec de la recuperation de pairs de trading disponibles"
            });
        }
    )
});


// ajout d'un trade en REST
router.post('/trades', (req, res)=>{
    console.log("get-lbank-trades")

    if(req.statusCode == 200){
        const retreivedDatas = req.body;
        lbankController.makeAFutureTrade(retreivedDatas.sl, retreivedDatas.tp, retreivedDatas.entry_price)
        .then((value)=>{
            res.json({
                is_done: value
            });
        }).catch((reason)=>{
            console.log("Le trade n'as pa pu être effectueé")
            console.log(reason);
        })
    }


    res.json({
        message: "Le trade n'as pas pu être effectué"
    })
})

module.exports = router;