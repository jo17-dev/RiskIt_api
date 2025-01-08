/**
 * Modèle représentant une cible surveillée.
 * @typedef {Object} MonitoredTarget
 * @property {number} id - L'ID unique de la cible surveillée.
 * @property {number} providedAccountId - L'ID du compte fournisseur associé.
 * @property {string} targetName - Le nom de la cible (par exemple, un canal à surveiller).
 * @property {Object} others - Autres données selon le compte fournisseur.
 * @property {Date} createdAt - La date de création de la cible surveillée.
 * @property {Date} updatedAt - La date de mise à jour de la cible surveillée.
 */
class MonitoredTarget {
    /**
     * Crée une instance d'une cible surveillée.
     * @param {number} id - L'ID unique de la cible surveillée.
     * @param {number} providedAccountId - L'ID du compte fournisseur associé.
     * @param {string} targetName - Le nom de la cible surveillée.
     * @param {Object} others - Autres données associées à la cible.
     * @param {Date} createdAt - La date de création.
     * @param {Date} updatedAt - La date de mise à jour.
     */
    constructor(id, providedAccountId, targetName, others, createdAt, updatedAt) {
      this.#id = id;
      this.#providedAccountId = providedAccountId;
      this.#targetName = targetName;
      this.#others = others;
      this.#createdAt = createdAt;
      this.#updatedAt = updatedAt;
    }
  
    // Propriétés privées
    #id;
    #providedAccountId;
    #targetName;
    #others;
    #createdAt;
    #updatedAt;
  
    // Getters
    getId() {
      return this.#id;
    }
  
    getProvidedAccountId() {
      return this.#providedAccountId;
    }
  
    getTargetName() {
      return this.#targetName;
    }
  
    getOthers() {
      return this.#others;
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
  
    setProvidedAccountId(value) {
      this.#providedAccountId = value;
    }
  
    setTargetName(value) {
      this.#targetName = value;
    }
  
    setOthers(value) {
      this.#others = value;
    }
  
    setCreatedAt(value) {
      this.#createdAt = value;
    }
  
    setUpdatedAt(value) {
      this.#updatedAt = value;
    }
  
    /**
     * Affiche les détails de la cible surveillée.
     * @returns {string} - Retourne les détails de la cible surveillée.
     */
    displayInfo() {
      return `Monitored Target [${this.#id}]: ${this.#targetName}, Provided Account ID: ${this.#providedAccountId}`;
    }
  }
  
  module.exports = MonitoredTarget;
  