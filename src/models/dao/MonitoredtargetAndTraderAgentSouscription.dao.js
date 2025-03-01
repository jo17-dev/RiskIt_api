const requestor = require('../config/database.requestor');
const MonitoredtargetAndTraderAgentSouscription = require('../MonitoredtargetAndTraderAgentSouscription.class');

class MonitoredtargetAndTraderAgentSouscriptionDao {
  /**
   * Récupère tous les souscriptions monitored target - trader agents.
   * @returns {Promise<MonitoredtargetAndTraderAgentSouscription[]>} - Une promesse contenant une liste de souscriptions monitored target - trader agents.
   */
  static async getAll() {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM monitored_target_and_trader_agent_souscriptions');
      return results.map(item => new MonitoredtargetAndTraderAgentSouscription(
        item.id_monitored_target,
        admin.id_trader_agent
      ));
    } catch (err) {
      throw new Error('Erreur lors de la récupération des souscriptions monitored target - trader agents : ' + err.message);
    }
  }

    /**
     * Récupère tous les trader agents- correspondant à un monitored target
     * @param {number} idMonitoredTarget 
     * @returns {Promise<MonitoredtargetAndTraderAgentSouscription[]>}
     */
    static async getByMonitoredTarget(idMonitoredTarget) {
        try {
            const [results] = await requestor.makeRequest('SELECT * FROM monitored_target_and_trader_agent_souscriptions WHERE id_monitored_target = ?', [idMonitoredTarget]);
            return results.map(item => new MonitoredtargetAndTraderAgentSouscription(
                item.id_monitored_target,
                admin.id_trader_agent
            ));
        } catch (err) {
            throw new Error('Erreur lors de la récupération des souscriptions monitored target - trader agents : ' + err.message);
        }
    }

    /**
     * Récupère tous les monitored target correspondant à un trader agents 
     * @param {number} idTraderAgent 
     * @returns {Promise<MonitoredtargetAndTraderAgentSouscription[]>} - Une promesse contenant une liste d'admins.
     */
    static async getByTraderAgent(idTraderAgent) {
        try {
            const [results] = await requestor.makeRequest('SELECT * FROM monitored_target_and_trader_agent_souscriptions WHERE id_trader_agent = ?', [idTraderAgent]);
            return results.map(item => new MonitoredtargetAndTraderAgentSouscription(
                item.id_monitored_target,
                admin.id_trader_agent
            ));
        } catch (err) {
            throw new Error('Erreur lors de la récupération des souscriptions monitored target - trader agents : ' + err.message);
        }
    }


  /**
   * Insère une nouvelle souscription.
   * @param {MonitoredtargetAndTraderAgentSouscription} target - L'objet admin à insérer.
   * @returns {Promise<void>} - L'ID de la souscription insérée.
   */
  static async create(target) {
    try {
      const [result] = await requestor.makeRequest(
        'INSERT INTO monitored_target_and_trader_agent_souscriptions (id_monitored_target, id_trader_agent) VALUES (?, ?)',
        [
          target.getIdMonitoredtarget(),
          target.getIdTraderAgent()
        ]
      );
    } catch (err) {
      throw new Error('Erreur lors de l\'insertion de l\'admin : ' + err.message);
    }
  }

  /**
   * Supprime une souscription
   * @param {MonitoredtargetAndTraderAgentSouscription} target - souscription à suprimemer.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async delete(target) {
    try {
      await requestor.makeRequest('DELETE FROM admins WHERE id_monitored_target = ? AND id_trader_agent = ?',
         [
            target.getIdMonitoredtarget(),
            target.getIdTraderAgent()
         ]);
    } catch (err) {
      throw new Error('Erreur lors de la suppression de l\'admin : ' + err.message);
    }
  }
}


module.exports = MonitoredtargetAndTraderAgentSouscriptionDao;