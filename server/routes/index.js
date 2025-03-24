const express = require("express");
const { home } = require("../Controllers/gameController");
const router = express.Router();

router.get('/', home)

module.exports = router;