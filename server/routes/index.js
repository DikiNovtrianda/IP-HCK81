const express = require("express");
const { getGames, getDetailedGames, getPublicGames } = require("../Controllers/gameController");
const { register, login, googleLogin } = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const { createWishlist, getWishlist, deleteWishlist, boughtWishlist, getComment, addComment } = require("../controllers/wishlistController");
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/google-login', googleLogin)

router.get('/public/games', getPublicGames)
router.get('/games', getGames)
router.get('/games/:gameId', getDetailedGames)

router.use(authentication)
router.get('/wishlist', getWishlist)
router.patch('/wishlist/:gameId/bought', boughtWishlist)
router.post('/games/:gameId/wishlist', createWishlist)
router.delete('/games/:gameId/wishlist', deleteWishlist)
router.get('/games/:gameId/comment', getComment)
router.post('/games/:gameId/comment', addComment)

module.exports = router;