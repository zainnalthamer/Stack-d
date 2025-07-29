// importing mongoose
const mongoose = require('mongoose');

// creating the game schema
const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    genre: String,
    releaseYear: Number,
    developer: String,
    status: {
        type: String,
        enum: ['Want to Play', 'Playing', 'Completed', 'Abandoned'],
        default: 'Want to Play'
    },
    userRating: {
        type: Number,
        min: 1,
        max: 5
    },
    userReview: String,
    notes: String,
    dateAdded: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: '/images/default-game.jpg'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// creating the game model based on gameSchema
const Game = mongoose.model('Game', gameSchema);

// exporting model
module.exports = Game;