const router = require('express').Router();
const telegramController = require('../controllers/telegram.controller');


/**
 * router pour lancer une connexion:  
 */
router.post('/start', (req, res)=>{
    
});

/**
 * Router stopper l'application telegram
 */
router.get('/stop', (req, res)=>{
    telegramController.closeEngine();
});


/**
 * Récupérer les infos générales de telegram
 * comme le statut de connexion, la durée de connexion de la session
 */
router.get('/', (req, res)=>{
    console.log("get à la racine des routes pour telegram")
});

module.exports = router;