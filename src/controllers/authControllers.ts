import { ObjectId } from 'mongoose';
import { User } from '../models/userModel';
import { AppError } from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { generateToken } from '../utils/token';
import { Request, Response, NextFunction } from 'express';

export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }

  // Create new user
  const newUser = new User({ name, email, password });
  await newUser.save();

  const { password: _, ...data } = newUser.toObject(); // Exclude password from response

  // Respond with the created user (excluding password)
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: data,
  });

  // const newUser = new User({ name, email, password });
  // await newUser.save();
  // Here you would typically create a new user in the database
});

export const loginUser = catchAsync(async (req: any, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Find user by email
  const user = await User.findOne({ email });

  // if (!user || !(await user.correctPassword(password, user.password))) {
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Generate JWT token (you would typically do this in a separate utility function)
  const token = generateToken(user._id.toString());

  // const token = jwt.sign(
  //   { id: user._id, role: user.role },
  //   process.env.JWT_SECRET || 'your_jwt_secret_key',
  //   {
  //     expiresIn: '1h', // Token expiration time
  //   },
  // );

  const { password: _, ...data } = user.toObject(); // Exclude password from response

  // Respond with the logged-in user (excluding password)
  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully',
    data: data,
  });
});

export const getUserProfile = catchAsync(async (req, res, next) => {
  const userId = req.user?.id; // Assuming user ID is stored in req.user

  // Find user by ID
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const { password: _, ...data } = user.toObject(); // Exclude password from response

  // Respond with the user profile (excluding password)
  res.status(200).json({
    status: 'success',
    data: data,
  });
});




