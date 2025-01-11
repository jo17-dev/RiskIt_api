const requestor = require('../config/database.requestor');  // Assurez-vous de bien importer votre module requestor
const Signal = require('../Signal.class');  // Assurez-vous que le modèle Signal est exporté

/**
 * Classe SignalDAO pour interagir avec la table `signals`.
 */
class SignalDAO {
  /**
   * Récupère tous les signaux.
   * @returns {Promise<Signal[]>} - Une promesse contenant une liste de signaux.
   */
  static async getAll() {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM signals');
      return results.map(signal => new Signal(
        signal.id,
        signal.monitored_target_id,
        signal.tp,
        signal.sl,
        signal.entry_upper_born,
        signal.entry_lower_born,
        signal.created_at,
        signal.updated_at
      ));
    } catch (err) {
      throw new Error('Erreur lors de la récupération des signaux : ' + err.message);
    }
  }

  /**
   * Récupère un signal par son ID.
   * @param {number} id - L'ID du signal.
   * @returns {Promise<Signal|null>} - Un signal ou null si non trouvé.
   */
  static async getById(id) {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM signals WHERE id = ?', [id]);
      if (results.length > 0) {
        const signal = results[0];
        return new Signal(
          signal.id,
          signal.monitored_target_id,
          signal.tp,
          signal.sl,
          signal.entry_upper_born,
          signal.entry_lower_born,
          signal.created_at,
          signal.updated_at
        );
      }
      return null;  // Signal non trouvé
    } catch (err) {
      throw new Error('Erreur lors de la récupération du signal par ID : ' + err.message);
    }
  }

  /**
   * Insère un nouveau signal.
   * @param {Signal} signal - L'objet signal à insérer.
   * @returns {Promise<number>} - L'ID du signal inséré.
   */
  static async create(signal) {
    try {
      const [result] = await requestor.makeRequest(
        'INSERT INTO signals (monitored_target_id, tp, sl, entry_upper_born, entry_lower_born, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          signal.getMonitoredTargetId(),
          signal.getTp(),
          signal.getSl(),
          signal.getEntryUpperBorn(),
          signal.getEntryLowerBorn(),
          signal.getCreatedAt(),
          signal.getUpdatedAt()
        ]
      );
      return result.insertId;  // ID du signal inséré
    } catch (err) {
      throw new Error('Erreur lors de l\'insertion du signal : ' + err.message);
    }
  }

  /**
   * Met à jour un signal.
   * @param {Signal} signal - L'objet signal à mettre à jour.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async update(signal) {
    try {
      await requestor.makeRequest(
        'UPDATE signals SET monitored_target_id = ?, tp = ?, sl = ?, entry_upper_born = ?, entry_lower_born = ?, updated_at = ? WHERE id = ?',
        [
          signal.getMonitoredTargetId(),
          signal.getTp(),
          signal.getSl(),
          signal.getEntryUpperBorn(),
          signal.getEntryLowerBorn(),
          signal.getUpdatedAt(),
          signal.getId()
        ]
      );
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour du signal : ' + err.message);
    }
  }

  /**
   * Supprime un signal.
   * @param {number} id - L'ID du signal à supprimer.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async delete(id) {
    try {
      await requestor.makeRequest('DELETE FROM signals WHERE id = ?', [id]);
    } catch (err) {
      throw new Error('Erreur lors de la suppression du signal : ' + err.message);
    }
  }
}

module.exports = SignalDAO;
