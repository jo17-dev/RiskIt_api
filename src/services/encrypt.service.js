// fichier de chiffrement et de déchifrement
require('dotenv').config();
const crypto = require('crypto');

// Charger les clés RSA depuis les variables d'environnement
const publicKey = process.env.RSA_PUBLIC_KEY.replace(/\\n/g, '\n');
const privateKey = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n');

// Fonction pour chiffrer des données avec la clé publique
function encryptData(data) {
    const buffer = Buffer.from(data, 'utf-8');  // Convertir les données en buffer
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');  // Retourner les données chiffrées en base64
}

// Fonction pour déchiffrer des données avec la clé privée
function decryptData(encryptedData) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf-8');  // Retourner les données déchiffrées en texte lisible
}

module.exports = {
    encryptData,
    decryptData,
    encryptDataFromBuffer
};