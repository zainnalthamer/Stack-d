// importing the cloudinary library
const cloudinary = require('cloudinary').v2;

// configuring cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// exporting the cloudinary instance
module.exports = cloudinary;