const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');
const limiter = require('../middleware/limiter-config');

router.post('/signup', limiter, verifyPassword, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;