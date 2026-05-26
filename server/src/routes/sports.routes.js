import { Router } from 'express';
import { body } from 'express-validator';
import SportsUpdate from '../models/SportsUpdate.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

const maybe = (rule, partial) => (partial ? rule.optional() : rule);

const sportsRules = (partial = false) => [
  maybe(body('title'), partial).trim().isLength({ min: 3 }).withMessage('Title is required'),
  maybe(body('sport'), partial).trim().isLength({ min: 2 }).withMessage('Sport is required'),
  maybe(body('summary'), partial).trim().isLength({ min: 8 }).withMessage('Summary is required'),
  body('scheduleAt').optional({ values: 'falsy' }).isISO8601()
];

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const updates = await SportsUpdate.find().sort({ isHighlight: -1, scheduleAt: 1, createdAt: -1 });
    res.json({ updates });
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  validate(sportsRules()),
  asyncHandler(async (req, res) => {
    const update = await SportsUpdate.create(req.body);
    res.status(201).json({ update });
  })
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(sportsRules(true)),
  asyncHandler(async (req, res) => {
    const update = await SportsUpdate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!update) {
      throw httpError('Sports update not found', 404);
    }

    res.json({ update });
  })
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const update = await SportsUpdate.findByIdAndDelete(req.params.id);
    if (!update) {
      throw httpError('Sports update not found', 404);
    }

    res.json({ message: 'Sports update removed' });
  })
);

export default router;
