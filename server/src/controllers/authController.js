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
    const updates = ['name', 'avatar', 'preferences'].reduce((acc, key) => {
      if (req.body[key] !== undefined) acc[key] = req.body[key];
      return acc;
    }, {});
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

