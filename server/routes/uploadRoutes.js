const router = require('express').Router();
const uploadCtrl = require('../controllers/uploadController');
const auth = require('../middleware/authMiddleware');       // Your auth middleware
const authAdmin = require('../middleware/authAdmin');       // Admin middleware

// Upload image (admin only)
router.post('/upload', auth, authAdmin, uploadCtrl.uploadImage);

// Delete image (admin only)
router.post('/destroy', auth, authAdmin, uploadCtrl.deleteImage);

module.exports = router;
