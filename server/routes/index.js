const express = require("express");
const { getGames } = require("../Controllers/gameController");
const { register, login } = require("../Controllers/userController");
const authentication = require("../middlewares/authentication");
const { createWishlist, getWishlist, deleteWishlist, boughtWishlist, getComment, addComment } = require("../Controllers/wishlistController");
const router = express.Router();

router.post('/register', register)
router.post('/login', login)

router.use(authentication)
router.get('/wishlist/:gameId', getWishlist)
router.post('/wishlist/:gameId', createWishlist)
router.delete('/wishlist/:gameId', deleteWishlist)
router.patch('/wishlist/:gameId', boughtWishlist)
router.get('/wishlist/:gameId/comment', getComment)
router.post('/wishlist/:gameId/comment', addComment)

module.exports = router;