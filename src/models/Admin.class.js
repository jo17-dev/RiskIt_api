/**
 * Modèle représentant un administrateur.
 * @typedef {Object} Admin
 * @property {number} userId - L'ID de l'utilisateur associé à l'administrateur.
 */
class Admin {
    /**
     * Crée une instance d'un administrateur.
     * @param {number} userId - L'ID de l'utilisateur associé à l'administrateur.
     */
    constructor(userId) {
      this.#userId = userId;
    }
  
    // Propriété privée
    #userId;
  
    // Getter
    getUserId() {
      return this.#userId;
    }
  
    // Setter
    setUserId(value) {
      this.#userId = value;
    }
  
    /**
     * Affiche l'ID de l'utilisateur administrateur.
     * @returns {string} - Retourne l'ID de l'utilisateur administrateur.
     */
    displayInfo() {
      return `Admin associated with user ID: ${this.#userId}`;
    }
  }
  
  module.exports = Admin;
  