const { verifyToken } = require("../helpers/jwt");
const { User } = require('../models');

module.exports = async function authentication(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            throw {
                name: "Unauthorized",
                message: "Unauthorized access"
            }
        }
        const token = bearerToken.split(" ")[1];
        if (!token) {
            throw {
                name: "Unauthorized",
                message: "Unauthorized access"
            }
        }
        
        const translation = verifyToken(token);
        let user = await User.findByPk(translation.id);
        if (!user) {
            throw {
                name: "Unauthorized",
                message: "Unauthorized access"
            }
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}