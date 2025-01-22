/**
 * Modèle représentant un signal de trading.
 * @typedef {Object} Signal
 * @property {number} id - L'ID unique du signal.
 * @property {number} monitoredTargetId - L'ID de la cible surveillée associée au signal.
 * @property {number} tp - Le Take Profit (TP) du signal.
 * @property {number} sl - Le Stop Loss (SL) du signal.
 * @property {number} entryUpperBorn - La borne supérieure pour l'entrée (peut être null).
 * @property {number} entryLowerBorn - La borne inférieure pour l'entrée (peut être null).
 * @property {number} parent - le signal parent auquel il est affilié (devrai etre d'ordre contraire à la base)
 * @property {Date} createdAt - La date de création du signal.
 * @property {Date} updatedAt - La date de mise à jour du signal.
 */
class Signal {
    /**
     * Crée une instance d'un signal de trading.
     * @param {number} id - L'ID unique du signal.
     * @param {number} monitoredTargetId - L'ID de la cible surveillée associée au signal.
     * @param {string} pair - La pair concernée
     * @param {number} tp - Le Take Profit du signal.
     * @param {number} sl - Le Stop Loss du signal.
     * @param {number} entryUpperBorn - La borne supérieure pour l'entrée.
     * @param {number} entryLowerBorn - La borne inférieure pour l'entrée.
     * @param {number | null} parent - Le signal au quel ce signal est affilié - facultatif
     * @param {Date} createdAt - La date de création.
     * @param {Date} updatedAt - La date de mise à jour.
     */
    constructor(id, monitoredTargetId, pair ,tp, sl, entryUpperBorn, entryLowerBorn, parent ,createdAt, updatedAt) {
      this.#id = id;
      this.#monitoredTargetId = monitoredTargetId;
      this.#pair = pair;
      this.#tp = tp;
      this.#sl = sl;
      this.#entryUpperBorn = entryUpperBorn;
      this.#entryLowerBorn = entryLowerBorn;
      this.#parent = parent;
      this.#createdAt = createdAt;
      this.#updatedAt = updatedAt;
    }
  
    // Propriétés privées
    #id;
    #monitoredTargetId;
    #pair;
    #tp;
    #sl;
    #entryUpperBorn;
    #entryLowerBorn;
    #parent;
    #createdAt;
    #updatedAt;
  
    // Getters
    getId() {
      return this.#id;
    }
  
    getMonitoredTargetId() {
      return this.#monitoredTargetId;
    }

    getpair(){
      return this.#pair;
    }
  
    getTp() {
      return this.#tp;
    }
  
    getSl() {
      return this.#sl;
    }
  
    getEntryUpperBorn() {
      return this.#entryUpperBorn;
    }
  
    getEntryLowerBorn() {
      return this.#entryLowerBorn;
    }

    getParent() {
      return this.#parent;
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

    setParent(value) {
      this.#parent = value;
    }
  
    setMonitoredTargetId(value) {
      this.#monitoredTargetId = value;
    }

    setpair(newPair){
      this.#pair = newPair;
    }
  
    setTp(value) {
      this.#tp = value;
    }
  
    setSl(value) {
      this.#sl = value;
    }
  
    setEntryUpperBorn(value) {
      this.#entryUpperBorn = value;
    }
  
    setEntryLowerBorn(value) {
      this.#entryLowerBorn = value;
    }
  
    setCreatedAt(value) {
      this.#createdAt = value;
    }
  
    setUpdatedAt(value) {
      this.#updatedAt = value;
    }
  
    /**
     * Affiche les détails du signal.
     * @returns {string} - Retourne les détails du signal.
     */
    displayInfo() {
      return `Signal [${this.#id}]: Pair=${this.#pair} TP = ${this.#tp}, SL = ${this.#sl}, parent= ${this.#parent}`;
    }
  }
  
  module.exports = Signal;
  