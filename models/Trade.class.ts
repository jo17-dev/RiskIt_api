class Trade {
    // Déclaration des propriétés privées avec leurs types explicites
    private id: number;
    private type: string;
    private sl: number; // stop loss
    private tp: number; // take profit
    private marge: number; // bénéfice/perte

    // Constructeur de la classe avec types explicites pour les paramètres
    constructor(id: number, type: string, sl: number, tp: number, marge: number) {
        // Initialisation des propriétés privées avec les valeurs du constructeur
        this.id = id;
        this.type = type;
        this.sl = sl;
        this.tp = tp;
        this.marge = marge;
    }

    // Méthodes pour accéder aux propriétés privées (getters)
    getId(): number {
        return this.id;
    }

    getType(): string {
        return this.type;
    }

    getSl(): number {
        return this.sl;
    }

    getTp(): number {
        return this.tp;
    }

    getMarge(): number {
        return this.marge;
    }

    // Méthodes pour modifier les propriétés privées (setters)
    setId(newId: number): void {
        this.id = newId;
    }

    setType(newType: string): void {
        this.type = newType;
    }

    setSl(newSl: number): void {
        this.sl = newSl;
    }

    setTp(newTp: number): void {
        this.tp = newTp;
    }

    setMarge(newMarge: number): void {
        this.marge = newMarge;
    }
}

export default Trade;
