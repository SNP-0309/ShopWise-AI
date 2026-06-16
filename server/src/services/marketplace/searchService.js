/**
 * Search Service Coordinator
 * Routes search queries to SerpAPI when available, or falls back to mockData.js
 */

const { cacheGet, cacheSet } = require('../cache/cacheService');
const { searchProductsViaSerp } = require('./serpService');
const mockData = require('./mockData');

const searchProducts = async (query, filters = {}) => {
  if (process.env.SERPAPI_KEY) {
    try {
      console.log(`🔍 Searching via SerpAPI for: "${query}"`);
      const results = await searchProductsViaSerp(query, filters);
      
      // If we got products, return them
      if (results.products && results.products.length > 0) {
        return results;
      }
      console.log('⚠️ SerpAPI returned 0 results. Falling back to mock data.');
    } catch (err) {
      console.error('❌ SerpAPI failed:', err.message);
      console.log('🔄 Falling back to mock data.');
    }
  } else {
    console.log('ℹ️ No SERPAPI_KEY set. Using mock data.');
  }

  // Fallback to mock data search
  return mockData.searchProducts(query, filters);
};

const getProductById = async (id) => {
  // If the product is mock, fetch from mockData
  if (!id.startsWith('serp_')) {
    return mockData.getProductById(id);
  }

  // Attempt to load raw product details from Redis cache (populated during search)
  try {
    const cachedProduct = await cacheGet(`rawproduct:${id}`);
    if (cachedProduct) {
      return cachedProduct;
    }
  } catch (err) {
    console.error('Failed to get product from Redis cache:', err.message);
  }

  // In case of cache miss (e.g. direct load, refresh), return null (or generate placeholder)
  console.log(`ℹ️ Cache miss for SerpAPI product ID: ${id}.`);
  return null;
};

const getTrendingProducts = async () => {
  if (process.env.SERPAPI_KEY) {
    try {
      const cached = await cacheGet('serp:trending');
      if (cached) return cached;
      const results = await searchProductsViaSerp('trending electronics');
      if (results.products && results.products.length > 0) {
        const products = results.products.slice(0, 8);
        await cacheSet('serp:trending', products, 43200);
        return products;
      }
    } catch (err) {
      console.error('Failed to fetch trending via SerpAPI:', err.message);
    }
  }
  return mockData.getTrendingProducts();
};

const getFeaturedDeals = async () => {
  if (process.env.SERPAPI_KEY) {
    try {
      const cached = await cacheGet('serp:featured');
      if (cached) return cached;
      const results = await searchProductsViaSerp('electronics');
      if (results.products && results.products.length > 0) {
        const products = results.products.map(p => ({
          ...p,
          bestListing: p.storeListings.reduce((a, b) => (a.price < b.price ? a : b)),
        })).slice(0, 6);
        await cacheSet('serp:featured', products, 43200);
        return products;
      }
    } catch (err) {
      console.error('Failed to fetch featured via SerpAPI:', err.message);
    }
  }
  return mockData.getFeaturedDeals();
};

module.exports = {
  searchProducts,
  getProductById,
  getTrendingProducts,
  getFeaturedDeals,
  stores: mockData.stores
};
