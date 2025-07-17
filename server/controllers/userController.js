const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

// Helper: Create Access Token
const createAccessToken = (payload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.accessTokenExpiry });

// Helper: Create Refresh Token
const createRefreshToken = (payload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.refreshTokenExpiry });

// Helper: Send refresh token as HTTP-only cookie
const createTokenCookie = (res, token) => {
  res.cookie('refreshtoken', token, {
    httpOnly: true,
    path: '/api/user/refresh_token',
    secure: false,                     // must be false on HTTP (dev)
  sameSite: 'none',                  // allow cross‑site cookie
  maxAge: 7 * 24 * 60 * 60 * 1000,
    // secure: process.env.NODE_ENV === 'production',
    // sameSite: 'strict',
  });
};

const userController = {
  /**
   * @route POST /api/user/register
   * @desc Register new user
   * @access Public
   */
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        return res.status(400).json({ msg: 'All fields are required' });

      const userExists = await Users.findOne({ email });
      if (userExists)
        return res.status(400).json({ msg: 'Email already registered' });

      if (password.length < 6)
        return res.status(400).json({ msg: 'Password must be at least 6 characters long' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({ name, email, password: hashedPassword });
      await newUser.save();

      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });

      createTokenCookie(res, refreshToken);
      res.status(201).json({ accessToken });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  /**
   * @route POST /api/user/login
   * @desc Authenticate user and return access token
   * @access Public
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ msg: 'Email and password are required' });

      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      createTokenCookie(res, refreshToken);
      res.json({ accessToken });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  /**
   * @route GET /api/user/refresh_token
   * @desc Return new access token from refresh token
   * @access Private (cookie)
   */
  refreshToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(401).json({ msg: 'No refresh token. Please login again.' });

      jwt.verify(rf_token, config.jwtSecret, (err, user) => {
        if (err) return res.status(403).json({ msg: 'Invalid or expired refresh token' });

        const accessToken = createAccessToken({ id: user.id });
        res.json({ accessToken });
      });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  /**
   * @route GET /api/user/logout
   * @desc Clear refresh token and logout
   * @access Public
   */
  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/api/user/refresh_token' });
      res.json({ msg: 'Logged out successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  /**
   * @route GET /api/user/infor
   * @desc Get logged-in user info
   * @access Private
   */
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ msg: 'User not found' });

      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  /**
   * @route PATCH /api/user/addcart
   * @desc Update user's cart
   * @access Private
   */
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });

      user.cart = req.body.cart;
      await user.save();

      res.json({ msg: 'Cart updated successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },
};

module.exports = userController;
