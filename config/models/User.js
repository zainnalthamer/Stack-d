// importing mongoose
const mongoose = require('mongoose');

// creating the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }]
});

// creating the user model based on userSchema
const User = mongoose.model('User', userSchema);

// exporting model
module.exports = User;