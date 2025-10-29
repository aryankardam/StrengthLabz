const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/userModel');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= Controllers =================

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = 'INR',
      receipt,
      cart,
      customerInfo,
      shipping,
      tax,
      discount,
      promoCode
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Backend calculation (security)
    const calculatedSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const calculatedShipping = calculatedSubtotal >= 999 ? 0 : 99;
    const calculatedDiscount = discount || 0;
    const calculatedTax = (calculatedSubtotal - calculatedDiscount) * 0.18;
    const calculatedTotal = calculatedSubtotal - calculatedDiscount + calculatedTax + calculatedShipping;

    if (Math.abs(amount - calculatedTotal * 100) > 100) {
      return res.status(400).json({ success: false, message: 'Amount mismatch. Please refresh and try again.' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount),
      currency,
      receipt: receipt || `order_${Date.now()}_${req.user.id}`,
      payment_capture: 1,
      notes: {
        userId: req.user.id,
        cartItems: cart.length,
        promoCode: promoCode || 'none'
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const orderDoc = new Order({
      userId: req.user.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amount / 100,
      currency,
      status: 'created',
      cart,
      customerInfo,
      shipping,
      tax,
      discount,
      promoCode,
      createdAt: new Date()
    });

    await orderDoc.save();

    res.json({
      success: true,
      orderId: orderDoc._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification data' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.status = 'paid';
    order.paidAt = new Date();
    await order.save();

    res.json({ success: true, message: 'Payment verified successfully', orderId: order._id, status: 'paid' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};

// Get payment history
exports.getHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment history', error: error.message });
  }
};

// Razorpay webhook
exports.webhook = async (req, res) => {
  try {
    const receivedSignature = req.headers['x-razorpay-signature'];
    const body = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (receivedSignature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload.payload.payment.entity);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// Helper: successful payment
async function handlePaymentCaptured(paymentEntity) {
  try {
    const order = await Order.findOne({ razorpayOrderId: paymentEntity.order_id });
    if (order && order.status !== 'paid') {
      order.status = 'paid';
      order.razorpayPaymentId = paymentEntity.id;
      order.paidAt = new Date();
      await order.save();
      console.log(`Payment captured for order: ${order._id}`);
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

// Helper: failed payment
async function handlePaymentFailed(paymentEntity) {
  try {
    const order = await Order.findOne({ razorpayOrderId: paymentEntity.order_id });
    if (order) {
      order.status = 'failed';
      order.failureReason = paymentEntity.error_description;
      await order.save();
      console.log(`Payment failed for order: ${order._id}`);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
