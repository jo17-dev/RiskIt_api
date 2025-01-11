
/**
 *  middleware pour l'authentification d'un admin
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @returns {void}
 */
function isAdminMiddleware(req, res, next){
    console.log("- admin middleware");
    return next();
}


module.exports = isAdminMiddleware;