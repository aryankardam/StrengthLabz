const router = require('express').Router();
const paymentCtrl = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

// Payment Routes
router.post('/payment/create-order', auth, paymentCtrl.createOrder);
router.post('/payment/verify', auth, paymentCtrl.verifyPayment);
router.get('/payment/history', auth, paymentCtrl.getHistory);
router.post('/payment/webhook', paymentCtrl.webhook);

module.exports = router;
