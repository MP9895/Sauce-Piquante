const express = require('express');
const router = express.Router();

//import maiddlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const limiter = require('../middleware/limiter-config');

//import controllers
const sauceCtrl = require('../controllers/sauce');

//routes
router.post('/', auth, multer, limiter, sauceCtrl.createSauce);
router.put('/:id', auth, multer, limiter, sauceCtrl.modifySauce);
router.delete('/:id', auth, limiter, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, limiter, sauceCtrl.likeSauce);

router.get('/', auth, limiter, sauceCtrl.getAllSauces);
router.get('/:id', auth, limiter, sauceCtrl.getOneSauce);

//export
module.exports = router;