// // models/Order.js
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     items: [{
//         productId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Product',
//             required: true
//         },
//         name: String,
//         price: Number,
//         quantity: Number,
//         image: String
//     }],
//     totalAmount: {
//         type: Number,
//         required: true
//     },
//     paymentDetails: {
//         razorpayOrderId: String,
//         razorpayPaymentId: String,
//         razorpaySignature: String,
//         paymentStatus: {
//             type: String,
//             enum: ['pending', 'completed', 'failed'],
//             default: 'pending'
//         }
//     },
//     orderStatus: {
//         type: String,
//         enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
//         default: 'pending'
//     },
//     shippingAddress: {
//         street: String,
//         city: String,
//         state: String,
//         pincode: String,
//         country: String
//     },
//     promoCode: String,
//     discount: Number,
//     shippingCost: Number,
//     tax: Number
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('Order', orderSchema);

// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'created'
  },
  cart: [{
    _id: String,
    title: String,
    name: String,
    price: Number,
    quantity: Number,
    images: Array,
    description: String
  }],
  customerInfo: {
    name: String,
    email: String,
    phone: String
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  billing: {
    subtotal: Number,
    shipping: Number,
    tax: Number,
    discount: Number,
    total: Number
  },
  promoCode: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });
orderSchema.index({ razorpayPaymentId: 1 });
orderSchema.index({ status: 1 });

// Virtual for formatted amount
orderSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toLocaleString()}`;
});

// Instance method to calculate totals
orderSchema.methods.calculateTotals = function() {
  const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = this.billing?.discount || 0;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + tax + shipping;

  return {
    subtotal,
    shipping,
    tax,
    discount,
    total
  };
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  return stats;
};

module.exports = mongoose.model('Order', orderSchema);