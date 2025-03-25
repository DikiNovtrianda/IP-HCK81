const { Game } = require('../models');

module.exports = class gameController {
    static async getGames(req, res, next) {
        try {
            const games = await Game.findAll()
            res.status(200).json(games)
        } catch (error) {
            next(error)
        }
    }

    static async getDetailedGames(req, res, next) {
        try {
            const { gameId } = req.params
            const game = await Game.findByPk(gameId)
            res.status(200).json(game)
        } catch (error) {
            next(error)
        }
    }
}