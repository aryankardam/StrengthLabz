// const Razorpay = require('razorpay');
// const crypto = require('crypto');

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// exports.createOrder = async (req, res) => {
//   try {
//     const { amount, currency = 'INR', receipt, notes } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Amount is required and must be greater than 0'
//       });
//     }

//     const options = {
//       amount: Math.round(amount * 100),
//       currency,
//       receipt: receipt || `receipt_${Date.now()}`,
//       notes: notes || {}
//     };

//     const order = await razorpay.orders.create(options);

//     res.json({
//       success: true,
//       order,
//       key_id: process.env.RAZORPAY_KEY_ID
//     });

//   } catch (error) {
//     console.error('Order creation failed:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create order',
//       error: error.message
//     });
//   }
// };

// exports.verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required payment verification parameters'
//       });
//     }

//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     const isAuthentic = expectedSignature === razorpay_signature;

//     if (isAuthentic) {
//       res.json({
//         success: true,
//         message: 'Payment verified successfully',
//         paymentId: razorpay_payment_id,
//         orderId: razorpay_order_id
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: 'Payment verification failed'
//       });
//     }

//   } catch (error) {
//     console.error('Payment verification failed:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Payment verification failed',
//       error: error.message
//     });
//   }
// };

// exports.getPaymentDetails = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const payment = await razorpay.payments.fetch(paymentId);

//     res.json({
//       success: true,
//       payment
//     });
//   } catch (error) {
//     console.error('Failed to fetch payment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch payment details',
//       error: error.message
//     });
//   }
// };

// exports.paymentFailed = async (req, res) => {
//   try {
//     const { error, order_id, payment_id } = req.body;

//     console.log('Payment failed:', {
//       error,
//       order_id,
//       payment_id,
//       timestamp: new Date().toISOString()
//     });

//     res.json({
//       success: true,
//       message: 'Payment failure recorded'
//     });
//   } catch (error) {
//     console.error('Failed to handle payment failure:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to handle payment failure',
//       error: error.message
//     });
//   }
// };


const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order and save to DB
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', items, shippingAddress, promoCode, discount, shippingCost, tax } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be valid' });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount: amount,
      paymentDetails: {
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: 'pending',
      },
      shippingAddress,
      promoCode,
      discount,
      shippingCost,
      tax,
    });

    await order.save();

    res.json({
      success: true,
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID,
      orderId: order._id,
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

// Verify Razorpay payment and update DB
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await Order.findByIdAndUpdate(orderId, {
        'paymentDetails.razorpayPaymentId': razorpay_payment_id,
        'paymentDetails.razorpaySignature': razorpay_signature,
        'paymentDetails.paymentStatus': 'completed',
        orderStatus: 'processing',
      });

      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      await Order.findByIdAndUpdate(orderId, {
        'paymentDetails.paymentStatus': 'failed',
      });

      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};
