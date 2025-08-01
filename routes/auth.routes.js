const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// importing middleware
const isLoggedIn = require('../middleware/isLoggedIn');

// cloudinary
const multer = require('multer');
const { avatarStorage } = require('../config/cloudinary'); 
const upload = multer({ storage: avatarStorage });

// displaying the sign-up form
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up');
});

// sign up logic (creating a new user)
router.post('/sign-up', upload.single('avatar'), async (req, res) => {
    try {
        const {username, email, password, name, age, bio} = req.body;

        // validation
        // check if all necessary fields exist
        if(!username || !email || !password) {
            return res.render('auth/sign-up', {
                error: "All fields are required."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.render('auth/sign-up', {
                error: 'Please enter a valid email address.'
            });
        }

        if(password.length < 6) {
            return res.render("auth/sign-up", {
                error: "Password must be at least 6 characters long."
            });
        }

        // if user already exists in the database
        const existingUser = await User.findOne({username});
        if(existingUser) {
            return res.render('auth/sign-up', {
                error: 'Username is already taken.'
            });
        }

        if(!name || !age || !bio) {
            return res.render('auth/sign-up', {
                error: 'All fields are required.'
            });
        }

        if(isNaN(age) || age < 6 || age > 99) {
            return res.render('auth/sign-up', {
                error: 'Age must be a number between 6 and 99.'
            });
        }

        if(bio.length > 250) {
            return res.render('auth/sign-up', {
                error: 'Bio cannot be longer than 250 characters.'
            });
        }

        // hash password and create user
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = {
            username, 
            email,
            password: hashedPassword,
            name,
            age,
            bio
        };

        if (req.file) {
            newUser.avatar = req.file.path;
        }

        await User.create(newUser);

        res.redirect('/auth/login');
    } catch (error) {
        console.log('Error signing up:', error);
        res.render("auth/sign-up", {
            error: "Something went wrong. Please try again."
        });
    }
});

// displaying the login form
router.get('/login', (req, res) => {
    res.render('auth/login', {
        error: null
    }); 
});

// handling login logic
router.post('/login', async (req, res) => {
    try {
        if(!req.body.username || !req.body.password) {
            return res.render('auth/login', {
                error: 'All fields are required'
            });
        }

        const userInDatabase = await User.findOne({username:req.body.username});

        if(!userInDatabase) {
            return res.render('auth/login', {error: "Username not found."});
        }

        const validPassword = bcrypt.compareSync(
            req.body.password,
            userInDatabase.password
        );

        if(!validPassword) {
            return res.render('auth/login', {error: "Incorrect password"});
        }

        req.session.user = {
            username: userInDatabase.username, 
            _id: userInDatabase._id
        }

        res.redirect('/games/dashboard');
    } catch (error) {
        console.error("Error during sign-in: ", error);
        res.render('auth/login', {error: "An unexpected error occurred."});
    }
});

// handle log out
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

// displaying a form for changing passwords
router.get('/change-password', (req, res) => {
    if(!req.session.user) {
        return res.redirect('/auth/login');
    }

    res.render('auth/change-password');
});

// handle password updates
router.post('/change-password', isLoggedIn, async (req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body;

    if(!oldPassword || !newPassword || !confirmPassword) {
        return res.render('auth/change-password', {
            error: "All fields are required."
        });
    }

    if (newPassword.length < 6) {
        return res.render('auth/change-password', {
            error: 'New password must be at least 6 characters long'
        });
    }

    if (newPassword !== confirmPassword) {
        return res.render('auth/change-password', {
            error: 'Passwords do not match.'
        });
    }

    try {
        const user = await User.findById(req.session.user._id);
        const validOldPassword = bcrypt.compareSync(oldPassword, user.password);

        if(!validOldPassword) {
            return res.render('auth/change-password', {error: 'Old password is incorrect.'});
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
        user.password = hashedNewPassword;

        await user.save();

        res.redirect('/users/profile');
    } catch (error) {
        console.error('Error changing password: ', error);
        res.render('auth/change-password', {error: 'An error occurred while changing the password'});
    }
});

module.exports = router;