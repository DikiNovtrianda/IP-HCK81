const { verifyToken } = require("../helpers/jwt");
const { User } = require('../models');

module.exports = async function authentication(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            throw { name: "Unauthorized", message: "Unauthorized access" };
        }
        const token = bearerToken.split(" ")[1];
        const translation = verifyToken(token);
        let user = await User.findByPk(+translation.id);
        if (!user) {
            throw { name: "Unauthorized", message: "Unauthorized access" };
        }
        req.user = { id: user.id, username: user.username };
        next();
    } catch (error) {
        next(error);
    }
};