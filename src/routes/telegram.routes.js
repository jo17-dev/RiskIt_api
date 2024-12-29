const router = require('express').Router();
const telegramController = require('../controllers/telegram.controller');


/**
 * router pour lancer une connexion:  
 */
router.post('/start', (req, res)=>{

    // si le numero de telephone est présent, celà veut dire qu'il faut créer un client telegram
    if('phoneNumber' in req.body){
        console.log("demarage de telegram; numéro de telephone: ", req.body.phoneNumber);
        res.json({
            statusText: "OK",
            message: "Le numéro de telephone est autorisé. Attente du code d'authenfiication reçu via telegram"
        });
    }
    // else if('opt_telegram' in req.body) {
    //     res.json({
    //         statusText: "OK",
    //         message: "Le client est completement authentifié..."
    //     });
    // }else{
    //     res.json({
    //         statusText: "Error",
    //         message: "Aucune information pertinente pour le demarage de l'application n'as été trouvée"
    //     });
    // }


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