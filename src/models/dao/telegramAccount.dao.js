const dataBaseRequestor = require('../config/database.requestor');

class TelegramAccountDAO {
    /**
     * Récupère tous les trades à date
     * @returns {Array} resultade de l'array
     */
    static async getAll(){
        let result = await dataBaseRequestor.makeRequest("SELECT * FROM trades");
        return result;
    }
}

module.exports = TelegramAccountDAO;