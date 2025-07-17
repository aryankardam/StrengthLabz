const mongoose = require('mongoose');

/**
 * Product Schema for eCommerce platform
 */
const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      }
    ],
    required: true,
    validate: [arr => arr.length > 0, 'At least one image is required'],
  },
  category: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  sold: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
