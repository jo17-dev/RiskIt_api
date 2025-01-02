class TelegramAccount {
    // Déclaration des champs privés
    #phoneNumber;
    #session_string;
    #create_at;
    #updated_at;

    // Constructeur de la classe
    constructor(phoneNumber, session_string, create_at, updated_at) {
        this.#phoneNumber = phoneNumber;
        this.#session_string = session_string;
        this.#create_at = create_at;
        this.#updated_at = updated_at;
    }

    // Getter pour le numéro de téléphone
    get phoneNumber() {
        return this.#phoneNumber;
    }

    // Setter pour le numéro de téléphone
    set phoneNumber(phoneNumber) {
        this.#phoneNumber = phoneNumber;
    }

    // Getter pour la session string
    get session_string() {
        return this.#session_string;
    }

    // Setter pour la session string
    set session_string(session_string) {
        this.#session_string = session_string;
    }

    // Getter pour la date de création
    get create_at() {
        return this.#create_at;
    }

    // Setter pour la date de création
    set create_at(create_at) {
        this.#create_at = create_at;
    }

    // Getter pour la date de mise à jour
    get updated_at() {
        return this.#updated_at;
    }

    // Setter pour la date de mise à jour
    set updated_at(updated_at) {
        this.#updated_at = updated_at;
    }
}

module.exports = TelegramAccount;