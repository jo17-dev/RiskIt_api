const express = require('express');
const isAdminMiddleware = require('../middlewares/isAdmin.middleware');
const isClientMiddleware = require('../middlewares/isClient.middleware');
const { convertpair } = require('../controllers/kucoin.controller');
const kucoinController = require('../controllers/kucoin.controller');
const router = express.Router();

// middlewares
router.all('/', isAdminMiddleware);
router.post('/trade', isClientMiddleware);


// get all user's trades done by this service on kucoin
router.get('/trades', (req, res)=>{
   kucoinController.getAllActiveOrders().then(
      (value)=>{
         res.json({
            message: "recuperation de l'ensemble des trades actifs sur kucoin",
            datas: value
           });
      }).catch((reason)=>{
         res.json({
            message: "Une errer est suvenue::",
            resason: reason?.message
         })
      })


});


// make a trade route privée
router.post('/trade', (req, res)=>{
    kucoinController.createmarketOrder().then(
      (value)=>{
         console.log(value);
         res.json(value);
      }
    ).catch(err=>{
      console.log(err);
      res.json(err);
    })
});


// get a trade informations on kucoin
router.get('/trade/:idTrade', (req, res)=>{
       
});

// testing route
router.get('/test', (req, res)=>{
   res.json({
      message: "conversion:: ",
      "ETH/USDT": convertpair("ETH/USDT")
   })
});

// creation du jeton publique de connexion
router.post('/create-ws-token', async (req, res)=>{
   await kucoinController.createNewWSSToken().then(
      value=>{
         res.json({
            message: "Validation des aqucis",
            resultat: value
         })
      }
   ).catch(
      resason=>{
         res.json({
            message: "Echec",
            resultat: resason?.message
         })
      }
   )

});

router.post('/send-ws-message', (req, res)=>{
   try{
      kucoinController.sendWSSMessage({
         id: "1545910590801",
         type: "ping"
      });

      res.json({
         message: "reussie"
      })
   }catch(err){
      console.log(err);
      res.json({
         message: "Echec de l'op",
         content: err?.message
      })
   }
});

router.get('/listen-ws', async (req, res)=>{
   await kucoinController.listenWS().then(
      (value)=>{
         console.log("Le client est connecté");
         res.json({
            message: "Le client est connecté",
            value: value?.data
         });
      }
   ).catch(
      err=>{
         console.log(err);
         res.json({
            message: "Une erreure est survenue",
            reason: err?.message
         });
      }
   )
});

router.get('/close-ws', async (req, res)=>{
   await kucoinController.closeKucoinWSS().then(
      (value)=>{
         res.json({
            message: "Operation de déconnexion réussie",
            value: value?.data
         });
      }
   ).catch(
      err=>{
         console.log(err);
         res.json({
            message: "Une erreure est survenue",
            reason: err?.message
         });
      }
   )
});


// cancel a trade
router.patch('/trade/:idTrade/update', (req, res)=>{
    
});

// delete a trade ( and his related signals if applied)
router.delete('/trade/:idTrade/cancel', (req, res)=>{
   kucoinController.cancelOrder("YFI/USDT").then(
      (value)=>{
         res.json(value.data);
      }
   ).catch((reason)=>{
      console.log("god damn")
      res.json(reason?.message);
   })
});


module.exports = router;