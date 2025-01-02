const mysql = require('mysql2');
require('dotenv').config();


/**
 * methode pour effectuer une requette et retourner le resultat sous forme de tableau
 * @param {string} query Requette à faire exécuter
 * @param {Array} values tableau de valeurs pour remplacer les ? dans les requettes
 */
const makeRequest = async (query, values=[])=>{
    // 1st etape: créer la connexion
    // 2e etape: faire la requette
    // analyser et renvoyer le resultat

    // 1st etape
    let connexion = mysql.createConnection({
        host: process.env.db_host,
        user: process.env.db_user,
        password: process.env.db_password,
        database: process.env.db_database_name
    });

    connexion.connect((err)=>{
        if(err != null){
            console.log("Erreur d'acces à la BAse de Données");
            return [];
        }
    })


    let request = await connexion.promise().query(query, values);
    // Il fau savoir que request est un array[2], dont la posistion 0 contient les données et la possition 1 contient le requettes
    return request;
}

module.exports = {makeRequest};