const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure cloudinary using env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: 'No files were uploaded.' });

    const file = req.files.file; // 'file' is the name of form input
    // You can add validation here (file type, size etc.)

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'strengthlabz', // optional folder name in Cloudinary
      use_filename: true,
      unique_filename: false,
    });

    // Remove temp file
    fs.unlinkSync(file.tempFilePath);

    res.json({
      public_id: result.public_id,
      url: result.secure_url,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ msg: 'No image public_id provided' });

    await cloudinary.uploader.destroy(public_id);

    res.json({ msg: 'Image deleted' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
