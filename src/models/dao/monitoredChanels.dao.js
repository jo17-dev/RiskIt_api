const MonitoredChanel = require('../MonitoredChanel.class');
const dataBaseRequestor = require('../config/database.requestor');
class MonitoredChanelDAO {

    static async getAll(){
        let result = await dataBaseRequestor.makeRequest("SELECT * FROM monitoredchanels");
        return result[0];
    }

    /**
     * @param {string} phoneNumber id (phone number) of the telegram account
     */
    static async getById(phoneNumber){
        let result = await dataBaseRequestor.makeRequest(`SELECT * FROM monitoredchanels WHERE idTelegramAccount='${phoneNumber}'`);
        return result[0];
    }

    /**
     * Récupérer les chaines ciblés à observer par le numéro de telephone
     * @param {string} phoneNumber numéro de telephone connecté à telegram
     */
    static async getByPhoneNumber(phoneNumber){
        return this.getById();
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