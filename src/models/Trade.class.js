/**
 * Modèle représentant un trade fait
 * @typedef {Object} Trade
 * @property {number} id - L'ID unique du trade.
 * @property {number} traderClientId - L'ID du client trader associé au trade.
 * @property {number} signalId - L'ID du signal associé au trade.
 * @property {number} amountTraded - Le montant échangé.
 * @property {number} marge - Le bénéfice ou la marge du trade.
 * @property {Date} createdAt - La date de création du trade.
 * @property {Date} updatedAt - La date de mise à jour du trade.
 */
class Trade {
    /**
     * Crée une instance d'un trade.
     * @param {number} id - L'ID unique du trade.
     * @param {number} traderClientId - L'ID du client trader associé.
     * @param {number} signalId - L'ID du signal associé.
     * @param {number} amountTraded - Le montant échangé.
     * @param {number} marge - La marge du trade.
     * @param {Date} createdAt - La date de création.
     * @param {Date} updatedAt - La date de mise à jour.
     */
    constructor(id, traderClientId, signalId, amountTraded, marge, createdAt, updatedAt) {
      this.#id = id;
      this.#traderClientId = traderClientId;
      this.#signalId = signalId;
      this.#amountTraded = amountTraded;
      this.#marge = marge;
      this.#createdAt = createdAt;
      this.#updatedAt = updatedAt;
    }
  
    // Propriétés privées
    #id;
    #traderClientId;
    #signalId;
    #amountTraded;
    #marge;
    #createdAt;
    #updatedAt;
  
    // Getters
    getId() {
      return this.#id;
    }
  
    getTraderClientId() {
      return this.#traderClientId;
    }
  
    getSignalId() {
      return this.#signalId;
    }
  
    getAmountTraded() {
      return this.#amountTraded;
    }
  
    getMarge() {
      return this.#marge;
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
  
    setTraderClientId(value) {
      this.#traderClientId = value;
    }
  
    setSignalId(value) {
      this.#signalId = value;
    }
  
    setAmountTraded(value) {
      this.#amountTraded = value;
    }
  
    setMarge(value) {
      this.#marge = value;
    }
  
    setCreatedAt(value) {
      this.#createdAt = value;
    }
  
    setUpdatedAt(value) {
      this.#updatedAt = value;
    }
  
    /**
     * Affiche les détails du trade.
     * @returns {string} - Retourne les détails du trade.
     */
    displayInfo() {
      return `Trade [${this.#id}]: Amount = ${this.#amountTraded}, Marge = ${this.#marge}`;
    }
  }
  
  module.exports = Trade;
  