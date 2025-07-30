// creating the router object
const router = require('express').Router();

// importing models
const User = require('../models/User');
const Game = require('../models/Game');
const isLoggedIn = require('../middleware/isLoggedIn');

// ADDING ROUTES
// displaying user dashboard
router.get('/dashboard', async (req, res) => {
    if(!req.session.user) {
        return res.redirect('/auth/login');
    }

    try {
        const games = await Game.find({user: req.session.user._id});
        res.render('games/dashboard', {games, user:req.session.user});
    } catch (error) {
        console.log('Error fetching games', error);
        res.redirect('/games');
    }
});

// displaying a form to create a new game
router.get('/new', isLoggedIn, (req, res) => {
    res.render('games/new');
});

// exporting the router
module.exports = router;