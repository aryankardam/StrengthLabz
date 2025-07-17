const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

/**
 * @route POST /api/user/register
 * @desc Register a new user
 */
router.post('/register', userCtrl.register);

/**
 * @route POST /api/user/login
 * @desc Login user and return access token
 */
router.post('/login', userCtrl.login);

/**
 * @route GET /api/user/logout
 * @desc Logout user by clearing refresh token cookie
 */
router.get('/logout', userCtrl.logout);

/**
 * @route GET /api/user/refresh_token
 * @desc Get new access token from refresh token
 */
router.get('/refresh_token', userCtrl.refreshToken);

/**
 * @route GET /api/user/infor
 * @desc Get logged-in user's profile
 * @access Private
 */
router.get('/infor', auth, userCtrl.getUser);

/**
 * @route PATCH /api/user/addcart
 * @desc Add items to cart
 * @access Private
 */
router.patch('/addcart', auth, userCtrl.addCart);

module.exports = router;
