import mongoose from 'mongoose';

const sportsUpdateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    sport: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    scheduleAt: Date,
    venue: String,
    score: String,
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          default: 'image'
        },
        url: String,
        caption: String
      }
    ],
    isHighlight: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

sportsUpdateSchema.index({ title: 'text', sport: 'text', summary: 'text' });

const SportsUpdate = mongoose.model('SportsUpdate', sportsUpdateSchema);

export default SportsUpdate;
