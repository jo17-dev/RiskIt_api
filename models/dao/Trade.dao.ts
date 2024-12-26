import mysql from 'mysql2';
import Trade from '../Trade.class';
import Database from '../config/db.config';

class TradeDAO {
    private static db: mysql.Connection;

    // Méthode pour récupérer un trade par son ID
    public static async searchById(id: number): Promise<Trade | null> {
        // Connexion à la base de données
        TradeDAO.db = Database.getInstance();

        if (TradeDAO.db == null) {
            throw new Error('La connexion à la base de données a échoué.');
        }

        try {
            // Exécution de la requête SQL avec await
            const [result] = await TradeDAO.db.promise().query('SELECT * FROM trades WHERE id = ?', [id]);
            
            // result est de type RowDataPacket[], donc on peut directement accéder aux lignes
            const rows = result as mysql.RowDataPacket[];

            // Si aucun résultat, renvoyer null
            if (rows.length === 0) {
                return null;
            }

            // Supposons que le résultat contient un seul enregistrement
            const row = rows[0]; // Prendre la première ligne (ou l'unique ligne)
            const trade = new Trade(row.id, row.type, row.sl, row.tp, row.marge); // Créer l'objet Trade

            return trade; // Retourner l'objet Trade
        } catch (err:any) {
            console.error('Erreur SQL:', err.message);
            throw err; // Rejeter l'erreur en cas de problème SQL
        }
    }

    // Méthode pour récupérer tous les trades
    public static async searchAll(): Promise<Trade[]> {
        // Connexion à la base de données
        TradeDAO.db = Database.getInstance();

        if (TradeDAO.db == null) {
            throw new Error('La connexion à la base de données a échoué.');
        }

        try {
            // Exécution de la requête SQL avec await
            const [result] = await TradeDAO.db.promise().query('SELECT * FROM trades');
            
            // result est de type RowDataPacket[], donc on peut directement accéder aux lignes
            const rows = result as mysql.RowDataPacket[];

            // Si aucun résultat, renvoyer un tableau vide
            if (rows.length === 0) {
                return [];
            }

            // Transformation des résultats en instances de Trade
            const trades = rows.map((row) => new Trade(row.id, row.type, row.sl, row.tp, row.marge));

            return trades; // Retourner le tableau d'instances de Trade
        } catch (err:any) {
            console.error('Erreur SQL:', err.message);
            throw err; // Rejeter l'erreur en cas de problème SQL
        }
    }

    // Méthode pour mettre à jour un trade
    public static async update(id: number, target: Trade): Promise<void> {
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
        } catch (err:any) {
            console.error('Erreur SQL lors de la mise à jour:', err.message);
            throw err; // Rejeter l'erreur en cas de problème SQL
        }
    }
}

module.exports = TradeDAO;
