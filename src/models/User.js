const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: function() {
      return !this.phoneNumber; // Email is required if no phone number
    },
    unique: true,
    sparse: true, // Allows multiple null values
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  phoneNumber: {
    type: String,
    required: function() {
      return !this.email; // Phone number is required if no email
    },
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number',
    ],
  },
  password: {
    type: String,
    required: function() {
      return !this.firebaseUid; // Password not required if using Firebase auth
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  lastLoginTime: {
    type: Date,
    default: null,
  },
  sessionHistory: [{
    loginTime: {
      type: Date,
      required: true,
    },
    logoutTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in seconds
      required: true,
    },
    formattedDuration: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
