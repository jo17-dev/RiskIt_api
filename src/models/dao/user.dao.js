const requestor = require('../config/database.requestor');  // Assurez-vous de bien importer votre module requestor
const User = require('../User.class');  // Assurez-vous que le modèle User est exporté

/**
 * Classe UserDAO pour interagir avec la table `users`.
 */
class UserDAO {
  /**
   * Récupère tous les utilisateurs.
   * @returns {Promise<User[]>} - Une promesse contenant une liste d'utilisateurs.
   */
  static async getAll() {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM users');
      return results.map(user => new User(
        user.id,
        user.name,
        user.email,
        user.password,
        user.created_at,
        user.updated_at
      ));
    } catch (err) {
      throw new Error('Erreur lors de la récupération des utilisateurs : ' + err.message);
    }
  }

  /**
   * Récupère un utilisateur par son ID.
   * @param {number} id - L'ID de l'utilisateur.
   * @returns {Promise<User|null>} - Un utilisateur ou null si non trouvé.
   */
  static async getById(id) {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM users WHERE id = ?', [id]);
      if (results.length > 0) {
        const user = results[0];
        return new User(
          user.id,
          user.name,
          user.email,
          user.password,
          user.created_at,
          user.updated_at
        );
      }
      return null;  // Utilisateur non trouvé
    } catch (err) {
      throw new Error('Erreur lors de la récupération de l\'utilisateur par ID : ' + err.message);
    }
  }

  /**
   * Insère un nouvel utilisateur.
   * @param {User} user - L'objet utilisateur à insérer.
   * @returns {Promise<number>} - L'ID de l'utilisateur inséré.
   */
  static async create(user) {
    try {
      const [result] = await requestor.makeRequest(
        'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [
          user.getName(),
          user.getEmail(),
          user.getPassword(),
          user.getCreatedAt(),
          user.getUpdatedAt()
        ]
      );
      return result.insertId;  // ID de l'utilisateur inséré
    } catch (err) {
      throw new Error('Erreur lors de l\'insertion de l\'utilisateur : ' + err.message);
    }
  }

  /**
   * Met à jour un utilisateur.
   * @param {User} user - L'objet utilisateur à mettre à jour.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async update(user) {
    try {
      await requestor.makeRequest(
        'UPDATE users SET name = ?, email = ?, password = ?, updated_at = ? WHERE id = ?',
        [
          user.getName(),
          user.getEmail(),
          user.getPassword(),
          user.getUpdatedAt(),
          user.getId()
        ]
      );
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour de l\'utilisateur : ' + err.message);
    }
  }

  /**
   * Supprime un utilisateur.
   * @param {number} id - L'ID de l'utilisateur à supprimer.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async delete(id) {
    try {
      await requestor.makeRequest('DELETE FROM users WHERE id = ?', [id]);
    } catch (err) {
      throw new Error('Erreur lors de la suppression de l\'utilisateur : ' + err.message);
    }
  }
}

module.exports = UserDAO;
