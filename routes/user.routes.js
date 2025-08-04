// creating the router object
const router = require('express').Router();

// importing models
const User = require('../models/User');
const Game = require('../models/Game');

// importing middleware
const isLoggedIn = require('../middleware/isLoggedIn');

// importing bcrypt
const bcrypt = require('bcrypt');

// cloudinary
const multer = require('multer');
const { avatarStorage } = require('../config/cloudinary');
const upload = multer({ storage: avatarStorage });

// viewing profile
router.get('/profile', isLoggedIn, async (req, res) => {
   const user = await User.findById(req.session.user._id);
   res.render('users/profile', {user, currentPage: 'profile'}); 
});

// displaying edit profile form
router.get('/profile/edit', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render('users/editProfile', {user, currentPage: 'profile'});
});

// updating profile details
router.put('/profile', isLoggedIn, upload.single('avatar'), async (req, res) => {
    const {username, name, age, bio} = req.body;

    if (!username || !name || !age) {
        const user = await User.findById(req.session.user._id);
        return res.render('users/editProfile', {
            error: 'Username, name, and age are required.', 
            user,
            currentPage: 'profile'
        });
    }

    if (isNaN(age) || age < 0) {
        const user = await User.findById(req.session.user._id);
        return res.render('users/editProfile', {
            error: 'Age must be a valid number', 
            user,
            currentPage: 'profile'
        });
    }

    const updates = {username, name, age, bio};

    if(req.file) {
        updates.avatar = req.file.path; // cloudinary url
    }

    await User.findByIdAndUpdate(req.session.user._id, updates);
    res.redirect('/users/profile');
});

// deleting a user
router.delete('/:id', isLoggedIn, async (req, res) => {
    
    try {
        const user = await User.findById(req.params.id);

    if(!user || user._id.toString() !== req.session.user._id) {
        return res.redirect('/games/dashboard');
    }

    await User.findByIdAndDelete(req.params.id);
    res.redirect('/auth/login');
    } catch (error) {
        console.log("Deleting error", error)
    }
});

// exporting the router
module.exports = router;