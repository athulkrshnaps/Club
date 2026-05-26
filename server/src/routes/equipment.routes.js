import { Router } from 'express';
import { body } from 'express-validator';
import EquipmentRequest from '../models/EquipmentRequest.js';
import MedicalEquipment from '../models/MedicalEquipment.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

const maybe = (rule, partial) => (partial ? rule.optional() : rule);

const equipmentRules = (partial = false) => [
  maybe(body('name'), partial).trim().isLength({ min: 3 }).withMessage('Equipment name is required'),
  maybe(body('type'), partial).isIn(['medical-bed', 'wheelchair', 'nebulizer', 'oxygen-concentrator', 'other']),
  body('totalUnits').optional().isInt({ min: 0 }),
  body('availableUnits').optional().isInt({ min: 0 })
];

router.get(
  '/requests/mine',
  protect,
  asyncHandler(async (req, res) => {
    const requests = await EquipmentRequest.find({ member: req.user._id })
      .populate('equipment')
      .sort({ createdAt: -1 });

    res.json({ requests });
  })
);

router.get(
  '/requests',
  protect,
  authorize('admin'),
  asyncHandler(async (_req, res) => {
    const requests = await EquipmentRequest.find()
      .populate('equipment')
      .populate('member', 'name phone membershipId')
      .sort({ createdAt: -1 });

    res.json({ requests });
  })
);

router.patch(
  '/requests/:requestId',
  protect,
  authorize('admin'),
  validate([body('status').isIn(['pending', 'approved', 'issued', 'returned', 'rejected'])]),
  asyncHandler(async (req, res) => {
    const request = await EquipmentRequest.findById(req.params.requestId).populate('equipment');
    if (!request) {
      throw httpError('Request not found', 404);
    }

    const equipment = await MedicalEquipment.findById(request.equipment._id);
    const previousStatus = request.status;
    const nextStatus = req.body.status;

    if (previousStatus !== 'issued' && nextStatus === 'issued') {
      if (equipment.availableUnits < 1) {
        throw httpError('No units available to issue', 409);
      }

      equipment.availableUnits -= 1;
      await equipment.save();
    }

    if (previousStatus === 'issued' && ['returned', 'rejected'].includes(nextStatus)) {
      equipment.availableUnits = Math.min(equipment.totalUnits, equipment.availableUnits + 1);
      await equipment.save();
    }

    request.status = nextStatus;
    await request.save();

    await Notification.create({
      title: 'Medical equipment request updated',
      message: `${request.equipment.name} request is now ${nextStatus}.`,
      type: 'charity',
      audience: 'single',
      recipient: request.member,
      link: `/charity-medical`
    });

    res.json({ request });
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { type, available } = req.query;
    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (available === 'true') {
      filter.availableUnits = { $gt: 0 };
    }

    const equipment = await MedicalEquipment.find(filter).sort({
      isEmergencyReady: -1,
      name: 1
    });

    res.json({ equipment });
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  validate(equipmentRules()),
  asyncHandler(async (req, res) => {
    const totalUnits = Number(req.body.totalUnits ?? 1);
    const availableUnits = Number(req.body.availableUnits ?? totalUnits);

    if (availableUnits > totalUnits) {
      throw httpError('Available units cannot exceed total units', 422);
    }

    const equipment = await MedicalEquipment.create({
      ...req.body,
      totalUnits,
      availableUnits
    });

    res.status(201).json({ equipment });
  })
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(equipmentRules(true)),
  asyncHandler(async (req, res) => {
    if (req.body.availableUnits > req.body.totalUnits) {
      throw httpError('Available units cannot exceed total units', 422);
    }

    const equipment = await MedicalEquipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!equipment) {
      throw httpError('Equipment not found', 404);
    }

    res.json({ equipment });
  })
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const equipment = await MedicalEquipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      throw httpError('Equipment not found', 404);
    }

    res.json({ message: 'Equipment removed' });
  })
);

router.post(
  '/:id/request',
  protect,
  validate([
    body('patientName').trim().isLength({ min: 2 }).withMessage('Patient name is required'),
    body('phone').trim().isLength({ min: 8 }).withMessage('Phone is required'),
    body('address').trim().isLength({ min: 5 }).withMessage('Address is required'),
    body('urgency').optional().isIn(['normal', 'urgent', 'emergency']),
    body('requestedFrom').optional({ values: 'falsy' }).isISO8601(),
    body('requestedTo').optional({ values: 'falsy' }).isISO8601()
  ]),
  asyncHandler(async (req, res) => {
    const equipment = await MedicalEquipment.findById(req.params.id);
    if (!equipment) {
      throw httpError('Equipment not found', 404);
    }

    if (equipment.availableUnits < 1) {
      throw httpError('This item is currently unavailable', 409);
    }

    const request = await EquipmentRequest.create({
      equipment: equipment._id,
      member: req.user._id,
      patientName: req.body.patientName,
      phone: req.body.phone,
      address: req.body.address,
      reason: req.body.reason,
      urgency: req.body.urgency,
      requestedFrom: req.body.requestedFrom,
      requestedTo: req.body.requestedTo
    });

    await Notification.create({
      title: 'New medical support request',
      message: `${req.user.name} requested ${equipment.name}.`,
      type: req.body.urgency === 'emergency' ? 'emergency' : 'charity',
      audience: 'admins',
      link: `/admin`
    });

    res.status(201).json({ request });
  })
);

export default router;
