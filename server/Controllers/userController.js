const { User, Wishlist } = require('../models');
const { comparePass } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

module.exports = class userController {
    static async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            let status = await User.create({
                username,
                email,
                password
            })
            console.log('>>>',status);
            
            res.status(201).json({ username: status.username, email: status.email });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'DEI' });
        }
    }
}