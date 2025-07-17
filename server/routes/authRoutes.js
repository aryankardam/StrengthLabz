const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/refresh_token', authController.refreshToken);
router.get('/logout', authController.logout);
router.get('/user', authMiddleware, authController.getUser);

module.exports = router;
