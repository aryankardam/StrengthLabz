// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
  origin: [
    'https://strength-labz-git-main-aryan-kardams-projects.vercel.app/',
    'http://localhost:3000' // for development
  ],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Default route
app.get('/', (req, res) => {
  res.send('🚀 API is running');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
