const User = require('../models/userModel');

/**
 * @desc Admin Dashboard
 * @route GET /api/admin/dashboard
 * @access Private (Admin only)
 */
const adminDashboard = (req, res) => {
  return res.status(200).json({
    msg: `Welcome Admin! Your user ID is ${req.user.id}`,
  });
};

/**
 * @desc Update a User's Role (admin, user, seller)
 * @route PATCH /api/admin/users/:id/role
 * @access Private (Admin only)
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['user', 'admin', 'seller'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Admins cannot change their own role' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      msg: `User role updated to '${role}'`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Admin Update Role Error:', err);
    return res.status(500).json({ msg: 'Server error updating user role' });
  }
};

module.exports = {
  adminDashboard,
  updateUserRole,
};
