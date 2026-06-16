const { chat } = require('../services/ai/groq');
const { compareProducts, shoppingAgent } = require('../services/ai/gemini');
const { cacheGet, cacheSet, TTL } = require('../services/cache/cacheService');
const ChatHistory = require('../models/ChatHistory');
const crypto = require('crypto');

// Input validation limits
const MAX_MESSAGE_COUNT = 20;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_QUERY_LENGTH = 500;

exports.chatWithAI = async (req, res) => {
  try {
    const { messages, sessionId } = req.body;
    if (!messages || !Array.isArray(messages))
      return res.status(400).json({ success: false, message: 'Messages array required' });

    // Validate message count and content length
    if (messages.length > MAX_MESSAGE_COUNT)
      return res.status(400).json({ success: false, message: `Maximum ${MAX_MESSAGE_COUNT} messages allowed` });

    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string')
        return res.status(400).json({ success: false, message: 'Each message must have a role and content string' });
      if (msg.content.length > MAX_MESSAGE_LENGTH)
        return res.status(400).json({ success: false, message: `Message content must be under ${MAX_MESSAGE_LENGTH} characters` });
    }

    const response = await chat(messages);

    // Save chat history async
    if (sessionId) {
      ChatHistory.findOneAndUpdate(
        { sessionId },
        {
          $set: { user: req.user?.id },
          $push: {
            messages: {
              $each: [
                ...messages.slice(-1),
                { role: 'assistant', content: response },
              ],
            },
          },
        },
        { upsert: true, new: true }
      ).catch(() => {});
    }

    res.json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.compareProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || products.length < 2)
      return res.status(400).json({ success: false, message: 'At least 2 products required' });

    if (products.length > 5)
      return res.status(400).json({ success: false, message: 'Maximum 5 products for comparison' });

    const cacheKey = `ai:compare:${crypto.createHash('md5').update(JSON.stringify(products.map((p) => p.id))).digest('hex')}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const comparison = await compareProducts(products);
    const result = { success: true, comparison };
    await cacheSet(cacheKey, result, TTL.AI_RESPONSE);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.shoppingAgent = async (req, res) => {
  try {
    const { query, budget } = req.body;
    if (!query || !budget)
      return res.status(400).json({ success: false, message: 'Query and budget required' });
    if (typeof query !== 'string' || query.length > MAX_QUERY_LENGTH)
      return res.status(400).json({ success: false, message: `Query must be under ${MAX_QUERY_LENGTH} characters` });
    if (typeof budget !== 'number' && typeof budget !== 'string')
      return res.status(400).json({ success: false, message: 'Budget must be a number' });

    const plan = await shoppingAgent(query, budget);
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
