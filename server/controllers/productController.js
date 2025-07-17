const Products = require('../models/productModel');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

/**
 * Utility: Upload product image to Cloudinary
 */
const uploadImage = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (err, result) => (result ? resolve(result) : reject(err))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Enhanced Class for filtering/sorting/pagination with search
 */
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };
    
    // Remove pagination and sorting parameters
    ['page', 'sort', 'limit', 'search'].forEach(el => delete queryObj[el]);

    // Handle price range filtering
    if (queryObj.minPrice || queryObj.maxPrice) {
      queryObj.price = {};
      if (queryObj.minPrice) {
        queryObj.price.$gte = parseFloat(queryObj.minPrice);
        delete queryObj.minPrice;
      }
      if (queryObj.maxPrice) {
        queryObj.price.$lte = parseFloat(queryObj.maxPrice);
        delete queryObj.maxPrice;
      }
    }

    // Convert query operators (gte, gt, lt, lte) to MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, m => `$${m}`);
    
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    const searchTerm = this.queryString.search;
    if (searchTerm) {
      // Create a regex pattern for case-insensitive search
      const searchRegex = new RegExp(searchTerm, 'i');
      
      // Search in title, description, content, and category
      this.query = this.query.find({
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { content: { $regex: searchRegex } },
          { category: { $regex: searchRegex } }
        ]
      });
    }
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      // Handle multiple sort fields separated by commas
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by creation date (newest first)
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  pagination() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 1000;
    const skip = (page - 1) * limit;
    
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productController = {
  getProducts: async (req, res) => {
    try {
      console.log('Query parameters:', req.query); // Debug log
      
      // Build the query with all features
      const features = new APIfeatures(Products.find(), req.query)
        .search()      // Add search functionality
        .filtering()   // Apply filters
        .sorting()     // Apply sorting
        .pagination(); // Apply pagination

      const products = await features.query;
      
      console.log('Found products:', products.length); // Debug log
      
      res.status(200).json({ 
        status: 'success', 
        count: products.length, 
        products 
      });
    } catch (err) {
      console.error('Error in getProducts:', err); // Debug log
      res.status(500).json({ msg: err.message });
    }
  },

  // Alternative method for getting all products without pagination (for testing)
  getAllProducts: async (req, res) => {
    try {
      const products = await Products.find();
      console.log('All products count:', products.length); // Debug log
      res.status(200).json({ 
        status: 'success', 
        count: products.length, 
        products 
      });
    } catch (err) {
      console.error('Error in getAllProducts:', err);
      res.status(500).json({ msg: err.message });
    }
  },

  // Method to get products by category
  getProductsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const products = await Products.find({ 
        category: new RegExp(category, 'i') 
      });
      
      res.status(200).json({ 
        status: 'success', 
        count: products.length, 
        products 
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // Method to search products
  searchProducts: async (req, res) => {
    try {
      const { q } = req.query; // search query
      if (!q) {
        return res.status(400).json({ msg: 'Search query is required' });
      }

      const searchRegex = new RegExp(q, 'i');
      const products = await Products.find({
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { content: { $regex: searchRegex } },
          { category: { $regex: searchRegex } }
        ]
      });

      res.status(200).json({ 
        status: 'success', 
        count: products.length, 
        products 
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  createProducts: async (req, res) => {
    try {
      const { product_id, title, price, description, content, category } = req.body;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: 'Please upload product images.' });
      }

      const exists = await Products.findOne({ product_id });
      if (exists) return res.status(400).json({ msg: 'Product ID already exists' });

      const images = [];
      for (const file of req.files) {
        const uploaded = await uploadImage(file.buffer);
        images.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
      }

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        category,
        images,
      });

      await newProduct.save();
      res.status(201).json({ msg: 'Product created', product: newProduct });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, category } = req.body;

      const product = await Products.findById(req.params.id);
      if (!product) return res.status(404).json({ msg: 'Product not found' });

      let images = product.images;

      if (req.files && req.files.length > 0) {
        for (const img of product.images) {
          await cloudinary.uploader.destroy(img.public_id);
        }

        images = [];
        for (const file of req.files) {
          const uploaded = await uploadImage(file.buffer);
          images.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
        }
      }

      const updatedProduct = await Products.findByIdAndUpdate(
        req.params.id,
        {
          title: title?.toLowerCase() || product.title,
          price: price ?? product.price,
          description: description || product.description,
          content: content || product.content,
          category: category || product.category,
          images,
        },
        { new: true }
      );

      res.status(200).json({ msg: 'Product updated', product: updatedProduct });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      if (!product) return res.status(404).json({ msg: 'Product not found' });

      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      await Products.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productController;