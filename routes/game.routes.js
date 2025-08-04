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
        const allGames = await Game.find({user: req.session.user._id});
        const user = await User.findById(req.session.user._id);

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate()-14);

        const gameLibrary = allGames;
        const favorites = allGames.filter(game => game.userRating === 5);
        const recentlyPlayed = allGames.filter(game => game.status === 'Completed' && new Date(game.updatedAt) >= twoWeeksAgo);
        const playing = allGames.filter(game => game.status === 'Playing');
        const wantToPlay = allGames.filter(game => game.status === 'Want to Play');
        const completed = allGames.filter(game => game.status === 'Completed');
        const abandoned = allGames.filter(game => game.status === 'Abandoned');

        res.render('games/dashboard', {
            user, gameLibrary, favorites, recentlyPlayed, playing, wantToPlay, completed, abandoned, currentPage: 'dashboard'
        });
    } catch (error) {
        console.log('Error fetching games', error);
        res.redirect('/games');
    }
});

router.get('/', async (req, res) => {
    res.redirect('/games/dashboard');
});

// displaying a form to create a new game
router.get('/new', isLoggedIn, (req, res) => {
    res.render('games/new', {currentPage: 'dashboard'});
});

// displaying a specific game
router.get('/:id', isLoggedIn, async (req, res) => {
    const game = await Game.findById(req.params.id);

    if(!game || game.user.toString() !== req.session.user._id) {
        return res.redirect('/games/dashboard');
    }

    res.render('games/game-details', {game, currentPage: 'dashboard'});
})

// creating a new game
router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
    try {
        const { title, platform, genre, releaseYear, developer, status, userRating } = req.body;

        if (!title) {
            return res.render('games/new', {
                error: 'Title is required',
                currentPage: 'dashboard'
            });
        }

        if (userRating && (isNaN(userRating) || userRating < 1 || userRating > 5)) {
            return res.render('games/new', {
                error: 'Rating must be a number between 1 and 5.',
                currentPage: 'dashboard'
            });
        }

        let imageUrl = '/images/logo-no-text.png';
        if (req.file) {
            imageUrl = req.file.path; 
        }

        await Game.create({
            title: req.body.title,
            platform: req.body.platform || '',
            genre: req.body.genre || '',
            releaseYear: req.body.releaseYear || null,
            developer: req.body.developer || '',
            status: req.body.status || 'Want to Play',
            userRating: req.body.userRating || null,
            userReview: req.body.userReview || '',
            notes: req.body.notes || '',
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

    res.render('games/edit', {game, currentPage: 'dashboard'});
});

// editing a game
router.put('/:id', isLoggedIn, upload.single('image'), async (req, res) => {

    const { title, platform, genre, releaseYear, developer, status, userRating } = req.body;

    const game = await Game.findById(req.params.id);

    if(!title) {
        return res.render('games/edit', {
            error: 'Title is required.', game, currentPage: 'dashboard'
        });
    }

    if(userRating && (isNaN(userRating) || userRating < 1 || userRating > 5)) {
        return res.render('games/edit', {
            error: 'Rating must be a number between 1 and 5.', game, currentPage: 'dashboard'
        });
    }

    if(!game || game.user.toString() !== req.session.user._id) {
        return res.redirect('/games/dashboard');
    }

    // update image if a new one is uploaded
    if(req.file) {
        game.image = req.file.path;
    }

    // update other fields
    game.title = req.body.title;
    game.platform = req.body.platform || '';
    game.genre = req.body.genre || '';
    game.releaseYear = req.body.releaseYear || null;
    game.developer = req.body.developer || '';
    game.status = req.body.status || 'Want to Play';
    game.userRating = req.body.userRating || null;
    game.userReview = req.body.userReview || '';
    game.notes = req.body.notes || '';

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