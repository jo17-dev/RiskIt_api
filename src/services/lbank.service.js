const axios = require('axios');
const crypto = require('crypto');

// L'URL de l'API publique pour récupérer les paires de trading disponibles
const url = 'https://api.lbkex.com/v2/';


// récupération des pairs de trading disponibles
async function getTradingPairs(range_start=0, range_end=20) {
  try {
    // Envoi de la requête GET pour récupérer les paires de trading
    const response = await axios.get(url+ "currencyPairs.do");

    // Vérification du statut de la réponse
    if (response.data && response.data.data) {
        const pairs = response.data.data;
        console.log('Paires de trading disponibles (entre '+range_start+ ' et '+range_end+')');
        return pairs.slice(range_start, range_end);
    } else {
      console.log('Aucune paire de trading disponible.');
      return [];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des paires de trading :', error.message);
    return [];
  }
}
// /v2/assetConfigs.do
async function getAssetConfigs(range_start=0, range_end=20) {
    try {
      // Envoi de la requête GET pour récupérer les paires de trading
      const response = await axios.get(url+ "withdrawConfigs.do");
  
      // Vérification du statut de la réponse
      if (response.data && response.data.data) {
        const pairsConfig = response.data.data;
        console.log('configuration des assets');
      return pairsConfig;
      } else {
        console.log('Aucune paire de trading disponible.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des paires de trading :', error.message);
      return [];
    }
  }

// Fonction pour créer la signature pour l'API LBank
function createSignature(params) {
    const queryString = new URLSearchParams(params).toString();
    return crypto.createHmac('sha256', API_SECRET).update(queryString).digest('hex');
}

async function getBalance() {
    const endpoint = url+"/v2/supplement/user_info.do";  // URL de l'API pour obtenir les informations de compte
    const params = {
      api_key: API_KEY,
      timestamp: Date.now(),  // Timestamp actuel pour garantir l'unicité
    };
  
    // Générer la signature
    const signature = createSignature(params);
    params.sign = signature;
  
    try {
      // Envoyer la requête GET avec les paramètres de signature
      const response = await axios.get(endpoint, { params });
  
      if (response.data && response.data.data) {
        console.log('Solde du compte :', response.data.data);
      } else {
        console.log('Erreur : Impossible de récupérer le solde');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du solde :', error.message);
    }
}

module.exports = {
    getBalance,
    getTradingPairs
}
  