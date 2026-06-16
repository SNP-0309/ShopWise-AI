const User = require('../models/User');
const { auth } = require('../config/firebase');

exports.syncUser = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decodedToken = await auth.verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      // Create new user in MongoDB if they don't exist
      user = new User({
        firebaseUid: uid,
        email: email || '',
        name: name || email.split('@')[0],
        avatar: picture || '',
      });
      await user.save();
    } else {
      // Optional: Update avatar if it changed in Firebase
      if (picture && !user.avatar) {
        user.avatar = picture;
        await user.save();
      }
    }

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isPremium: user.isPremium,
    };

    res.status(200).json({ success: true, user: userData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  try {
    // Whitelist allowed fields — NEVER allow role, isPremium, email, firebaseUid updates
    const allowedFields = ['name', 'avatar', 'preferences'];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Validate name is not empty if provided
    if (updates.name !== undefined && (!updates.name || typeof updates.name !== 'string' || updates.name.trim().length === 0)) {
      return res.status(400).json({ success: false, message: 'Name cannot be empty' });
    }
    if (updates.name) updates.name = updates.name.trim().slice(0, 100); // Limit name length

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

