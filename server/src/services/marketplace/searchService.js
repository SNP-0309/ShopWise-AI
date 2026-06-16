/**
 * Search Service Coordinator
 * Routes search queries to SerpAPI when available, or falls back to mockData.js
 */

const { cacheGet } = require('../cache/cacheService');
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
  return mockData.getTrendingProducts();
};

const getFeaturedDeals = async () => {
  return mockData.getFeaturedDeals();
};

module.exports = {
  searchProducts,
  getProductById,
  getTrendingProducts,
  getFeaturedDeals,
  stores: mockData.stores
};
