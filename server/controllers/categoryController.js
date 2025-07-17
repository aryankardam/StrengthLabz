const Category = require('../models/categoryModel');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Upload a buffer image to Cloudinary (for categories)
 */
const uploadImageToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'categories' },
      (err, result) => (result ? resolve(result) : reject(err))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const exists = await Category.findOne({ name });

      if (exists) return res.status(400).json({ msg: 'Category already exists' });

      let image = '';
      if (req.file) {
        const uploaded = await uploadImageToCloudinary(req.file.buffer);
        image = uploaded.secure_url;
      }

      const newCategory = new Category({ name, image });
      await newCategory.save();

      res.status(201).json({ msg: 'Category created', category: newCategory });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const updateData = {};
      if (name) updateData.name = name;

      if (req.file) {
        const uploaded = await uploadImageToCloudinary(req.file.buffer);
        updateData.image = uploaded.secure_url;
      }

      const updated = await Category.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updated) return res.status(404).json({ msg: 'Category not found' });

      res.status(200).json({ msg: 'Category updated', category: updated });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const deleted = await Category.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ msg: 'Category not found' });

      res.status(200).json({ msg: 'Category deleted' });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryController;
