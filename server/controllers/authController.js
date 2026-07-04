import Admin from '../models/Admin.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const sanitizeAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
});

export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    throw new AppError('Admin with this email already exists', 409);
  }

  const admin = await Admin.create({ name, email, password });
  const token = generateToken(admin._id);

  res.status(201).json({
    success: true,
    token,
    admin: sanitizeAdmin(admin),
  });
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(admin._id);

  res.status(200).json({
    success: true,
    token,
    admin: sanitizeAdmin(admin),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    admin: sanitizeAdmin(req.admin),
  });
});
