import { User } from '../models/userModel';
import { TokenPayload } from '../types/express';
import { AppError } from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const userAuth = catchAsync(async (req, res, next) => {
  console.log('🛡️ Protect middleware running on:', req.originalUrl);

  // 1) Get the token and check its there
  const token = req.cookies.token;

  if (!token) return next(new AppError('Please Login to get access..', 401));

  // 2) Varify token
  const decodedToken = jwt.verify(token, JWT_SECRET) as TokenPayload; // there is a chance to get error
  if (!decodedToken) return next(new AppError('Please Login to get access..', 401));

  // 3) Check the user is still exist to make sure
  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser)
    return next(new AppError('The User belong to this token is not exist'));

  // passing the user  to next middleware
  req.user = { id: currentUser._id.toString() };

  // next();

  // Check if user is authenticated
  if (!req.user) {
    return next(
      new AppError(
        'You are not logged in! Please log in to access this resource.',
        401,
      ),
    );
  }

  // If authenticated, proceed to the next middleware or route handler
  next();
});
