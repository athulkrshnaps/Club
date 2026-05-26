import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['event', 'book', 'announcement', 'charity', 'emergency'],
      default: 'announcement'
    },
    audience: {
      type: String,
      enum: ['all', 'members', 'admins', 'single'],
      default: 'all'
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    link: String
  },
  { timestamps: true }
);

notificationSchema.index({ title: 'text', message: 'text', type: 'text' });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
