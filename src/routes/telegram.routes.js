const router = require('express').Router();
const telegramController = require('../controllers/telegram.controller');
const adminMiddleware = require('../middlewares/isAdmin.middleware');
const clientMiddleware = require('../middlewares/isClient.middleware');

// definission des middlewares:
router.all(["/start", "/stop"], adminMiddleware); // routes pour admin
router.all(["/pool", "/pool/add"], clientMiddleware); // routes pour client




let stopEngine = null; // i use this to manage to stop the startEngine setInterval it return another function to stop it

// get engine status
router.get('/status', (req, res)=>{
    res.json(telegramController.getEngineStatut());
});
/**
 * Récupérer les infos générales de telegram
 * comme le statut de connexion, la durée de connexion de la session
 */
router.get('/', (req, res)=>{
    console.log("get à la racine des routes pour telegram");
    res.json({
        statutText: "OK",
        message: "sorry, the functionality is not implemented yet"
    });
});


router.get('/pool/add/:providerId', (req, res)=>{
    telegramController.addClientToPool(parseInt(req.params.providerId))
    .then((value)=>{
        res.json({
            statusText: "OK",
            message: "Le client à été coorectement ajouté à la pool de monitoring pour les signaux"
        })
    }).catch((reason)=>{
        res.json({
            statusText: "Failed",
            message: reason.message
        });
    })
});

// start the telegram engine:
router.get('/start', (req, res)=>{

    // si le numero de telephone est présent, celà veut dire qu'il faut créer un client telegram
    // On vas démarer le processus de monitoring des comptes telegram.
        console.log("demarage du process de monitoring telegram");

    telegramController.startEngine(req.body.phoneNumber).then(
        (value)=>{
            stopEngine = value;
            res.json({
                statusText: "OK",
                message: "Le moteur a correctement démaré"
            });
        }
    ).catch((reason)=>{
        console.log(reason.message);
        res.json({
            statusText: "Failed",
            message: reason.message
        });
    })

});


/**
 * Router stopper l'application telegram
 */
router.get('/stop', (req, res)=>{
    // telegramController.closeEngine();
    if(stopEngine != null){
        stopEngine();
        res.json({
            statutText: "OK",
            message: "Telegram a bien été arrêté"
        });
    }else{
        res.json({
            statutText: "Failed",
            message: "Telegram n'as pas pû être arreté"
        });
    }
});


module.exports = router;