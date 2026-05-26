import { Router } from 'express';
import { body } from 'express-validator';
import Book from '../models/Book.js';
import Notification from '../models/Notification.js';
import Reservation from '../models/Reservation.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

const maybe = (rule, partial) => (partial ? rule.optional() : rule);

const bookRules = (partial = false) => [
  maybe(body('title'), partial).trim().isLength({ min: 2 }).withMessage('Book title is required'),
  maybe(body('author'), partial).trim().isLength({ min: 2 }).withMessage('Author is required'),
  maybe(body('category'), partial).trim().isLength({ min: 2 }).withMessage('Category is required'),
  body('totalCopies').optional().isInt({ min: 0 }).withMessage('Total copies must be positive'),
  body('availableCopies').optional().isInt({ min: 0 }).withMessage('Available copies must be positive')
];

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search, category, available } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (available === 'true') {
      filter.availableCopies = { $gt: 0 };
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { author: regex },
        { category: regex },
        { isbn: regex },
        { tags: regex }
      ];
    }

    const books = await Book.find(filter).sort({ title: 1 });
    res.json({ books });
  })
);

router.get(
  '/member/history',
  protect,
  asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ member: req.user._id })
      .populate('book')
      .sort({ createdAt: -1 });

    res.json({ reservations });
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  validate(bookRules()),
  asyncHandler(async (req, res) => {
    const totalCopies = Number(req.body.totalCopies ?? 1);
    const availableCopies = Number(req.body.availableCopies ?? totalCopies);

    if (availableCopies > totalCopies) {
      throw httpError('Available copies cannot exceed total copies', 422);
    }

    const book = await Book.create({
      ...req.body,
      totalCopies,
      availableCopies
    });

    res.status(201).json({ book });
  })
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(bookRules(true)),
  asyncHandler(async (req, res) => {
    if (req.body.availableCopies > req.body.totalCopies) {
      throw httpError('Available copies cannot exceed total copies', 422);
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      throw httpError('Book not found', 404);
    }

    res.json({ book });
  })
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      throw httpError('Book not found', 404);
    }

    await Reservation.deleteMany({ book: req.params.id, status: { $in: ['reserved', 'borrowed'] } });
    res.json({ message: 'Book removed' });
  })
);

router.post(
  '/:id/reserve',
  protect,
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw httpError('Book not found', 404);
    }

    if (book.availableCopies < 1) {
      throw httpError('Book is currently unavailable', 409);
    }

    const existing = await Reservation.findOne({
      book: book._id,
      member: req.user._id,
      status: { $in: ['reserved', 'borrowed'] }
    });

    if (existing) {
      throw httpError('You already have an active reservation for this book', 409);
    }

    book.availableCopies -= 1;
    await book.save();

    const reservation = await Reservation.create({
      book: book._id,
      member: req.user._id,
      status: 'reserved'
    });

    await Notification.create({
      title: 'Book reservation confirmed',
      message: `${book.title} has been reserved for you.`,
      type: 'book',
      audience: 'single',
      recipient: req.user._id,
      link: `/library`
    });

    res.status(201).json({ reservation });
  })
);

export default router;
