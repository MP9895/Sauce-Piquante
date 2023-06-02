const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('-').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '_' + Date.now() + '.' + extension);
    }
})

const maxSize = 30 * 1024 * 1024;

module.exports = multer({ storage: storage, limits: { fileSize: maxSize } }).single('image');