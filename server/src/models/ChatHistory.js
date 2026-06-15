const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: String,
    products: [mongoose.Schema.Types.Mixed],
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
