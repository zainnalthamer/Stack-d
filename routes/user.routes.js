// creating the router object
const router = require('express').Router();

// importing models
const User = require('../models/User');
const Game = require('../models/Game');

// importing middleware
const isLoggedIn = require('../middleware/isLoggedIn');

// exporting the router
module.exports = router;