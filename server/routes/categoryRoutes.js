const router = require('express').Router();
const categoryCtrl = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const authAdmin = require('../middleware/authAdmin');
const upload = require('../middleware/upload');

router.get('/category', categoryCtrl.getCategories);
router.post('/category', auth, authAdmin, upload.single('image'), categoryCtrl.createCategory);
router.put('/category/:id', auth, authAdmin, upload.single('image'), categoryCtrl.updateCategory);
router.delete('/category/:id', auth, authAdmin, categoryCtrl.deleteCategory);

module.exports = router;