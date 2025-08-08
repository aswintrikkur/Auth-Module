"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const userModel_1 = require("../models/userModel");
const appError_1 = require("../utils/appError");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
exports.userAuth = (0, catchAsync_1.default)(async (req, res, next) => {
    console.log('🛡️ Protect middleware running on:', req.originalUrl);
    // 1) Get the token and check its there
    const token = req.cookies.token;
    if (!token)
        return next(new appError_1.AppError('Please Login to get access..', 401));
    // 2) Varify token
    const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET); // there is a chance to get error
    if (!decodedToken)
        return next(new appError_1.AppError('Please Login to get access..', 401));
    // 3) Check the user is still exist to make sure
    const currentUser = await userModel_1.User.findById(decodedToken.id);
    if (!currentUser)
        return next(new appError_1.AppError('The User belong to this token is not exist'));
    // passing the user  to next middleware
    req.user = { id: currentUser._id.toString() };
    // next();
    // Check if user is authenticated
    if (!req.user) {
        return next(new appError_1.AppError('You are not logged in! Please log in to access this resource.', 401));
    }
    // If authenticated, proceed to the next middleware or route handler
    next();
});
