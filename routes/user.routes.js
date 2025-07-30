// creating the router object
const router = require('express').Router();

// importing models
const User = require('../models/User');
const Game = require('../models/Game');

// importing middleware
const isLoggedIn = require('../middleware/isLoggedIn');

// importing bcrypt
const bcrypt = require('bcrypt');

// viewing profile
router.get('/profile', isLoggedIn, async (req, res) => {
   const user = await User.findById(req.session.user._id);
   res.render('users/profile', {user}); 
});

// displaying edit profile form
router.get('/profile/edit', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render('users/editProfile');
});

// updating profile details
router.put('/profile', isLoggedIn, async (req, res) => {
    const {username, email} = req.body;
    const updates = {username, email};

    await User.findByIdAndUpdate(req.session.user._id, updates);
    res.redirect('/users/profile');
});

// exporting the router
module.exports = router;