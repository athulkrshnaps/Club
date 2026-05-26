import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body } from 'express-validator';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { generateToken } from '../utils/generateToken.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  phone: user.phone,
  email: user.email,
  role: user.role,
  address: user.address,
  membershipId: user.membershipId,
  avatarUrl: user.avatarUrl,
  joinedAt: user.joinedAt
});

const loginRules = [
  body('identifier').optional().trim(),
  body('phone').optional().trim(),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body().custom((_value, { req }) => {
    if (!req.body.identifier && !req.body.phone && !req.body.email) {
      throw new Error('Phone number or email is required');
    }

    return true;
  })
];

router.post(
  '/login',
  validate(loginRules),
  asyncHandler(async (req, res) => {
    const identifier = (req.body.identifier || req.body.phone || req.body.email || '').trim();
    const query = identifier.includes('@')
      ? { email: identifier.toLowerCase() }
      : { phone: identifier };

    const user = await User.findOne(query).select('+passwordHash');
    if (!user || !user.isActive) {
      throw httpError('Invalid credentials', 401);
    }

    const passwordMatches = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!passwordMatches) {
      throw httpError('Invalid credentials', 401);
    }

    res.json({
      token: generateToken(user),
      user: sanitizeUser(user)
    });
  })
);

router.post(
  '/register-member',
  validate([
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('phone').trim().isLength({ min: 8 }).withMessage('Phone number is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email is required'),
    body('address').optional().trim()
  ]),
  asyncHandler(async (req, res) => {
    const existing = await User.findOne({
      $or: [{ phone: req.body.phone }, ...(req.body.email ? [{ email: req.body.email.toLowerCase() }] : [])]
    });

    if (existing) {
      throw httpError('A member with this phone or email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      passwordHash,
      role: 'member'
    });

    res.status(201).json({
      token: generateToken(user),
      user: sanitizeUser(user)
    });
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    res.json({ user: sanitizeUser(req.user) });
  })
);

export default router;
