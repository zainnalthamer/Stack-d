// creating the router object
const router = require('express').Router();

// importing models
const User = require('../models/User');
const Game = require('../models/Game');

// ADDING ROUTES
// displaying user dashboard
router.get('/dashboard', (req, res) => {
    if(!req.session.user) {
        return res.redirect('/auth/login');
    }

    res.render('games/dashboard', {
        user:req.session.user
    });
});

// exporting the router
module.exports = router;