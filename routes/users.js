const express = require('express');
const router = express.Router();
const cathAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const user = require('../models/user');
const users = require('../controllers/users');

//暫時取消註冊功能
// router.route('/register')
//     .get(users.renderRegisterForm)
//     .post(cathAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;