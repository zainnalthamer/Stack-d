// creating the router object
const router = require('express').Router();

// importing models
const User = require('../models/User');
const Game = require('../models/Game');
const isLoggedIn = require('../middleware/isLoggedIn');

const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// ADDING ROUTES
// displaying user dashboard (all games)
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



// displaying a specific game
router.get('/:id', isLoggedIn, async (req, res) => {
    const game = await Game.findById(req.params.id);

    if(!game || game.user.toString() !== req.session.user._id) {
        return res.redirect('/games/dashboard');
    }

    res.render('games/game-details', {game});
})

// creating a new game
router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        let imageUrl = 'https://res.cloudinary.com/doctomog7/image/upload/v1753846568/Default_k5eybl.png';
        if (req.file) {
            imageUrl = req.file.path; 
        }

        await Game.create({
            title: req.body.title,
                platform: req.body.platform,
                genre: req.body.genre,
                releaseYear: req.body.releaseYear,
                developer: req.body.developer,
                status: req.body.status,
                userRating: req.body.userRating,
                userReview: req.body.userReview,
                notes: req.body.notes,
                image: imageUrl,
                user: req.session.user._id
        });

    res.redirect('/games/dashboard');
} catch (error) {
    console.error('Error creating game', error);
    res.redirect('/games/new');
}
});

// displaying a form to edit a game
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const game = await Game.findById(req.params.id);

    if(!game || game.user.toString() !== req.session.user._id) {
        return res.redirect('/games/dashboard');
    }

    res.render('games/edit', {game});
});

// editing a game
router.put('/:id', isLoggedIn, upload.single('image'), async (req, res) => {
    const game = await Game.findById(req.params.id);

    if(!game || game.user.toString() !== req.session.user._id) {
        return res.redirect('/games/dashboard');
    }

    // update image if a new one is uploaded
    if(req.file) {
        game.image = req.file.path;
    }

    // update other fields
    game.title = req.body.title;
    game.platform = req.body.platform;
    game.genre = req.body.genre;
    game.releaseYear = req.body.releaseYear;
    game.developer = req.body.developer;
    game.status = req.body.status;
    game.userRating = req.body.userRating;
    game.userReview = req.body.userReview;
    game.notes = req.body.notes;

    await game.save();
    
    res.redirect(`/games/${game._id}`);
});

// deleting a game
router.delete('/:id', isLoggedIn, async (req, res) => {
    const game = await Game.findById(req.params.id);

    if(!game || game.user.toString() !== req.session.user._id) {
        return res.redirect('/games/dashboard');
    }

    await Game.findByIdAndDelete(req.params.id);
    res.redirect('/games/dashboard');
});

// exporting the router
module.exports = router;