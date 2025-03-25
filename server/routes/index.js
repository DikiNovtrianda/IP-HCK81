const express = require("express");
const { getGames, getDetailedGames } = require("../Controllers/gameController");
const { register, login } = require("../Controllers/userController");
const authentication = require("../middlewares/authentication");
const { createWishlist, getWishlist, deleteWishlist, boughtWishlist, getComment, addComment } = require("../Controllers/wishlistController");
const router = express.Router();

router.post('/register', register)
router.post('/login', login)

router.get('/games', getGames)
router.get('/games/:gameId', getDetailedGames)

router.use(authentication)
router.get('/wishlists/:gameId', getWishlist)
router.post('/wishlists/:gameId', createWishlist)
router.delete('/wishlists/:gameId', deleteWishlist)
router.patch('/wishlists/:gameId', boughtWishlist)
router.get('/wishlists/:gameId/comment', getComment)
router.post('/wishlists/:gameId/comment', addComment)

module.exports = router;