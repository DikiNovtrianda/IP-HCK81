const express = require("express");
const { getGames, getGamesJson } = require("../Controllers/gameController");
const { register, login } = require("../Controllers/userController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

// router.get('/')
router.post('/register', register)
router.post('/login', login)
router.get('/get-games', getGamesJson)

router.use(authentication)

module.exports = router;