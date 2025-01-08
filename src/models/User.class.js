/**
 * Modèle représentant un utilisateur.
 * @typedef {Object} User
 * @property {number} id - L'ID unique de l'utilisateur.
 * @property {string} name - Le nom de l'utilisateur.
 * @property {string} email - L'email de l'utilisateur.
 * @property {string} password - Le mot de passe de l'utilisateur.
 * @property {Date} createdAt - La date de création de l'utilisateur.
 * @property {Date} updatedAt - La date de mise à jour de l'utilisateur.
 */
class User {
    /**
     * Crée une instance de l'utilisateur.
     * @param {number} id - L'ID unique de l'utilisateur.
     * @param {string} name - Le nom de l'utilisateur.
     * @param {string} email - L'email de l'utilisateur.
     * @param {string} password - Le mot de passe de l'utilisateur.
     * @param {Date} createdAt - La date de création.
     * @param {Date} updatedAt - La date de mise à jour.
     */
    constructor(id, name, email, password, createdAt, updatedAt) {
      this.#id = id;
      this.#name = name;
      this.#email = email;
      this.#password = password;
      this.#createdAt = createdAt;
      this.#updatedAt = updatedAt;
    }
  
    // Propriétés privées
    #id;
    #name;
    #email;
    #password;
    #createdAt;
    #updatedAt;
  
    // Getters
    getId() {
      return this.#id;
    }
  
    getName() {
      return this.#name;
    }
  
    getEmail() {
      return this.#email;
    }
  
    getPassword() {
      return this.#password;
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
  
    setName(value) {
      this.#name = value;
    }
  
    setEmail(value) {
      this.#email = value;
    }
  
    setPassword(value) {
      this.#password = value;
    }
  
    setCreatedAt(value) {
      this.#createdAt = value;
    }
  
    setUpdatedAt(value) {
      this.#updatedAt = value;
    }
  
    /**
     * Affiche les détails de l'utilisateur.
     * @returns {string} - Retourne les détails de l'utilisateur.
     */
    displayInfo() {
      return `User [${this.#id}]: ${this.#name} (${this.#email})`;
    }
  }
  
  module.exports = User;
  