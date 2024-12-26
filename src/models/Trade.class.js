class Trade {
    // Déclaration des propriétés
    constructor(id, type, sl, tp, marge) {
        // Initialisation des propriétés avec les valeurs du constructeur
        this.id = id;
        this.type = type;
        this.sl = sl;
        this.tp = tp;
        this.marge = marge;
    }

    // Méthodes pour accéder aux propriétés
    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    getSl() {
        return this.sl;
    }

    getTp() {
        return this.tp;
    }

    getMarge() {
        return this.marge;
    }

    // Méthodes pour modifier les propriétés
    setId(newId) {
        this.id = newId;
    }

    setType(newType) {
        this.type = newType;
    }

    setSl(newSl) {
        this.sl = newSl;
    }

    setTp(newTp) {
        this.tp = newTp;
    }

    setMarge(newMarge) {
        this.marge = newMarge;
    }
}

module.exports = Trade;
