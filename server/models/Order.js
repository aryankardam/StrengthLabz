// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentDetails: {
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        }
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    promoCode: String,
    discount: Number,
    shippingCost: Number,
    tax: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);