const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  avatar: { type: String, default: '' },
  googleId: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isPremium: { type: Boolean, default: false },
  preferences: {
    categories: [String],
    priceRange: { min: Number, max: Number },
    brands: [String],
  },
  recentSearches: [{ query: String, timestamp: Date }],
  recentlyViewed: [{ productId: String, store: String, timestamp: Date }],
  emailVerified: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
