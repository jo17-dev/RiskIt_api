const MonitoredChanel = require('../MonitoredChanel.class');
const { TelegramAccount } = require('../TelegramAccount.class');
const dataBaseRequestor = require('../config/database.requestor');
class MonitoredChanelDAO {

    static async getAll(){
        let result = await dataBaseRequestor.makeRequest("SELECT * FROM monitoredchanels");
        return result[0];
    }

    /**
     * @param {string} phoneNumber id (phone number) of the telegram account
     * @returns {MonitoredChanel[]} Monitored chanels retournés
     */
    static async getAllByPhoneNumber(phoneNumber){
        let queryresult = await dataBaseRequestor.makeRequest("SELECT * FROM monitoredchanels INNER JOIN telegramaccounts ON monitoredchanels.idTelegramAccount = telegramaccounts.phoneNumber WHERE monitoredchanels.idTelegramAccount = ?", [phoneNumber]);

        if(queryresult[0].length == 0){
            return [];
        }

        // données
        // let result = queryresult[0];
        let result = [];

        for(let i=0; i< queryresult[0].length; i++){
            result.push(
                new MonitoredChanel(
                    parseInt(queryresult[0][i].id),
                    queryresult[0][i].nom,
        
                    new TelegramAccount(
                        queryresult[0][i].phoneNumber,
                        queryresult[0][i]?.session_string || "",
                        queryresult[0][i].created_at,
                        queryresult[0][i].updated_at
                    )
                )
            );
        }
        return result;
    }

    /**
     * 
     * @param {MonitoredChanel} target 
     */
    static async add(target){
        let result = await dataBaseRequestor.makeRequest("INSERT INTO monitoredchanels (nom, idTelegramAccount), VALUES (?, ?, ?)", [target.nom, target.id, target.owner.phoneNumber]);

        return result[0];
    }


}

module.exports = MonitoredChanelDAO;