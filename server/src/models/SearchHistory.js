const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  query: { type: String, required: true },
  aiParsed: {
    category: String,
    budget: Number,
    usage: String,
    brands: [String],
    features: [String],
  },
  resultsCount: Number,
  sessionId: String,
  ip: String,
}, { timestamps: true });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
