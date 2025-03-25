const { Wishlist, Game } = require('../models');

module.exports = class wishlistController {
    static async createWishlist(req, res, next) {
        try {
            const { userId } = req.body
            const { gameId } = req.params
            let findGame = await Game.findOne({ where: { id: gameId } })
            if (!findGame) {
                throw {
                    name: "NotFound",
                    message: "Game not found!"
                }
            }
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (findComment) {
                throw {
                    name: "BadRequest",
                    message: "Wishlist already exists!"
                }
            }
            await Wishlist.create({ userId, gameId })
            res.status(201).json({ message: "Wishlist created!" });
        } catch (error) {
            next(error);
        }
    }
}