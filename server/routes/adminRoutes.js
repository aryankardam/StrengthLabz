const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const authAdmin = require('../middleware/authAdmin');

// Admin-only routes
router.get('/dashboard', authMiddleware, authAdmin, adminController.adminDashboard);
router.patch('/users/:id/role', authMiddleware, authAdmin, adminController.updateUserRole);

module.exports = router;
