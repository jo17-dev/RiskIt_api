const requestor = require('../config/database.requestor');  // Assurez-vous de bien importer votre module requestor
const TraderAgent = require('../TraderAgent.class');  // Assurez-vous que le modèle TraderAgent est exporté

/**
 * Classe TraderAgentDAO pour interagir avec la table `trader_agents`.
 */
class TraderAgentDAO {
  /**
   * Récupère tous les agents de trading.
   * @returns {Promise<TraderAgent[]>} - Une promesse contenant une liste d'agents.
   */
  static async getAll() {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM trader_agents');
      return results.map(agent => new TraderAgent(
        agent.id,
        agent.user_id,
        agent.agent_name,
        agent.credentials,
        agent.created_at,
        agent.updated_at
      ));
    } catch (err) {
      throw new Error('Erreur lors de la récupération des agents : ' + err.message);
    }
  }

  /**
   * Récupère un agent de trading par son ID.
   * @param {number} id - L'ID de l'agent.
   * @returns {Promise<TraderAgent|null>} - Un agent ou null si non trouvé.
   */
  static async getById(id) {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM trader_agents WHERE id = ?', [id]);
      if (results.length > 0) {
        const agent = results[0];
        return new TraderAgent(
          agent.id,
          agent.user_id,
          agent.agent_name,
          agent.credentials,
          agent.created_at,
          agent.updated_at
        );
      }
      return null;  // Agent non trouvé
    } catch (err) {
      throw new Error('Erreur lors de la récupération de l\'agent par ID : ' + err.message);
    }
  }

  /**
   * Insère un nouvel agent de trading.
   * @param {TraderAgent} agent - L'objet agent à insérer.
   * @returns {Promise<number>} - L'ID de l'agent inséré.
   */
  static async create(agent) {
    try {
      const [result] = await requestor.makeRequest(
        'INSERT INTO trader_agents (user_id, agent_name, credentials, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [
          agent.getUserId(),
          agent.getAgentName(),
          JSON.stringify(agent.getCredentials()),  // Assurez-vous que credentials est un JSON
          agent.getCreatedAt(),
          agent.getUpdatedAt()
        ]
      );
      return result.insertId;  // ID de l'agent inséré
    } catch (err) {
      throw new Error('Erreur lors de l\'insertion de l\'agent : ' + err.message);
    }
  }

  /**
   * Met à jour un agent de trading.
   * @param {TraderAgent} agent - L'objet agent à mettre à jour.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async update(agent) {
    try {
      await requestor.makeRequest(
        'UPDATE trader_agents SET user_id = ?, agent_name = ?, credentials = ?, updated_at = ? WHERE id = ?',
        [
          agent.getUserId(),
          agent.getAgentName(),
          JSON.stringify(agent.getCredentials()),  // Assurez-vous que credentials est un JSON
          agent.getUpdatedAt(),
          agent.getId()
        ]
      );
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour de l\'agent : ' + err.message);
    }
  }

  /**
   * Supprime un agent de trading.
   * @param {number} id - L'ID de l'agent à supprimer.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async delete(id) {
    try {
      await requestor.makeRequest('DELETE FROM trader_agents WHERE id = ?', [id]);
    } catch (err) {
      throw new Error('Erreur lors de la suppression de l\'agent : ' + err.message);
    }
  }
}

module.exports = TraderAgentDAO;
