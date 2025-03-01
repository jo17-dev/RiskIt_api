class MonitoredtargetAndTraderAgentSouscription {
    /**
     * souscription de traderagent
     * 
     * @param {number} idMonitoredtarget id du monitored target
     * @param {number} idTraderAgent id de l'agent de trading
     */
    constructor(idMonitoredtarget, idTraderAgent){
        this.#idMonitoredtarget = idMonitoredtarget;
        this.#idTraderAgent = idTraderAgent;
    }

    #idTraderAgent;
    #idMonitoredtarget;


    getIdMonitoredtarget() {
        return this.#idMonitoredtarget;
    }

    setIdMonitoredtarget(newIdMonitoredtarget) {
        if (Number.isInteger(newIdMonitoredtarget)) {
            this.#idMonitoredtarget = newIdMonitoredtarget;
        } else {
            console.error('L\'identifiant du  doit être un entier.');
            throw new Error("L'identifiant du monitored target doit être un entier ");
        }
    }

    getIdTraderAgent() {
        return this.#idTraderAgent;
    }

    setIdTraderAgent(newIdTraderAgent) {
        if (Number.isInteger(newIdTraderAgent)) {
            this.#idTraderAgent = newIdTraderAgent;
        } else {
            console.error('L\'identifiant du  doit être un entier.');
            throw new Error("L'identifiant du trader agent doit être un entier ");
        }
    }

}

module.exports = MonitoredtargetAndTraderAgentSouscription;