const dataBaseRequestor = require('../config/database.requestor');
const {TelegramAccount} = require('../TelegramAccount.class');

class TelegramAccountDAO {
    /**
     * Récupère tous les trades à date
     * @returns {Array} resultade de l'array
     */
    static async getAll(){
        let result = await dataBaseRequestor.makeRequest("SELECT * FROM telegramaccounts");
        return result;
    }

    /**
     * Récupérer un compte telegram via son numéro de telephone
     * @param {string} phoneNumber
     */
    static async getById(phoneNumber){
        let queryresult = await dataBaseRequestor.makeRequest("SELECT * FROM telegramaccounts WHERE phoneNumber= ?", [phoneNumber]);
        // console.log(result[0]);


        // Si le taleau des données n'est pas 1 (l'unique..) je sait c'est bizarr haha, on a juste pas de données
        if(queryresult[0].length != 1){
            return null;
        }

        let result = queryresult[0];

        console.log(result[0].session_string);


        return new TelegramAccount(
            result[0].phoneNumber,
            result[0]?.session_string || "",
            result[0].created_at,
            result[0].updated_at
        );
    }
}

module.exports = {TelegramAccountDAO};