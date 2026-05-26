import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['reserved', 'borrowed', 'returned', 'cancelled'],
      default: 'reserved'
    },
    reservedAt: {
      type: Date,
      default: Date.now
    },
    borrowedAt: Date,
    dueAt: Date,
    returnedAt: Date
  },
  { timestamps: true }
);

reservationSchema.index({ book: 1, member: 1, status: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
