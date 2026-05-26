import { Router } from 'express';
import Book from '../models/Book.js';
import EquipmentRequest from '../models/EquipmentRequest.js';
import Event from '../models/Event.js';
import MedicalEquipment from '../models/MedicalEquipment.js';
import Reservation from '../models/Reservation.js';
import SportsUpdate from '../models/SportsUpdate.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get(
  '/analytics',
  asyncHandler(async (_req, res) => {
    const now = new Date();
    const [
      totalMembers,
      totalBooks,
      activeReservations,
      upcomingEvents,
      sportsUpdates,
      equipmentItems,
      pendingEquipmentRequests,
      emergencyRequests
    ] = await Promise.all([
      User.countDocuments({ role: 'member', isActive: true }),
      Book.countDocuments(),
      Reservation.countDocuments({ status: { $in: ['reserved', 'borrowed'] } }),
      Event.countDocuments({ startsAt: { $gte: now }, status: 'published' }),
      SportsUpdate.countDocuments(),
      MedicalEquipment.countDocuments(),
      EquipmentRequest.countDocuments({ status: 'pending' }),
      EquipmentRequest.countDocuments({ urgency: 'emergency', status: { $in: ['pending', 'approved'] } })
    ]);

    res.json({
      analytics: {
        totalMembers,
        totalBooks,
        activeReservations,
        upcomingEvents,
        sportsUpdates,
        equipmentItems,
        pendingEquipmentRequests,
        emergencyRequests
      }
    });
  })
);

router.get(
  '/members',
  asyncHandler(async (_req, res) => {
    const members = await User.find({ role: 'member' })
      .select('-passwordHash')
      .sort({ joinedAt: -1 });

    res.json({ members });
  })
);

export default router;
