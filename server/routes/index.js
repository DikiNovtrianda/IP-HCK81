const express = require("express");
const { home } = require("../Controllers/gameController");
const { register, login } = require("../Controllers/userController");
const router = express.Router();

router.get('/', home)
router.post('/register', register)

module.exports = router;