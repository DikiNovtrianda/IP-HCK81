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
            const { gameId } = req.params;
            const game = await Game.findByPk(gameId, {
                include: {
                    model: Wishlist,
                    where: { isComment: true },
                    attributes: ['id', 'userId', 'comment', 'rating'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            });
            if (!game) {
                throw { name: "NotFound", message: "Game not found!" };
            }
            res.status(200).json(game);
        } catch (error) {
            next(error);
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
            });

            if (!seed || seed.length === 0) {
                throw { name: "NotFound", message: "No games available for recommendations!" };
            }

            let prompt = `I like ${genre}, but I dislike ${degenre}. I want 3 recommended games. Here is a JSON array of games: ${JSON.stringify(seed)}. List recommended games only in a list of ids and then your comment in Bahasa Indonesia after that. Don't forget to put "|||" between the list and the comment. Example: 1,2,3|||This is a comment.`;

            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
            });

            if (!response || !response.text) {
                throw { name: "BadRequest", message: "AI failed to generate recommendations!" };
            }

            let array = response.text.split("|||");
            let gameIds = array[0].replace(' ', '').split(",").map(id => parseInt(id, 10));
            let games = await Promise.all(gameIds.map(async (id) => {
                return Game.findByPk(id);
            }));

            let comment = array[1];
            res.status(200).json({ games, comment });
        } catch (error) {
            next(error);
        }
    }
}