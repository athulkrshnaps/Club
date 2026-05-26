import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['community', 'sports', 'library', 'charity', 'medical'],
      default: 'community'
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    startsAt: {
      type: Date,
      required: true
    },
    endsAt: Date,
    capacity: {
      type: Number,
      min: 0
    },
    imageUrl: String,
    status: {
      type: String,
      enum: ['draft', 'published', 'completed', 'cancelled'],
      default: 'published'
    },
    registrations: [eventRegistrationSchema],
    gallery: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          default: 'image'
        },
        url: String,
        caption: String
      }
    ]
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text', location: 'text' });

const Event = mongoose.model('Event', eventSchema);

export default Event;
