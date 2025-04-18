const { Wishlist, Game } = require('../models');

module.exports = class wishlistController {
    static async getWishlist(req, res, next) {
        try {
            const userId = req.user.id;
            let findWishlist = await Wishlist.findAll({
                where: { userId },
                include: [
                    {
                        model: Game,
                        attributes: ['name'] // Specify the attributes you want from the Game model
                    }
                ]
            });  
            if (!findWishlist) {
                throw { name: "NotFound", message: "Wishlist not found!" }
            }
            res.status(200).json(findWishlist);
        } catch (error) {
            next(error);
        }
    }

    static async createWishlist(req, res, next) {
        try {
            const userId = req.user.id;
            const { gameId } = req.params
            let findGame = await Game.findOne({ where: { id: gameId } })
            if (!findGame) {
                throw { name: "BadRequest", message: "Game not found!" }
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

    static async deleteWishlist(req, res, next) {
        try {
            const userId = req.user.id;
            const { gameId } = req.params
            let findGame = await Game.findOne({ where: { id: gameId } })
            if (!findGame) {
                throw { name: "NotFound", message: "Game not found!" }
            }
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (!findComment) {
                throw { name: "NotFound", message: "Wishlist not found!"}
            }
            await Wishlist.destroy({ where: { userId, gameId } })
            res.status(200).json({ message: "Wishlist deleted!" });
        } catch (error) {
            next(error);
        }
    }

    static async boughtWishlist(req, res, next) {
        try {
            const userId = req.user.id;
            const { gameId } = req.params
            let findGame = await Game.findOne({ where: { id: gameId } })
            if (!findGame) {
                throw { name: "NotFound", message: "Game not found!" }
            }
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (findComment.status === 'Bought') {
                throw { name: "BadRequest", message: "Game already bought!" }
            }
            await Wishlist.update({ status: 'Bought' }, { where: { userId, gameId } })
            res.status(200).json({ message: "Game library added!" });
        } catch (error) {
            next(error);
        }
    }

    static async getComment(req, res, next) {
        try {
            const userId = req.user.id;
            const { gameId } = req.params
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (!findComment) {
                throw { name: "BadRequest", message: "Comment not found!" }
            }
            res.status(200).json(findComment);
        } catch (error) {
            next(error);
        }
    }

    static async addComment(req, res, next) {
        try {
            const userId = req.user.id;
            const { comment, rating } = req.body
            const { gameId } = req.params
            if (!comment || rating < 1 || rating > 10) {
                throw { name: "BadRequest", message: "Invalid comment or rating" };
            }
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (findComment.isComment) {
                throw { name: "BadRequest", message: "Comment not found!" }
            }
            await Wishlist.update({ isComment: true ,comment, rating }, { where: { userId, gameId } })
            res.status(200).json({ message: "Comment added!" });
        } catch (error) {
            next(error);
        }
    }
}