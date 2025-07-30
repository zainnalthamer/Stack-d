// importing the cloudinary library
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// configuring cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'stackd-games',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'stackd-avatars',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 300, height: 300, crop: 'thumb', gravity: 'face' }]
    }
})

// exporting the cloudinary and storage
module.exports = {cloudinary, storage, avatarStorage};