const requestor = require('../config/database.requestor');  // Assurez-vous de bien importer votre module requestor
const Admin = require('../Admin.class');  // Assurez-vous que le modèle Admin est exporté

/**
 * Classe AdminDAO pour interagir avec la table `admins`.
 */
class AdminDAO {
  /**
   * Récupère tous les admins.
   * @returns {Promise<Admin[]>} - Une promesse contenant une liste d'admins.
   */
  static async getAll() {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM admins');
      return results.map(admin => new Admin(
        admin.user_id
      ));
    } catch (err) {
      throw new Error('Erreur lors de la récupération des admins : ' + err.message);
    }
  }

  /**
   * Récupère un admin par son user_id.
   * @param {number} userId - L'ID de l'utilisateur associé à l'admin.
   * @returns {Promise<Admin|null>} - Un admin ou null si non trouvé.
   */
  static async getByUserId(userId) {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM admins WHERE user_id = ?', [userId]);
      if (results.length > 0) {
        const admin = results[0];
        return new Admin(
          admin.user_id
        );
      }
      return null;  // Admin non trouvé
    } catch (err) {
      throw new Error('Erreur lors de la récupération de l\'admin par user_id : ' + err.message);
    }
  }

  /**
   * Insère un nouvel admin.
   * @param {Admin} admin - L'objet admin à insérer.
   * @returns {Promise<number>} - L'ID de l'admin inséré.
   */
  static async create(admin) {
    try {
      const [result] = await requestor.makeRequest(
        'INSERT INTO admins (user_id) VALUES (?)',
        [
          admin.getUserId()
        ]
      );
      return result.insertId;  // ID de l'admin inséré
    } catch (err) {
      throw new Error('Erreur lors de l\'insertion de l\'admin : ' + err.message);
    }
  }

  /**
   * Supprime un admin.
   * @param {number} userId - L'ID de l'utilisateur associé à l'admin à supprimer.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async delete(userId) {
    try {
      await requestor.makeRequest('DELETE FROM admins WHERE user_id = ?', [userId]);
    } catch (err) {
      throw new Error('Erreur lors de la suppression de l\'admin : ' + err.message);
    }
  }
}

module.exports = AdminDAO;
