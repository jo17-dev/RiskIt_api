const requestor = require('../config/database.requestor');  // Assurez-vous de bien importer votre module requestor
const MonitoredTarget = require('../MonitoredTarget.class');  // Assurez-vous que le modèle MonitoredTarget est exporté

/**
 * Classe MonitoredTargetDAO pour interagir avec la table `monitored_targets`.
 */
class MonitoredTargetDAO {
  /**
   * Récupère tous les targets monitorés.
   * @returns {Promise<MonitoredTarget[]>} - Une promesse contenant une liste de targets.
   */
  static async getAll() {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM monitored_targets');
      return results.map(target => new MonitoredTarget(
        target.id,
        target.provider_account_id,
        target.target_name,
        target.others,
        target.created_at,
        target.updated_at
      ));
    } catch (err) {
      throw new Error('Erreur lors de la récupération des targets : ' + err.message);
    }
  }

  /**
   * Récupère un target monitoré par son ID.
   * @param {number} id - L'ID du target.
   * @returns {Promise<MonitoredTarget|null>} - Un target ou null si non trouvé.
   */
  static async getById(id) {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM monitored_targets WHERE id = ?', [id]);
      if (results.length > 0) {
        const target = results[0];
        return new MonitoredTarget(
          target.id,
          target.provider_account_id,
          target.target_name,
          target.others,
          target.created_at,
          target.updated_at
        );
      }
      return null;  // Target non trouvé
    } catch (err) {
      throw new Error('Erreur lors de la récupération du target par ID : ' + err.message);
    }
  }

  /**
   * Insère un nouveau target monitoré.
   * @param {MonitoredTarget} target - L'objet target à insérer.
   * @returns {Promise<number>} - L'ID du target inséré.
   */
  static async create(target) {
    try {
      const [result] = await requestor.makeRequest(
        'INSERT INTO monitored_targets (provider_account_id, target_name, others, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [
          target.getProviderAccountId(),
          target.getTargetName(),
          JSON.stringify(target.getOthers()),  // Assurez-vous que "others" est un JSON
          target.getCreatedAt(),
          target.getUpdatedAt()
        ]
      );
      return result.insertId;  // ID du target inséré
    } catch (err) {
      throw new Error('Erreur lors de l\'insertion du target : ' + err.message);
    }
  }

  /**
   * Met à jour un target monitoré.
   * @param {MonitoredTarget} target - L'objet target à mettre à jour.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async update(target) {
    try {
      await requestor.makeRequest(
        'UPDATE monitored_targets SET provider_account_id = ?, target_name = ?, others = ?, updated_at = ? WHERE id = ?',
        [
          target.getProviderAccountId(),
          target.getTargetName(),
          JSON.stringify(target.getOthers()),  // Assurez-vous que "others" est un JSON
          target.getUpdatedAt(),
          target.getId()
        ]
      );
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour du target : ' + err.message);
    }
  }

  /**
   * Supprime un target monitoré.
   * @param {number} id - L'ID du target à supprimer.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async delete(id) {
    try {
      await requestor.makeRequest('DELETE FROM monitored_targets WHERE id = ?', [id]);
    } catch (err) {
      throw new Error('Erreur lors de la suppression du target : ' + err.message);
    }
  }


  /**
   * récupere l'ensemble des discussions appartenant à un "provider account"
   * @param {number} id
   * @returns {Promise<MonitoredTarget[]>} la liste des cibles (chanels) à monitorer pour un "provider account"
   */
  static async getAllByProviderId(id) {
    try{
      let [result] = await requestor.makeRequest('SELECT * FROM monitored_targets WHERE id_provider_account = ?', [id]);
      return result.map(target => new MonitoredTarget(
        target.id,
        target.id_provider_account,
        target.target_name,
        target.others,
        target.created_at,
        target.updated_at
      ));

    }catch(err){
      throw new Error('Erreur lors de la rechercher des targets appartenant à un provider ID: ', id);
    }
  }
}

module.exports = MonitoredTargetDAO;
