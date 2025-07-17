const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create Access and Refresh Tokens
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const authController = {
  // REGISTER
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please fill all fields' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already registered' });
      }

      if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        secure: false,                     // must be false on HTTP (dev)
  sameSite: 'none',                  // allow cross‑site cookie
  maxAge: 7 * 24 * 60 * 60 * 1000,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
        // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ accessToken });
    } catch (err) {
      console.error('Register Error:', err);
      return res.status(500).json({ msg: 'Server error during registration' });
    }
  },

  // LOGIN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ msg: 'Please fill all fields' });
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Incorrect password' });
      }

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: '/api/auth/refresh_token',
        secure: false,                     // must be false on HTTP (dev)
  sameSite: 'none',                  // allow cross‑site cookie
  maxAge: 7 * 24 * 60 * 60 * 1000,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
        // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ accessToken });
    } catch (err) {
      console.error('Login Error:', err);
      return res.status(500).json({ msg: 'Server error during login' });
    }
  },

  // REFRESH TOKEN
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) {
        return res.status(401).json({ msg: 'Please login or register' });
      }

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: 'Invalid or expired refresh token' });

        const accessToken = createAccessToken({ id: user.id });
        res.json({ accessToken });
      });
    } catch (err) {
      console.error('Refresh Token Error:', err);
      return res.status(500).json({ msg: 'Server error during token refresh' });
    }
  },

  // LOGOUT
  logout: (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/api/auth/refresh_token' });
      res.json({ msg: 'Logged out successfully' });
    } catch (err) {
      console.error('Logout Error:', err);
      return res.status(500).json({ msg: 'Server error during logout' });
    }
  },

  // GET USER DETAILS
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error('Get User Error:', err);
      return res.status(500).json({ msg: 'Server error fetching user' });
    }
  },
};

module.exports = authController;
