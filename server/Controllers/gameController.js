const { Game, Wishlist } = require('../models');

module.exports = class gameController {
    static async getGames(req, res, next) {
        try {
            const games = await Game.findAndCountAll()
            res.status(200).json(games)
        } catch (error) {
            next(error)
        }
    }

    static async getDetailedGames(req, res, next) {
        try {
            const { gameId } = req.params
            const game = await Game.findByPk(gameId, {
                include: {
                    model: Wishlist
                }
            })
            res.status(200).json(game)
        } catch (error) {
            next(error)
        }
    }

    static async getPublicGames(req, res, next) {
        try {
            const { page, search, sort, order, filter } = req.query
            const limit = 12;
            const games = await Game.getPublicGames({ page, limit, search, sort, order, filter })
            games.page = page || 1;
            games.limit = limit;
            games.length = games.rows.length;
            res.status(200).json(games)
        } catch (error) {
            next(error)
        }
    }
}