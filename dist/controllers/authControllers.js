"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const appError_1 = require("../utils/appError");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const token_1 = require("../utils/token");
exports.registerUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { name, email, password } = req.body;
    // Validate input
    if (!name || !email || !password) {
        return next(new appError_1.AppError('Please provide name, email, and password', 400));
    }
    // Check if user already exists
    const existingUser = await userModel_1.User.findOne({ email });
    if (existingUser) {
        return next(new appError_1.AppError('User already exists with this email', 400));
    }
    // Create new user
    const newUser = new userModel_1.User({ name, email, password });
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
exports.loginUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
        return next(new appError_1.AppError('Please provide email and password', 400));
    }
    // Find user by email
    const user = await userModel_1.User.findOne({ email });
    // if (!user || !(await user.correctPassword(password, user.password))) {
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError_1.AppError('Incorrect email or password', 401));
    }
    // Generate JWT token (you would typically do this in a separate utility function)
    const token = (0, token_1.generateToken)(user._id.toString());
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
exports.getUserProfile = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req.user?.id; // Assuming user ID is stored in req.user
    // Find user by ID
    const user = await userModel_1.User.findById(userId);
    if (!user) {
        return next(new appError_1.AppError('User not found', 404));
    }
    const { password: _, ...data } = user.toObject(); // Exclude password from response
    // Respond with the user profile (excluding password)
    res.status(200).json({
        status: 'success',
        data: data,
    });
});
