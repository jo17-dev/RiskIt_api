const Trade = require('../Trade.class');

const dataBaseRequestor = require('../config/database.requestor');

class TradeDAO {
    static db;


    static async add(type, tp, sl, position_price, marge){
        // connexion à la DB
        TradeDAO.db = Database.getInstance();

        if (TradeDAO.db == null) {
            throw new Error('La connexion à la base de données a échoué.');
        }

        try{
            await TradeDAO.db.promise().query("INSERT INTO trades (type, tp, sl, position_price, marge), VALUES(?, ?, ?, ?)", [type, tp, sl, position_price ,marge])
        }catch(err){
            console.log("Erreur SQL: "+err.message);
        }
    }

    // Méthode pour récupérer un trade par son ID
    static async searchById(id) {
        // Connexion à la base de données
        TradeDAO.db = Database.getInstance();

        if (TradeDAO.db == null) {
            throw new Error('La connexion à la base de données a échoué.');
        }

        try {
            // Exécution de la requête SQL avec await
            const [result] = await TradeDAO.db.promise().query('SELECT * FROM trades WHERE id = ?', [id]);
            
            // result est de type RowDataPacket[], donc on peut directement accéder aux lignes
            const rows = result;

            // Si aucun résultat, renvoyer null
            if (rows.length === 0) {
                return null;
            }

            // Supposons que le résultat contient un seul enregistrement
            const row = rows[0]; // Prendre la première ligne (ou l'unique ligne)
            const trade = new Trade(row.id, row.type, row.sl, row.tp, row.position_price ,row.marge); // Créer l'objet Trade

            return trade; // Retourner l'objet Trade
        } catch (err) {
            console.error('Erreur SQL:', err.message);
            throw err; // Rejeter l'erreur en cas de problème SQL
        }
    }

    // Méthode pour récupérer tous les trades
    static async searchAll() {
        let result = await dataBaseRequestor.makeRequest("SELECT * FROM trades");
        return result[0]; 
    }

    // Méthode pour mettre à jour un trade
    /**
     * 
     * @param {nteger} id id du trade 
     * @param {Trade} target  trade à update
     */
    static async update(id, target) {
        // Connexion à la base de données
        TradeDAO.db = Database.getInstance();

        if (TradeDAO.db == null) {
            throw new Error('La connexion à la base de données a échoué.');
        }

        try {
            // Exécution de la requête SQL avec await pour la mise à jour
            await TradeDAO.db.promise().query(
                'UPDATE trades SET type = ?, sl = ?, tp = ?, marge = ? WHERE id = ?',
                [target.getType(), target.getSl(), target.getTp(), target.getMarge(), id]
            );

            console.log(`Trade avec ID ${id} mis à jour avec succès.`);
        } catch (err) {
            console.error('Erreur SQL lors de la mise à jour:', err.message);
            throw err; // Rejeter l'erreur en cas de problème SQL
        }
    }
}

module.exports = TradeDAO;
