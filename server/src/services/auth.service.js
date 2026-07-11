const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const registerUser = async (userData) => {
  const { email } = userData;
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, 'User already exists with this email.');
  }
  const user = await User.create(userData);
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).populate('department');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'supersecretjwtsecretkey12345',
    { expiresIn: '7d' }
  );

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
