const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, dateOfBirth, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return errorResponse(res, 'Email already registered.', 400);

    const user = await User.create({ name, email, password, phone, address, dateOfBirth, gender });
    const token = generateToken(user._id, user.role);

    return successResponse(
      res,
      'Registration successful.',
      {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return errorResponse(res, 'Email and password are required.', 400);

    const user = await User.findOne({ email }).select('+password');

    // Always return a generic message on failure to avoid revealing account existence
    if (!user) return errorResponse(res, 'Invalid credentials.', 401);

    const isMatch = await user.matchPassword(password);
    if (!isMatch || !user.isActive) return errorResponse(res, 'Invalid credentials.', 401);

    const token = generateToken(user._id, user.role);

    // Return token and user info. Also include top-level role/name/email for compatibility.
    return successResponse(res, 'Login successful.', {
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get current user
// @route  GET /api/auth/me
// @access Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, 'User fetched.', user);
  } catch (err) {
    next(err);
  }
};

// @desc   Update profile
// @route  PUT /api/auth/profile
// @access Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, dateOfBirth, gender } = req.body;
    const update = { name, phone, address, dateOfBirth, gender };

    if (req.file) update.profilePic = req.file.path;

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 'Profile updated successfully.', user);
  } catch (err) {
    next(err);
  }
};

// @desc   Change password
// @route  POST /api/auth/change-password
// @access Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return errorResponse(res, 'Current password is incorrect.', 400);

    user.password = newPassword;
    await user.save();

    return successResponse(res, 'Password changed successfully.');
  } catch (err) {
    next(err);
  }
};
