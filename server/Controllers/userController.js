const { User } = require('../models');
const { comparePass } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

module.exports = class userController {
    static async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            let status = await User.create({ username, email, password })
            res.status(201).json({ username: status.username, email: status.email });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                throw {
                    name: "BadRequest",
                    message: "Username or Password is empty!"
                }
            }
            let user = await User.findOne({
                where: { username }
            })
            if (!user || !comparePass(password, user.password)) {
                throw {
                    name: "Unauthorized",
                    message: "Invalid Username/Password!"
                }
            }
            let token = signToken({ id: user.id });
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }
}