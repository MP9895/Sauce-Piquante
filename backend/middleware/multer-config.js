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
        let name = file.originalname.split(' ').join('-');
        let newName = name.split('.');
        newName.pop();
        newName = newName.join('-');

        const extension = MIME_TYPES[file.mimetype];
        callback(null, newName + '_' + Date.now() + '.' + extension);
    }
})

const maxSize = 3 * 1024 * 1024;

module.exports = multer({ storage: storage, limits: { fileSize: maxSize } }).single('image');