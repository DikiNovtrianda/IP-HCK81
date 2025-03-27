const { User } = require('../models');
const { comparePass } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');

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

    static async googleLogin(req, res, next) {
        try {
            const { googleToken } = req.body;

            const client = new OAuth2Client();

            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            
            const [user] = await User.findOrCreate({
                where: {
                    email: payload.email
                },
                defaults: {
                    username: payload.given_name + '#' + (Math.floor(Math.random() * 10000)),
                    email: payload.email,
                    password: (Math.random() * 100000) + 'password'
                }
            });
            let token = signToken({ id: user.id });
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }

    static async getUserDetail(req, res, next) {
        try {
            const userId = req.user.id;
            console.log(req.user);
            
            let user = await User.findOne({
                where: { id: userId },
                attributes: { exclude: ['password'] }
            })
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    static getUser(req, res, next) {
        let {id, username} = req.user
        res.status(200).json({ id, username });
    }

    static async userSetting(req, res, next) {
        try {
            const { preferedCategory, hatedCategory } = req.body;
            const userId = req.user.id;
            await User.update(
                { preferedCategory, hatedCategory },
                { where: { id: userId }}
            )
            res.status(200).json({ message: "User preference has been updated!" });
        } catch (error) {
            next(error);
        }
    }

    static async eraseAccount(req, res, next) {
        try {
            const userId = req.user.id;
            await User.destroy({
                where: { id: userId }
            })
            res.status(200).json({ message: "Account has been deleted!" });
        } catch (error) {
            next(error);
        }
    }
}