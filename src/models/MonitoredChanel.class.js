const TelegramAccount = require("./TelegramAccount.class");

class MonitoredChanel {
    #id;
    #nom;
    #owner;

    /**
     * 
     * @param {int} id identifiant unique de chanel monitoré
     * @param {string} nom titre du chanel monitoré 
     * @param {TelegramAccount} owner propriétaire de la source du chanel.
     */
    constructor(id, nom, owner) {
        this.#id = id;
        this.#nom = nom;
        this.#owner = owner;
    }

    // Getter pour l'ID
    get id() {
        return this.#id;
    }

    // Setter pour l'ID
    set id(value) {
        if (typeof value === 'number' && value > 0) {
            this.#id = value;
        } else {
            throw new Error('L\'ID doit être un nombre positif.');
        }
    }

    // Getter pour le nom
    get nom() {
        return this.#nom;
    }

    // Setter pour le nom
    set nom(value) {
        if (typeof value === 'string' && value.trim().length > 0) {
            this.#nom = value;
        } else {
            throw new Error('Le nom doit être une chaîne non vide.');
        }
    }

    // Getter pour le propriétaire (owner)
    get owner() {
        return this.#owner;
    }

    // Setter pour le propriétaire
    set owner(value) {
        if (value instanceof TelegramAccount) {  // Assurez-vous que la classe TelegramAccount existe
            this.#owner = value;
        } else {
            throw new Error('Le propriétaire doit être une instance de TelegramAccount.');
        }
    }
}


module.exports = MonitoredChanel;