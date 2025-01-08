const requestor = require('../config/database.requestor');  // Assurez-vous de bien importer votre module requestor
const Trade = require('../Trade.class');  // Assurez-vous que le modèle Trade est exporté

/**
 * Classe TradeDAO pour interagir avec la table `trades`.
 */
class TradeDAO {
  /**
   * Récupère tous les trades.
   * @returns {Promise<Trade[]>} - Une promesse contenant une liste de trades.
   */
  static async getAll() {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM trades');
      return results.map(trade => new Trade(
        trade.id,
        trade.trader_client_id,
        trade.signal_id,
        trade.amount_traded,
        trade.marge,
        trade.created_at,
        trade.updated_at
      ));
    } catch (err) {
      throw new Error('Erreur lors de la récupération des trades : ' + err.message);
    }
  }

  /**
   * Récupère un trade par son ID.
   * @param {number} id - L'ID du trade.
   * @returns {Promise<Trade|null>} - Un trade ou null si non trouvé.
   */
  static async getById(id) {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM trades WHERE id = ?', [id]);
      if (results.length > 0) {
        const trade = results[0];
        return new Trade(
          trade.id,
          trade.trader_client_id,
          trade.signal_id,
          trade.amount_traded,
          trade.marge,
          trade.created_at,
          trade.updated_at
        );
      }
      return null;  // Trade non trouvé
    } catch (err) {
      throw new Error('Erreur lors de la récupération du trade par ID : ' + err.message);
    }
  }

  /**
   * Insère un nouveau trade.
   * @param {Trade} trade - L'objet trade à insérer.
   * @returns {Promise<number>} - L'ID du trade inséré.
   */
  static async create(trade) {
    try {
      const [result] = await requestor.makeRequest(
        'INSERT INTO trades (trader_client_id, signal_id, amount_traded, marge, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
          trade.getTraderClientId(),
          trade.getSignalId(),
          trade.getAmountTraded(),
          trade.getMarge(),
          trade.getCreatedAt(),
          trade.getUpdatedAt()
        ]
      );
      return result.insertId;  // ID du trade inséré
    } catch (err) {
      throw new Error('Erreur lors de l\'insertion du trade : ' + err.message);
    }
  }

  /**
   * Met à jour un trade.
   * @param {Trade} trade - L'objet trade à mettre à jour.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async update(trade) {
    try {
      await requestor.makeRequest(
        'UPDATE trades SET trader_client_id = ?, signal_id = ?, amount_traded = ?, marge = ?, updated_at = ? WHERE id = ?',
        [
          trade.getTraderClientId(),
          trade.getSignalId(),
          trade.getAmountTraded(),
          trade.getMarge(),
          trade.getUpdatedAt(),
          trade.getId()
        ]
      );
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour du trade : ' + err.message);
    }
  }

  /**
   * Supprime un trade.
   * @param {number} id - L'ID du trade à supprimer.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async delete(id) {
    try {
      await requestor.makeRequest('DELETE FROM trades WHERE id = ?', [id]);
    } catch (err) {
      throw new Error('Erreur lors de la suppression du trade : ' + err.message);
    }
  }
}

module.exports = TradeDAO;
