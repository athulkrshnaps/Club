import mongoose from 'mongoose';

const equipmentRequestSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalEquipment',
      required: true
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    patientName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    reason: String,
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'emergency'],
      default: 'normal'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'issued', 'returned', 'rejected'],
      default: 'pending'
    },
    requestedFrom: Date,
    requestedTo: Date
  },
  { timestamps: true }
);

equipmentRequestSchema.index({ equipment: 1, member: 1, status: 1 });

const EquipmentRequest = mongoose.model('EquipmentRequest', equipmentRequestSchema);

export default EquipmentRequest;
