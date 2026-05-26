import { Router } from 'express';
import { body } from 'express-validator';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const audience = [{ audience: 'all' }, { audience: 'single', recipient: req.user._id }];

    if (req.user.role === 'admin') {
      audience.push({ audience: 'admins' });
    } else {
      audience.push({ audience: 'members' });
    }

    const notifications = await Notification.find({ $or: audience }).sort({ createdAt: -1 }).limit(50);

    const withReadState = notifications.map((notification) => ({
      ...notification.toObject(),
      isRead: notification.readBy.some((id) => id.toString() === req.user._id.toString())
    }));

    res.json({ notifications: withReadState });
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  validate([
    body('title').trim().isLength({ min: 3 }).withMessage('Title is required'),
    body('message').trim().isLength({ min: 5 }).withMessage('Message is required'),
    body('type').optional().isIn(['event', 'book', 'announcement', 'charity', 'emergency']),
    body('audience').optional().isIn(['all', 'members', 'admins', 'single'])
  ]),
  asyncHandler(async (req, res) => {
    const notification = await Notification.create(req.body);
    res.status(201).json({ notification });
  })
);

router.patch(
  '/:id/read',
  protect,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      throw httpError('Notification not found', 404);
    }

    if (!notification.readBy.some((id) => id.toString() === req.user._id.toString())) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }

    res.json({ notification });
  })
);

export default router;
