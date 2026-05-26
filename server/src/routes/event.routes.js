import { Router } from 'express';
import { body } from 'express-validator';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

const maybe = (rule, partial) => (partial ? rule.optional() : rule);

const eventRules = (partial = false) => [
  maybe(body('title'), partial).trim().isLength({ min: 3 }).withMessage('Event title is required'),
  maybe(body('description'), partial).trim().isLength({ min: 10 }).withMessage('Description is required'),
  maybe(body('location'), partial).trim().isLength({ min: 2 }).withMessage('Location is required'),
  maybe(body('startsAt'), partial).isISO8601().withMessage('Valid start date is required'),
  body('type').optional().isIn(['community', 'sports', 'library', 'charity', 'medical']),
  body('capacity').optional({ values: 'falsy' }).isInt({ min: 1 })
];

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { type, upcoming } = req.query;
    const filter = { status: { $ne: 'draft' } };

    if (type) {
      filter.type = type;
    }

    if (upcoming === 'true') {
      filter.startsAt = { $gte: new Date() };
    }

    const events = await Event.find(filter)
      .populate('registrations.member', 'name membershipId phone')
      .sort({ startsAt: 1 });

    res.json({ events });
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  validate(eventRules()),
  asyncHandler(async (req, res) => {
    const event = await Event.create(req.body);

    await Notification.create({
      title: 'New community event',
      message: `${event.title} is now open for registrations.`,
      type: 'event',
      audience: 'members',
      link: `/events`
    });

    res.status(201).json({ event });
  })
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(eventRules(true)),
  asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!event) {
      throw httpError('Event not found', 404);
    }

    res.json({ event });
  })
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      throw httpError('Event not found', 404);
    }

    res.json({ message: 'Event removed' });
  })
);

router.post(
  '/:id/register',
  protect,
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      throw httpError('Event not found', 404);
    }

    const activeRegistrations = event.registrations.filter(
      (registration) => registration.status === 'registered'
    );

    if (event.capacity && activeRegistrations.length >= event.capacity) {
      throw httpError('Event registration is full', 409);
    }

    const alreadyRegistered = event.registrations.some(
      (registration) =>
        registration.member.toString() === req.user._id.toString() &&
        registration.status !== 'cancelled'
    );

    if (alreadyRegistered) {
      throw httpError('You are already registered for this event', 409);
    }

    event.registrations.push({ member: req.user._id });
    await event.save();

    await Notification.create({
      title: 'Event registration confirmed',
      message: `You are registered for ${event.title}.`,
      type: 'event',
      audience: 'single',
      recipient: req.user._id,
      link: `/events`
    });

    res.status(201).json({ event });
  })
);

export default router;
