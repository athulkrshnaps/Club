import mongoose from 'mongoose';

const medicalEquipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['medical-bed', 'wheelchair', 'nebulizer', 'oxygen-concentrator', 'other'],
      required: true
    },
    description: String,
    totalUnits: {
      type: Number,
      default: 1,
      min: 0
    },
    availableUnits: {
      type: Number,
      default: 1,
      min: 0
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'service-needed'],
      default: 'good'
    },
    imageUrl: String,
    isEmergencyReady: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

medicalEquipmentSchema.index({ name: 'text', type: 'text', description: 'text' });

const MedicalEquipment = mongoose.model('MedicalEquipment', medicalEquipmentSchema);

export default MedicalEquipment;
