const express = require("express");
const { getGames, getDetailedGames, getPublicGames } = require("../Controllers/gameController");
const { register, login } = require("../Controllers/userController");
const authentication = require("../middlewares/authentication");
const { createWishlist, getWishlist, deleteWishlist, boughtWishlist, getComment, addComment } = require("../Controllers/wishlistController");
const router = express.Router();

router.post('/register', register)
router.post('/login', login)

router.get('/public/games', getPublicGames)
router.get('/games', getGames)
router.get('/games/:gameId', getDetailedGames)

router.use(authentication)
router.get('/games/:gameId/wishlist', getWishlist)
router.post('/games/:gameId/wishlist', createWishlist)
router.delete('/games/:gameId/wishlist', deleteWishlist)
router.patch('/games/:gameId/wishlist', boughtWishlist)
router.get('/games/:gameId/comment', getComment)
router.post('/games/:gameId/comment', addComment)

module.exports = router;