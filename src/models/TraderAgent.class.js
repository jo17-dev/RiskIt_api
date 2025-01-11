/**
 * Modèle représentant un agent de trading (lbank, etc...)
 * @typedef {Object} TraderAgent
 * @property {number} id - L'ID unique de l'agent.
 * @property {number} userId - L'ID de l'utilisateur associé à l'agent.
 * @property {string} agentName - Le nom de l'agent.
 * @property {Object} credentials - Les informations d'identification de l'agent (ex. clé API).
 * @property {Date} createdAt - La date de création de l'agent.
 * @property {Date} updatedAt - La date de mise à jour de l'agent.
 */
class TraderAgent {
    /**
     * Crée une instance d'un agent de trading.
     * @param {number} id - L'ID unique de l'agent.
     * @param {number} userId - L'ID de l'utilisateur associé.
     * @param {string} agentName - Le nom de l'agent.
     * @param {Object} credentials - Les informations d'identification de l'agent.
     * @param {Date} createdAt - La date de création.
     * @param {Date} updatedAt - La date de mise à jour.
     */
    constructor(id, userId, agentName, credentials, createdAt, updatedAt) {
      this.#id = id;
      this.#userId = userId;
      this.#agentName = agentName;
      this.#credentials = credentials;
      this.#createdAt = createdAt;
      this.#updatedAt = updatedAt;
    }
  
    // Propriétés privées
    #id;
    #userId;
    #agentName;
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
  
    getAgentName() {
      return this.#agentName;
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
  
    setAgentName(value) {
      this.#agentName = value;
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
     * Affiche les détails de l'agent de trading.
     * @returns {string} - Retourne les détails de l'agent de trading.
     */
    displayInfo() {
      return `Trader Agent [${this.#id}]: ${this.#agentName}, User ID: ${this.#userId}`;
    }
  }
  
  module.exports = TraderAgent;
  