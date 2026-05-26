import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    address: {
      type: String,
      trim: true
    },
    membershipId: {
      type: String,
      unique: true
    },
    avatarUrl: String,
    isActive: {
      type: Boolean,
      default: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

userSchema.pre('validate', function assignMembershipId(next) {
  if (!this.membershipId) {
    const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
    this.membershipId = `NVA-${new Date().getFullYear()}-${suffix}`;
  }

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
