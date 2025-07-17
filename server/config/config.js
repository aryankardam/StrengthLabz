require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,

  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/strengthLabz',

  jwtSecret: process.env.JWT_SECRET || 'your_default_jwt_secret_here',

  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRES_IN || '7d',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
};
