const { searchProducts, getProductById, getTrendingProducts, getFeaturedDeals } = require('../services/marketplace/searchService');
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

    // Cache individual products to ensure details lookup succeeds
    if (products && products.length > 0) {
      for (const product of products) {
        // Cache the raw product representation
        await cacheSet(`rawproduct:${product.id}`, product, TTL.PRODUCT);
      }
    }

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
  if (!q || q.trim().length < 2) {
    return res.json({ success: true, suggestions: [] });
  }

  // Try SerpAPI Google Autocomplete for dynamic, real suggestions
  if (process.env.SERPAPI_KEY) {
    try {
      const url = `https://serpapi.com/search.json?engine=google_autocomplete&q=${encodeURIComponent(q)}&api_key=${process.env.SERPAPI_KEY}&gl=in&hl=en`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const suggestions = (data.suggestions || [])
          .map(s => s.value)
          .filter(s => s && s.toLowerCase().includes('buy') === false) // remove "buy X" suggestions
          .slice(0, 8);
        if (suggestions.length > 0) {
          return res.json({ success: true, suggestions });
        }
      }
    } catch (err) {
      console.warn('SerpAPI autocomplete failed:', err.message);
    }
  }

  // Fallback: filter from a richer hardcoded list
  const fallbackSuggestions = [
    'gaming laptop under 70000',
    'gaming laptop under 50000',
    'best laptop for college students',
    'best phone under 30000',
    'best phone under 20000',
    'best phone under 15000',
    'wireless headphones noise cancelling',
    'bluetooth earbuds under 2000',
    'samsung 4k tv 55 inch',
    'iphone 15 pro max',
    'iphone 15 pro',
    'iphone 14',
    'macbook air m3',
    'macbook pro m3',
    'oneplus 12r',
    'oneplus 12',
    'oneplus nord',
    'sony wh-1000xm5',
    'sony wh-1000xm4',
    'hp pavilion gaming',
    'hp laptop under 50000',
    'asus rog strix',
    'asus vivobook',
    'dell xps 15',
    'lenovo thinkpad',
    'realme narzo 70 pro',
    'redmi note 13 pro',
    'samsung galaxy s24 ultra',
    'samsung galaxy s23',
    'google pixel 8',
    'smartwatch under 5000',
    'smartwatch under 10000',
    'mi band 8',
    'logitech mx master',
    'mechanical keyboard',
    'gaming mouse',
    '4k monitor',
    'air purifier',
    'robot vacuum cleaner',
    'air fryer under 3000',
  ].filter(s => s.toLowerCase().includes(q.toLowerCase()));

  res.json({ success: true, suggestions: fallbackSuggestions.slice(0, 8) });
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
