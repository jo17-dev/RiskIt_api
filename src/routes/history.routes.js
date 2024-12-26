const router = require('express').Router();

const historyController = require('../controllers/history.controller');


router.get('/', (req, res)=>{
    historyController.getCompleteHistory()
    .then((value)=>{
        console.log("trades récupéer");
        res.json({
            datas: value
        });     
    }).catch(
        (reason)=>{
            console.log("echec de la recuperation des trades");
            res.json({
                datas: []
            })
        }
    )
});

module.exports = router;