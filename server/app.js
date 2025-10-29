// 1. Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// 2. Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'https://strength-labz.vercel.app',             // deployed frontend
  'https://strength-labz-git-main-aryan-kardams-projects.vercel.app', // any other frontend origins,
  'http://localhost:5173',   //local deployment
];

// Enable CORS for specific origins
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, false); // or true if you want to allow postman etc.
    if (allowedOrigins.includes(origin)) {
      callback(null, origin);  // MUST pass origin string, not true
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // allow cookies/auth headers
};

app.use(cors(corsOptions));

// Remove the following block to avoid conflicting CORS settings:
// app.use(cors({
//   origin: '*',
// }));


app.use(cookieParser());

// For webhook, we need raw body
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// For other routes, use JSON parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 5. Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// 6. Default test route
app.get('/', (req, res) => {
  res.send('🚀 API is running');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    razorpay: process.env.RAZORPAY_KEY_ID ? 'configured' : 'not configured'
  });
});

// 7. API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

// 8. Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 9. Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured'}`);
});


// // 1. Load environment variables
// const dotenv = require('dotenv');
// dotenv.config();

// // 2. Import dependencies
// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');

// const app = express();
// // 3. Middleware
// app.use(cors({
//   origin: (origin, callback) => {
//     callback(null, origin);  // Allow all origins dynamically
//   },
//   credentials: true
// }));

// app.use(express.json());
// app.use(cookieParser());


// // 4. Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // 5. Import routes
// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const productRoutes = require('./routes/productRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');

// // 6. Default test route
// app.get('/', (req, res) => {
//   res.send('🚀 API is running');
// });

// // 7. API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/payment', paymentRoutes);

// // 8. Global error handler
// app.use((err, req, res, next) => {
//   console.error('💥 Server Error:', err.stack);
//   res.status(500).json({ message: 'Internal Server Error' });
// });

// // 9. Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
