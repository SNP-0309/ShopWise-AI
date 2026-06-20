/**
 * Rich mock marketplace data for ShopWise AI
 * Simulates real API responses from Amazon, Flipkart, Croma, etc.
 */

const stores = {
  amazon: { name: 'Amazon', logo: '🛒', color: '#FF9900', reliable: true },
  flipkart: { name: 'Flipkart', logo: '🛍️', color: '#2874F0', reliable: true },
  croma: { name: 'Croma', logo: '🏪', color: '#00A550', reliable: true },
  relianceDigital: { name: 'Reliance Digital', logo: '📱', color: '#E31837', reliable: true },
  vijaySales: { name: 'Vijay Sales', logo: '🏬', color: '#1A237E', reliable: true },
  myntra: { name: 'Myntra', logo: '👗', color: '#FF3F6C', reliable: false },
  ajio: { name: 'Ajio', logo: '👔', color: '#E64A19', reliable: false },
};

const productTemplates = {
  laptop: [
    {
      id: 'lap001',
      name: 'ASUS ROG Strix G15 Gaming Laptop',
      brand: 'ASUS',
      category: 'laptop',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
      ],
      specs: {
        processor: 'AMD Ryzen 9 7945HX',
        ram: '16GB DDR5',
        storage: '1TB NVMe SSD',
        display: '15.6" FHD 144Hz',
        gpu: 'NVIDIA RTX 4070',
        battery: '90Wh',
        weight: '2.3kg',
        os: 'Windows 11',
      },
      rating: 4.5,
      reviewCount: 2847,
      tags: ['gaming', 'coding', 'video editing'],
      storeListings: [
        { store: 'amazon', price: 128990, originalPrice: 149990, discount: 14, delivery: '2 days', inStock: true, url: '#' },
        { store: 'flipkart', price: 126999, originalPrice: 149990, discount: 15, delivery: '3 days', inStock: true, url: '#' },
        { store: 'croma', price: 132000, originalPrice: 149990, discount: 12, delivery: '1 day', inStock: true, url: '#' },
        { store: 'relianceDigital', price: 130000, originalPrice: 149990, discount: 13, delivery: '2 days', inStock: false, url: '#' },
        { store: 'vijaySales', price: 129500, originalPrice: 149990, discount: 14, delivery: '4 days', inStock: true, url: '#' },
      ],
    },
    {
      id: 'lap002',
      name: 'MacBook Air M3 13-inch',
      brand: 'Apple',
      category: 'laptop',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80'
      ],
      specs: {
        processor: 'Apple M3',
        ram: '16GB Unified',
        storage: '512GB SSD',
        display: '13.6" Liquid Retina',
        gpu: 'Apple M3 GPU (10-core)',
        battery: '15 hrs',
        weight: '1.24kg',
        os: 'macOS Sonoma',
      },
      rating: 4.8,
      reviewCount: 5621,
      tags: ['coding', 'design', 'lightweight'],
      storeListings: [
        { store: 'amazon', price: 114900, originalPrice: 119900, discount: 4, delivery: '1 day', inStock: true, url: '#' },
        { store: 'flipkart', price: 113999, originalPrice: 119900, discount: 5, delivery: '2 days', inStock: true, url: '#' },
        { store: 'croma', price: 116000, originalPrice: 119900, discount: 3, delivery: '1 day', inStock: true, url: '#' },
        { store: 'relianceDigital', price: 115000, originalPrice: 119900, discount: 4, delivery: '3 days', inStock: true, url: '#' },
      ],
    },
    {
      id: 'lap003',
      name: 'HP Pavilion Gaming Laptop 15',
      brand: 'HP',
      category: 'laptop',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
      images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'],
      specs: {
        processor: 'Intel Core i7-13700H',
        ram: '16GB DDR4',
        storage: '512GB SSD',
        display: '15.6" FHD 144Hz',
        gpu: 'NVIDIA RTX 3060',
        battery: '52.5Wh',
        weight: '2.15kg',
        os: 'Windows 11',
      },
      rating: 4.2,
      reviewCount: 1893,
      tags: ['gaming', 'budget', 'college'],
      storeListings: [
        { store: 'amazon', price: 67990, originalPrice: 85990, discount: 21, delivery: '2 days', inStock: true, url: '#' },
        { store: 'flipkart', price: 65999, originalPrice: 85990, discount: 23, delivery: '3 days', inStock: true, url: '#' },
        { store: 'croma', price: 69000, originalPrice: 85990, discount: 20, delivery: '2 days', inStock: true, url: '#' },
        { store: 'vijaySales', price: 66500, originalPrice: 85990, discount: 23, delivery: '5 days', inStock: true, url: '#' },
      ],
    },
  ],
  phone: [
    {
      id: 'phn001',
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      category: 'phone',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80'
      ],
      specs: {
        processor: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '256GB',
        display: '6.8" QHD+ AMOLED',
        camera: '200MP + 50MP + 10MP',
        battery: '5000mAh',
        charging: '45W Fast Charging',
        os: 'Android 14',
      },
      rating: 4.6,
      reviewCount: 8342,
      tags: ['flagship', 'camera', 'stylus', 'ai'],
      storeListings: [
        { store: 'amazon', price: 129999, originalPrice: 134999, discount: 4, delivery: '1 day', inStock: true, url: '#' },
        { store: 'flipkart', price: 127999, originalPrice: 134999, discount: 5, delivery: '2 days', inStock: true, url: '#' },
        { store: 'relianceDigital', price: 131000, originalPrice: 134999, discount: 3, delivery: '1 day', inStock: true, url: '#' },
        { store: 'croma', price: 132000, originalPrice: 134999, discount: 2, delivery: '1 day', inStock: false, url: '#' },
      ],
    },
    {
      id: 'phn002',
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      category: 'phone',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1695048133144-ad2cf685e135?auto=format&fit=crop&w=1000&q=80'
      ],
      specs: {
        processor: 'Apple A17 Pro',
        ram: '8GB',
        storage: '256GB',
        display: '6.1" Super Retina XDR',
        camera: '48MP + 12MP + 12MP',
        battery: '3274mAh',
        charging: '27W Fast Charging',
        os: 'iOS 17',
      },
      rating: 4.7,
      reviewCount: 12456,
      tags: ['flagship', 'ios', 'camera', 'titanium'],
      storeListings: [
        { store: 'amazon', price: 109900, originalPrice: 134900, discount: 19, delivery: '1 day', inStock: true, url: '#' },
        { store: 'flipkart', price: 107999, originalPrice: 134900, discount: 20, delivery: '2 days', inStock: true, url: '#' },
        { store: 'relianceDigital', price: 111000, originalPrice: 134900, discount: 18, delivery: '1 day', inStock: true, url: '#' },
        { store: 'croma', price: 110000, originalPrice: 134900, discount: 18, delivery: '2 days', inStock: true, url: '#' },
      ],
    },
    {
      id: 'phn003',
      name: 'OnePlus 12R',
      brand: 'OnePlus',
      category: 'phone',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80'],
      specs: {
        processor: 'Snapdragon 8 Gen 2',
        ram: '16GB',
        storage: '256GB',
        display: '6.78" AMOLED 120Hz',
        camera: '50MP + 8MP + 2MP',
        battery: '5400mAh',
        charging: '100W SuperVOOC',
        os: 'OxygenOS 14',
      },
      rating: 4.4,
      reviewCount: 4231,
      tags: ['gaming', 'fast charging', 'value'],
      storeListings: [
        { store: 'amazon', price: 39999, originalPrice: 49999, discount: 20, delivery: '1 day', inStock: true, url: '#' },
        { store: 'flipkart', price: 38999, originalPrice: 49999, discount: 22, delivery: '2 days', inStock: true, url: '#' },
        { store: 'relianceDigital', price: 41000, originalPrice: 49999, discount: 18, delivery: '3 days', inStock: true, url: '#' },
      ],
    },
  ],
  headphones: [
    {
      id: 'hp001',
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      category: 'headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80'
      ],
      specs: {
        type: 'Over-ear',
        noiseCancel: 'Industry-best ANC',
        battery: '30 hours',
        charging: 'USB-C, 3 min = 3 hrs',
        connectivity: 'Bluetooth 5.2, Multipoint',
        codec: 'LDAC, SBC, AAC',
        weight: '250g',
        mic: 'Precise Voice Pickup',
      },
      rating: 4.7,
      reviewCount: 6821,
      tags: ['anc', 'music', 'travel', 'wfh'],
      storeListings: [
        { store: 'amazon', price: 24990, originalPrice: 34990, discount: 29, delivery: '1 day', inStock: true, url: '#' },
        { store: 'flipkart', price: 23999, originalPrice: 34990, discount: 31, delivery: '2 days', inStock: true, url: '#' },
        { store: 'croma', price: 25990, originalPrice: 34990, discount: 26, delivery: '1 day', inStock: true, url: '#' },
        { store: 'relianceDigital', price: 25500, originalPrice: 34990, discount: 27, delivery: '2 days', inStock: true, url: '#' },
      ],
    },
  ],
  tv: [
    {
      id: 'tv001',
      name: 'Samsung 55" 4K QLED Smart TV',
      brand: 'Samsung',
      category: 'tv',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80',
      images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80'],
      specs: {
        display: '55" QLED',
        resolution: '4K UHD',
        refreshRate: '120Hz',
        hdr: 'Quantum HDR 1500',
        os: 'Tizen',
        connectivity: 'HDMI 2.1, USB, WiFi 5',
        dolby: 'Dolby Atmos',
        voiceAssistant: 'Alexa, Bixby',
      },
      rating: 4.5,
      reviewCount: 3214,
      tags: ['4k', 'smart tv', 'gaming', 'movies'],
      storeListings: [
        { store: 'amazon', price: 72990, originalPrice: 99000, discount: 26, delivery: '3 days', inStock: true, url: '#' },
        { store: 'flipkart', price: 69999, originalPrice: 99000, discount: 29, delivery: '4 days', inStock: true, url: '#' },
        { store: 'croma', price: 74990, originalPrice: 99000, discount: 24, delivery: '2 days', inStock: true, url: '#' },
        { store: 'relianceDigital', price: 73000, originalPrice: 99000, discount: 26, delivery: '2 days', inStock: false, url: '#' },
        { store: 'vijaySales', price: 71500, originalPrice: 99000, discount: 28, delivery: '5 days', inStock: true, url: '#' },
      ],
    },
  ],
  mouse: [
    {
      id: 'ms001',
      name: 'Logitech MX Master 3S',
      brand: 'Logitech',
      category: 'mouse',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
      images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80'],
      specs: {
        dpi: '8000 DPI',
        buttons: '7 Customizable',
        scrollWheel: 'MagSpeed Electromagnetic',
        battery: '70 days',
        connectivity: 'Bluetooth, USB-A Receiver',
        compatibility: 'Windows, Mac, Linux',
        weight: '141g',
      },
      rating: 4.8,
      reviewCount: 9543,
      tags: ['productivity', 'ergonomic', 'wireless', 'wfh'],
      storeListings: [
        { store: 'amazon', price: 8495, originalPrice: 10995, discount: 23, delivery: '1 day', inStock: true, url: '#' },
        { store: 'flipkart', price: 7999, originalPrice: 10995, discount: 27, delivery: '2 days', inStock: true, url: '#' },
      ],
    },
  ],
};

// Keywords to category mapping
const categoryMap = {
  laptop: ['laptop', 'notebooks', 'macbook', 'chromebook', 'ultrabook'],
  phone: ['phone', 'smartphone', 'iphone', 'mobile', 'android', 'samsung', 'oneplus', 'realme', 'redmi'],
  headphones: ['headphone', 'earphone', 'earbuds', 'airpods', 'headset', 'speaker'],
  tv: ['tv', 'television', 'smart tv', 'led', 'oled', 'qled'],
  mouse: ['mouse', 'mice', 'trackpad'],
};

/**
 * Search products across all mock stores
 */
const searchProducts = async (query, filters = {}) => {
  const queryLower = query.toLowerCase();

  // Determine category from query
  let matchedCategory = null;
  for (const [cat, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((k) => queryLower.includes(k))) {
      matchedCategory = cat;
      break;
    }
  }

  // Collect all products
  let allProducts = matchedCategory
    ? productTemplates[matchedCategory] || []
    : Object.values(productTemplates).flat();

  // Apply budget filter
  if (filters.maxBudget) {
    allProducts = allProducts.filter((p) =>
      p.storeListings.some((l) => l.price <= filters.maxBudget)
    );
  }

  // Simulate API delay
  await new Promise((r) => setTimeout(r, 100));

  return {
    products: allProducts,
    total: allProducts.length,
    category: matchedCategory,
    stores: Object.values(stores),
  };
};

const getProductById = async (id) => {
  const all = Object.values(productTemplates).flat();
  return all.find((p) => p.id === id) || null;
};

const getTrendingProducts = async () => {
  const trending = [
    ...productTemplates.phone.slice(0, 2),
    ...productTemplates.laptop.slice(0, 2),
    ...productTemplates.headphones,
  ];
  return trending;
};

const getFeaturedDeals = async () => {
  const all = Object.values(productTemplates).flat();
  return all
    .map((p) => ({
      ...p,
      bestListing: p.storeListings.reduce((a, b) => (a.price < b.price ? a : b)),
    }))
    .filter((p) => p.bestListing.discount > 15)
    .slice(0, 6);
};

module.exports = { searchProducts, getProductById, getTrendingProducts, getFeaturedDeals, stores };
