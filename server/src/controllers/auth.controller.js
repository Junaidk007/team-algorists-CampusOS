const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    console.log('Auth Register Controller hit:', req.body);
    const user = await authService.registerUser(req.body);
    console.log('User created:', user);
    res.status(201).json(new ApiResponse(201, user, 'Registration successful.'));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    res.status(200).json(new ApiResponse(200, data, 'Login successful.'));
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('department');
    res.status(200).json(new ApiResponse(200, user, 'User profile fetched.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
