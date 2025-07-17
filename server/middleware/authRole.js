const User = require('../models/userModel');

const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });

      if (user.role !== role) {
        return res.status(403).json({ msg: `Access denied. ${role}s only.` });
      }

      next();
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
};

module.exports = checkRole;
