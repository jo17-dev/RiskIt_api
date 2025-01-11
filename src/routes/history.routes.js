const router = require('express').Router();

const clientMiddleWare = require('../middlewares/isClient.middleware');
const historyController = require('../controllers/history.controller');

// definitions des middlewares
router.all("/", clientMiddleWare);



// historique complet des routes
router.get('/', (req, res)=>{
    historyController.getCompleteHistory()
    .then((value)=>{
        console.log("trades récupés");
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