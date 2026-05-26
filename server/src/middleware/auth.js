import jwt from 'jsonwebtoken';
import { asyncHandler } from './asyncHandler.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    const error = new Error('Authentication token is required');
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-change-me');
  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    const error = new Error('User account is not active');
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error('You do not have permission to access this resource');
    error.statusCode = 403;
    return next(error);
  }

  next();
};
