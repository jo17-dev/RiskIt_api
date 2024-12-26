const mysql = require('mysql2');
require('dotenv').config();



class Database {
    static #connection;

    constructor(){

    };

    // Le constructeur prend en paramètres les informations de connexion
    static getInstance(){

        Database.connection = mysql.createConnection({
            host: process.env.db_host,
            user: process.env.db_user,
            password: process.env.db_password,
            database: process.env.db_database_name
        });

        // Vérification de la connexion
        this.connection.connect((err) => {
            if (err) {
                console.error('Erreur de connexion à la base de données :', err.stack);
                return null;
            }
            console.log('Connecté à la base de données avec l\'ID de connexion', this.connection.threadId);
            return Database.connection;
        });

        return Database.connection;
    
    }

    // Méthode pour fermer la connexion
    static close() {
        Database.connection.end((err) => {
            if (err) {
                console.error('Erreur lors de la fermeture de la connexion à la base de données :', err.stack);
            } else {
                console.log('Connexion à la base de données fermée.');
            }
        });
    }
}

module.exports = Database;
