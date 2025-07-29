// importing mongoose
const mongoose = require('mongoose');

// function to connect to the database
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.log("Connection error", error);
    }
}

// exporting the database connection
module.exports = connectToDB;