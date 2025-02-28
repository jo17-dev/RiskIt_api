const { json } = require("express");

/**
 * Modèle représentant un compte fournisseur: genre telegram, discord, insta, ...
 * @typedef {Object} ProviderAccount
 * @property {number} id - L'ID unique du compte fournisseur.
 * @property {number} userId - L'ID de l'utilisateur associé au compte fournisseur.
 * @property {string} platformName - Le nom de la plateforme du fournisseur.
 * @property {Object} credentials - Les informations d'identification (clé API, token, etc.) pour accéder au compte fournisseur.
 * @property {Date} createdAt - La date de création du compte fournisseur.
 * @property {Date} updatedAt - La date de mise à jour du compte fournisseur.
 */
class ProviderAccount {
    /**
     * Crée une instance d'un compte fournisseur.
     * @param {number} id - L'ID unique du compte fournisseur.
     * @param {number} userId - L'ID de l'utilisateur associé au compte fournisseur.
     * @param {string} platformName - Le nom de la plateforme du fournisseur.
     * @param {Object} credentials - Les informations d'identification du compte fournisseur.
     * @param {Date} createdAt - La date de création.
     * @param {Date} updatedAt - La date de mise à jour.
     */
    constructor(id, userId, platformName, credentials, createdAt, updatedAt) {
      this.#id = id;
      this.#userId = userId;
      this.#platformName = platformName;
      this.#credentials = credentials;
      this.#createdAt = createdAt;
      this.#updatedAt = updatedAt;
    }
  
    // Propriétés privées
    #id;
    #userId;
    #platformName;
    #credentials;
    #createdAt;
    #updatedAt;
  
    // Getters
    getId() {
      return this.#id;
    }
  
    getUserId() {
      return this.#userId;
    }
  
    getPlatformName() {
      return this.#platformName;
    }
  
    getCredentials() {
      return this.#credentials;
    }
  
    getCreatedAt() {
      return this.#createdAt;
    }
  
    getUpdatedAt() {
      return this.#updatedAt;
    }
  
    // Setters
    setId(value) {
      this.#id = value;
    }
  
    setUserId(value) {
      this.#userId = value;
    }
  
    setPlatformName(value) {
      this.#platformName = value;
    }
  
    setCredentials(value) {
      this.#credentials = value;
    }
  
    setCreatedAt(value) {
      this.#createdAt = value;
    }
  
    setUpdatedAt(value) {
      this.#updatedAt = value;
    }
  
    /**
     * Affiche les détails du compte fournisseur.
     * @returns {string} - Retourne les détails du compte fournisseur.
     */
    displayInfo() {
      return `Provider Account [${this.#id}]: ${this.#platformName}, User ID: ${this.#userId}`;
    }

    toString(){
      return JSON.stringify(
        {
          id: this.#id,
          userId: this.#userId,
          platformName: this.#platformName,
          createdAt: this.#createdAt,
          updatedAt: this.#updatedAt
        }
      )
    }
  }
  
  module.exports = ProviderAccount;
  