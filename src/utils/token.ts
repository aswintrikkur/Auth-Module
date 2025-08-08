import jwt from 'jsonwebtoken';
import { AppError } from './appError';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure JWT_SECRET is defined
const NODE_ENV = process.env.NODE_ENV;

export const generateToken = (id: string, role: string = 'user') => {
  return jwt.sign({ id, role }, JWT_SECRET);
};
