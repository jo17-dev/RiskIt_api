
/**
 *  middleware pour l'authentification d'un client
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @returns {void}
 */
function isClientMiddleware(req, res, next){
    console.log("- client middleware");
    return next();
}
module.exports = isClientMiddleware;