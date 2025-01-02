/**
 * Classe représentant un compte Telegram.
 */
class TelegramAccount {
    #phoneNumber;
    #session_string;    
    #create_at;
    #updated_at;    

    /**
     * Crée une instance de TelegramAccount.
     * @param {string} phoneNumber - Le numéro de téléphone associé au compte Telegram.
     * @param {string} session_string - La chaîne de session Telegram.
     * @param {string} create_at - La date de création du compte (au format ISO 8601).
     * @param {string} updated_at - La date de mise à jour du compte (au format ISO 8601).
     */
    constructor(phoneNumber, session_string, create_at, updated_at) {
        this.#phoneNumber = phoneNumber;
        this.#session_string = session_string;
        this.#create_at = create_at;
        this.#updated_at = updated_at;
    }

    /**
     * Récupère le numéro de téléphone du compte Telegram.
     * @returns {string} Le numéro de téléphone du compte Telegram.
     */
    getphoneNumber() {
        return this.#phoneNumber;
    }

    /**
     * Modifie le numéro de téléphone du compte Telegram.
     * @param {string} phoneNumber - Le nouveau numéro de téléphone.
     */
    setphoneNumber(phoneNumber) {
        this.#phoneNumber = phoneNumber;
    }

    /**
     * Récupère la chaîne de session du compte Telegram.
     * @returns {string} La chaîne de session du compte Telegram.
     */
    getsession_string() {
        return this.#session_string;
    }

    /**
     * Modifie la chaîne de session du compte Telegram.
     * @param {string} session_string - La nouvelle chaîne de session.
     */
    setsession_string(session_string) {
        this.#session_string = session_string;
    }

    /**
     * Récupère la date de création du compte Telegram.
     * @returns {string} La date de création du compte (au format ISO 8601).
     */
    getcreate_at() {
        return this.#create_at;
    }

    /**
     * Modifie la date de création du compte Telegram.
     * @param {string} create_at - La nouvelle date de création (au format ISO 8601).
     */
    setcreate_at(create_at) {
        this.#create_at = create_at;
    }

    /**
     * Récupère la date de mise à jour du compte Telegram.
     * @returns {string} La date de mise à jour du compte (au format ISO 8601).
     */
    getupdated_at() {
        return this.#updated_at;
    }

    /**
     * Modifie la date de mise à jour du compte Telegram.
     * @param {string} updated_at - La nouvelle date de mise à jour (au format ISO 8601).
     */
    setupdated_at(updated_at) {
        this.#updated_at = updated_at;
    }
}

module.exports = {TelegramAccount};