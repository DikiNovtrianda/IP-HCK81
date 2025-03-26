const { User, Game, Wishlist } = require('../models');
const { GoogleGenAI } = require("@google/genai");

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
                    model: Wishlist,
                    where: { status: 'bought' },
                    attributes: ['userId', 'comment', 'rating'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            });
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

    static async getAIRecommendation(req, res, next) {
        try {
            let { genre, degenre } = req.body;
            const seed = await Game.findAll({
                attributes: ['id', 'name', 'genre1', 'genre2', 'genre3']
            })
            let prompt = `I like ${genre}, but i dislike ${degenre}. I want 3 recommended games. Here is a JSON array of games: ${JSON.stringify(seed)}. List a recommended games only in list of ids and then your comment in bahasa indonesia after that. dont forget put "|||" between list and comment. Example: 1,2,3|||This is a comment.`
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
            });
            let array = response.text.split("|||");
            let gameIds = array[0].replace(' ', '').split(",").map(id => parseInt(id, 10));
            let games = await Promise.all(gameIds.map(async (id) => {
                return Game.findByPk(id);
            }));
            let comment = array[1];
            res.status(200).json({ games, comment })
        } catch (error) {
            next(error)
        }
    }
}