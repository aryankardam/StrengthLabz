// const express = require('express');
// const router = express.Router();
// const {
//   createOrder,
//   verifyPayment,
//   getPaymentDetails,
//   paymentFailed
// } = require('../controllers/paymentController');

// router.post('/create-order', createOrder);
// router.post('/verify-payment', verifyPayment);
// router.get('/payment/:paymentId', getPaymentDetails);
// router.post('/payment-failed', paymentFailed);

// module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createOrder,
  verifyPayment
} = require('../controllers/paymentController');

router.post('/create-order', auth, createOrder);
router.post('/verify-payment', auth, verifyPayment);

module.exports = router;

