const { searchProducts, getProductById, getTrendingProducts, getFeaturedDeals } = require('../services/marketplace/mockData');
const { parseSearchQuery, generateRecommendation, summarizeReviews } = require('../services/ai/gemini');
const { cacheGet, cacheSet, TTL } = require('../services/cache/cacheService');
const SearchHistory = require('../models/SearchHistory');
const PriceHistory = require('../models/PriceHistory');
const crypto = require('crypto');

exports.search = async (req, res) => {
  try {
    const { q, maxBudget, store, rating, sort = 'relevance', page = 1 } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query is required' });

    const cacheKey = `search:${crypto.createHash('md5').update(JSON.stringify({ q, maxBudget, store, rating })).digest('hex')}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    // Parse query with AI
    const aiParsed = await parseSearchQuery(q);
    const budget = maxBudget || aiParsed.budget;

    // Search products
    const { products, total, category, stores } = await searchProducts(q, {
      maxBudget: budget ? parseInt(budget) : null,
      store,
      rating: rating ? parseFloat(rating) : null,
    });

    // Generate AI recommendation
    const recommendation = products.length > 0 ? await generateRecommendation(products, q) : null;

    // Save search history (async, non-blocking)
    if (req.user) {
      SearchHistory.create({
        user: req.user.id,
        query: q,
        aiParsed,
        resultsCount: total,
      }).catch(() => {});
    }

    const result = {
      success: true,
      query: q,
      aiParsed,
      products,
      recommendation,
      total,
      category,
      stores,
      page: parseInt(page),
    };

    await cacheSet(cacheKey, result, TTL.SEARCH);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const product = await getProductById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Get AI review summary
    const reviewSummary = await summarizeReviews(product.name, product.rating, product.reviewCount);

    // Get or generate price history
    let priceHistory = null;
    try {
      priceHistory = await PriceHistory.findOne({ productId: id });
    } catch (dbErr) {
      console.warn('⚠️ MongoDB not available for PriceHistory, generating mock.');
    }
    if (!priceHistory) {
      const bestPrice = Math.min(...product.storeListings.map((l) => l.price));
      priceHistory = {
        currentPrice: bestPrice,
        lowestPrice: Math.round(bestPrice * 0.85),
        highestPrice: Math.round(bestPrice * 1.2),
        averagePrice: Math.round(bestPrice * 0.95),
        prices: generateMockPriceHistory(bestPrice),
      };
    }

    const result = { success: true, product, reviewSummary, priceHistory };
    await cacheSet(cacheKey, result, TTL.PRODUCT);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const cacheKey = 'trending:products';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const products = await getTrendingProducts();
    const result = { success: true, products };
    await cacheSet(cacheKey, result, TTL.TRENDING);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const cacheKey = 'homepage:deals';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const deals = await getFeaturedDeals();
    const result = { success: true, deals };
    await cacheSet(cacheKey, result, TTL.HOMEPAGE);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSuggestions = async (req, res) => {
  const { q } = req.query;
  const suggestions = [
    'gaming laptop under 70000',
    'best phone under 30000',
    'wireless headphones',
    'samsung 4k tv',
    'iphone 15 pro',
    'macbook air m3',
    'oneplus 12r',
    'sony wh-1000xm5',
    'hp pavilion gaming',
    'asus rog',
  ].filter((s) => s.includes(q?.toLowerCase() || ''));
  res.json({ success: true, suggestions: suggestions.slice(0, 8) });
};

function generateMockPriceHistory(currentPrice) {
  const history = [];
  const now = Date.now();
  for (let i = 30; i >= 0; i--) {
    const variance = (Math.random() - 0.4) * 0.15;
    history.push({
      price: Math.round(currentPrice * (1 + variance)),
      recordedAt: new Date(now - i * 24 * 60 * 60 * 1000),
    });
  }
  return history;
}
