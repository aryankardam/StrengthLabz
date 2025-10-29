const router = require('express').Router();
const productCtrl = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');  // auth middleware (token validation)
const authAdmin = require('../middleware/authAdmin');   // admin role middleware
const upload = require('../middleware/upload');         // multer memory storage

// GET all products - public
router.get('/products', productCtrl.getProducts);
router.get('/all', productCtrl.getAllProducts); // For testing
router.get('/search', productCtrl.searchProducts); // Alternative search
router.get('/category/:category', productCtrl.getProductsByCategory);

// POST create product - admin only, multiple images
router.post('/products', auth, authAdmin, upload.array('images', 5), productCtrl.createProducts);

// DELETE product by id - admin only
router.delete('/products/:id', auth, authAdmin, productCtrl.deleteProduct);

// PUT update product by id - admin only, optional multiple images
router.put('/products/:id', auth, authAdmin, upload.array('images', 5), productCtrl.updateProduct);

module.exports = router;