const User = require('../models/userModel');

/**
 * @desc Middleware to verify if user is an admin
 */
const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    next();
  } catch (err) {
    console.error('AuthAdmin Error:', err);
    return res.status(500).json({ msg: 'Server error checking admin rights' });
  }
};

module.exports = authAdmin;
