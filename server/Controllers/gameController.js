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
}