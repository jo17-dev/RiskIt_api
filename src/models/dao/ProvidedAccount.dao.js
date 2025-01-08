const requestor = require('../config/database.requestor');  // Assurez-vous de bien importer votre module requestor
const ProviderAccount = require('../ProviderAccount.class');  // Assurez-vous que le modèle ProviderAccount est exporté

/**
 * Classe ProviderAccountDAO pour interagir avec la table `provider_accounts`.
 */
class ProviderAccountDAO {
  /**
   * Récupère tous les comptes fournisseur.
   * @returns {Promise<ProviderAccount[]>} - Une promesse contenant une liste de comptes fournisseur.
   */
  static async getAll() {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM provider_accounts');
      return results.map(account => new ProviderAccount(
        account.id,
        account.user_id,
        account.plateform_name,
        account.credentials,
        account.created_at,
        account.updated_at
      ));
    } catch (err) {
      throw new Error('Erreur lors de la récupération des comptes fournisseur : ' + err.message);
    }
  }

  /**
   * Récupère un compte fournisseur par son ID.
   * @param {number} id - L'ID du compte fournisseur.
   * @returns {Promise<ProviderAccount|null>} - Un compte fournisseur ou null si non trouvé.
   */
  static async getById(id) {
    try {
      const [results] = await requestor.makeRequest('SELECT * FROM provider_accounts WHERE id = ?', [id]);
      if (results.length > 0) {
        const account = results[0];
        return new ProviderAccount(
          account.id,
          account.user_id,
          account.plateform_name,
          account.credentials,
          account.created_at,
          account.updated_at
        );
      }
      return null;  // Compte fournisseur non trouvé
    } catch (err) {
      throw new Error('Erreur lors de la récupération du compte fournisseur par ID : ' + err.message);
    }
  }

  /**
   * Insère un nouveau compte fournisseur.
   * @param {ProviderAccount} account - L'objet compte fournisseur à insérer.
   * @returns {Promise<number>} - L'ID du compte fournisseur inséré.
   */
  static async create(account) {
    try {
      const [result] = await requestor.makeRequest(
        'INSERT INTO provider_accounts (user_id, plateform_name, credentials, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [
          account.getUserId(),
          account.getPlateformName(),
          JSON.stringify(account.getCredentials()),  // Assurez-vous que credentials est un JSON
          account.getCreatedAt(),
          account.getUpdatedAt()
        ]
      );
      return result.insertId;  // ID du compte fournisseur inséré
    } catch (err) {
      throw new Error('Erreur lors de l\'insertion du compte fournisseur : ' + err.message);
    }
  }

  /**
   * Met à jour un compte fournisseur.
   * @param {ProviderAccount} account - L'objet compte fournisseur à mettre à jour.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async update(account) {
    try {
      await requestor.makeRequest(
        'UPDATE provider_accounts SET user_id = ?, plateform_name = ?, credentials = ?, updated_at = ? WHERE id = ?',
        [
          account.getUserId(),
          account.getPlateformName(),
          JSON.stringify(account.getCredentials()),  // Assurez-vous que credentials est un JSON
          account.getUpdatedAt(),
          account.getId()
        ]
      );
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour du compte fournisseur : ' + err.message);
    }
  }

  /**
   * Supprime un compte fournisseur.
   * @param {number} id - L'ID du compte fournisseur à supprimer.
   * @returns {Promise<void>} - Une promesse vide.
   */
  static async delete(id) {
    try {
      await requestor.makeRequest('DELETE FROM provider_accounts WHERE id = ?', [id]);
    } catch (err) {
      throw new Error('Erreur lors de la suppression du compte fournisseur : ' + err.message);
    }
  }
}

module.exports = ProviderAccountDAO;
