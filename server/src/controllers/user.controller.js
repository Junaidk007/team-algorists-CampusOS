const User = require('../models/User');
const Department = require('../models/Department');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query).populate('department').select('-password');
    res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    if (!name || !email || !password || !role) {
      throw new ApiError(400, 'Name, email, password, and role are required.');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(400, 'User already exists with this email.');
    }

    if (department) {
      const deptExists = await Department.findById(department);
      if (!deptExists) {
        throw new ApiError(404, 'Department not found.');
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department: department || null
    });

    const populatedUser = await User.findById(user._id).populate('department').select('-password');
    res.status(201).json(new ApiResponse(201, populatedUser, 'User created successfully.'));
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, department } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        throw new ApiError(400, 'User already exists with this email.');
      }
      user.email = email;
    }

    if (department) {
      const deptExists = await Department.findById(department);
      if (!deptExists) {
        throw new ApiError(404, 'Department not found.');
      }
      user.department = department;
    } else if (department === null || department === '') {
      user.department = null;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (password) user.password = password;

    await user.save();

    const populatedUser = await User.findById(user._id).populate('department').select('-password');
    res.status(200).json(new ApiResponse(200, populatedUser, 'User updated successfully.'));
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      throw new ApiError(400, 'You cannot delete your own administrative account.');
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json(new ApiResponse(200, null, 'User deleted successfully.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
