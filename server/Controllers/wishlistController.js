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
                throw {
                    name: "NotFound",   
                    message: "Wishlist not found!"
                }
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
                throw {
                    name: "NotFound",
                    message: "Game not found!"
                }
            }
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (findComment) {
                if (findComment.status === 'Bought') {
                    throw {
                        name: "BadRequest",
                        message: "Game already bought!"
                    }
                }
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
                throw {
                    name: "NotFound",
                    message: "Game not found!"
                }
            }
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (!findComment) {
                throw {
                    name: "NotFound",
                    message: "Wishlist not found!"
                }
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
                throw {
                    name: "NotFound",
                    message: "Game not found!"
                }
            }
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (findComment.status === 'Bought') {
                throw {
                    name: "BadRequest",
                    message: "Game already bought!"
                }
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
                throw {
                    name: "BadRequest",
                    message: "Comment not found!"
                }
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
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (findComment.isComment) {
                throw {
                    name: "BadRequest",
                    message: "Comment not found!"
                }
            }
            await Wishlist.update({ isComment: true ,comment, rating }, { where: { userId, gameId } })
            res.status(200).json({ message: "Comment added!" });
        } catch (error) {
            next(error);
        }
    }

    static async eraseComment(req, res, next) {
        try {
            const userId = req.user.id;
            const { gameId } = req.params
            let findComment = await Wishlist.findOne({ where: { userId, gameId } })
            if (findComment) {
                throw {
                    name: "BadRequest",
                    message: "Comment not found!"
                }
            }
            await Wishlist.update({ comment: null, rating: 0 }, { where: { userId, gameId } })
            res.status(200).json({ message: "Comment erased!" });
        } catch (error) {
            next(error);
        }
    }

    static async getAllUserComment(req, res, next) {
        try {
            const userId = req.user.id;
            let comment = await Wishlist.findAll({ where: { userId } })
            res.status(200).json(comment);
        } catch (error) {
            next(error);
        }
    }
}

describe("User Routes", () => {
    test("POST /register - should register user", async () => {
      User.create.mockResolvedValue(mockUser);
      const res = await request(app).post("/register").send({ username: "testuser", email: "test@example.com", password: "password123" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("username", "testuser");
    });
  
    test("POST /login - should login user", async () => {
      User.findOne.mockResolvedValue(mockUser);
      comparePass.mockReturnValue(true);
      const res = await request(app).post("/login").send({ username: "testuser", password: "password123" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });
  
  describe("Game Routes", () => {
    test("GET /games - should get all games", async () => {
      Game.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
      const res = await request(app).get("/games");
      expect(res.status).toBe(200);
    });
  
    test("GET /games/:gameId - should get game details", async () => {
      Game.findByPk.mockResolvedValue(null);
      const res = await request(app).get("/games/1");
      expect(res.status).toBe(200);
    });
  });
  
  describe("Wishlist Routes", () => {
    test("POST /games/:gameId/wishlist - should add to wishlist", async () => {
      Game.findOne.mockResolvedValue({ id: 1, name: "Test Game" });
      Wishlist.findOne.mockResolvedValue(null);
      Wishlist.create.mockResolvedValue({});
      const res = await request(app)
        .post("/games/1/wishlist")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(201);
    });
  
    test("DELETE /games/:gameId/wishlist - should remove from wishlist", async () => {
      Wishlist.findOne.mockResolvedValue({ id: 1 });
      Wishlist.destroy.mockResolvedValue(1);
      const res = await request(app)
        .delete("/games/1/wishlist")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
    });
  });