const express = require("express");
const { home } = require("../Controllers/gameController");
const { register, login } = require("../Controllers/userController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.get('/', home)
router.post('/register', register)
router.post('/login', login)

router.use(authentication)

module.exports = router;