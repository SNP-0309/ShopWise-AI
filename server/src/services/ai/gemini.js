const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGemini = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

/**
 * Parse natural language search query into structured filters
 */
const parseSearchQuery = async (query) => {
  const fallback = { category: null, budget: null, usage: null, brands: [], features: [], originalQuery: query };
  
  try {
    const ai = getGemini();
    if (!ai) return fallback;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = `
You are a shopping assistant. Parse this search query and extract structured information.
Query: "${query}"

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "category": "laptop|phone|headphones|tv|tablet|smartwatch|mouse|keyboard|other",
  "budget": <number in INR or null>,
  "usage": "<primary use case>",
  "brands": ["<brand names>"],
  "features": ["<key features>"],
  "keywords": ["<search keywords>"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return { ...JSON.parse(cleaned), originalQuery: query };
  } catch (err) {
    console.error('Gemini parse error:', err.message);
    return fallback;
  }
};

/**
 * Generate AI recommendation comparing stores
 */
const generateRecommendation = async (products, query) => {
  const fallback = {
    bestPrice: null,
    bestRating: null,
    fastestDelivery: null,
    recommended: null,
    summary: 'Compare the options below to find the best deal for your needs.',
    topPick: null,
  };

  try {
    const ai = getGemini();
    if (!ai) return fallback;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    const productSummary = products.slice(0, 3).map((p) => ({
      name: p.name,
      brand: p.brand,
      rating: p.rating,
      reviews: p.reviewCount,
      bestPrice: Math.min(...p.storeListings.map((l) => l.price)),
      bestStore: p.storeListings.reduce((a, b) => (a.price < b.price ? a : b)).store,
      fastestDelivery: p.storeListings.sort((a, b) => a.delivery.localeCompare(b.delivery))[0]?.store,
    }));

    const prompt = `
You are ShopWise AI, a smart shopping assistant. 
User searched for: "${query}"
Here are the top products found:
${JSON.stringify(productSummary, null, 2)}

Generate a helpful shopping recommendation. Respond ONLY with valid JSON:
{
  "bestPrice": { "store": "store_name", "product": "product name", "reason": "reason" },
  "bestRating": { "store": "store_name", "product": "product name", "reason": "reason" },
  "fastestDelivery": { "store": "store_name", "reason": "reason" },
  "recommended": { "product": "product name", "store": "store_name", "reason": "short reason" },
  "summary": "2-3 sentence AI summary for the user",
  "topPick": "product id or name"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini recommend error:', err.message);
    return fallback;
  }
};

/**
 * Summarize product reviews
 */
const summarizeReviews = async (productName, rating, reviewCount) => {
  const fallback = {
    pros: ['Good build quality', 'Value for money', 'Reliable performance'],
    cons: ['Could be lighter', 'Average battery life'],
    verdict: `${productName} is a solid choice in its segment with ${rating}/5 rating from ${reviewCount}+ users.`,
    score: rating,
  };

  try {
    const ai = getGemini();
    if (!ai) return fallback;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = `
You are a review analyst. Generate a realistic review summary for: "${productName}"
Rating: ${rating}/5, Review Count: ${reviewCount}

Respond ONLY with valid JSON:
{
  "pros": ["pro1", "pro2", "pro3", "pro4"],
  "cons": ["con1", "con2", "con3"],
  "verdict": "2-3 sentence overall verdict",
  "score": ${rating}
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return fallback;
  }
};

/**
 * Compare multiple products using AI
 */
const compareProducts = async (products) => {
  try {
    const ai = getGemini();
    if (!ai) {
      return { summary: 'Enable Gemini API for AI-powered comparison.', winner: products[0]?.name };
    }

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = `
Compare these products for a user in India:
${products.map((p) => `- ${p.name}: ₹${Math.min(...p.storeListings.map((l) => l.price))}, Rating: ${p.rating}`).join('\n')}

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence comparison",
  "winner": "product name that offers best value",
  "winnerReason": "reason",
  "scorecard": {
    "product_name": { "value": 9, "performance": 8, "design": 9, "overall": 9 }
  }
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (err) {
    return { summary: 'Compare the specs manually below.', winner: products[0]?.name };
  }
};

/**
 * AI Shopping Agent - create a full shopping list within budget
 */
const shoppingAgent = async (query, budget) => {
  try {
    const ai = getGemini();
    if (!ai) {
      return {
        plan: `Here's a suggested shopping plan for ₹${budget}: Focus on essential items first.`,
        items: [],
        totalEstimate: budget,
      };
    }

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = `
You are ShopWise AI shopping agent. A user says: "${query}"
Budget: ₹${budget}

Create a smart shopping list. Respond ONLY with valid JSON:
{
  "plan": "2-3 sentence plan",
  "items": [
    { "category": "laptop", "budget": 65000, "recommendation": "HP Pavilion or ASUS VivoBook" },
    { "category": "mouse", "budget": 2000, "recommendation": "Logitech M235" },
    { "category": "headphones", "budget": 3000, "recommendation": "Sony WH-CH520" }
  ],
  "totalEstimate": 70000,
  "savings": "You'll save ₹X compared to buying individual items"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (err) {
    return { plan: 'Here is a suggested budget allocation plan.', items: [], totalEstimate: budget };
  }
};

module.exports = { parseSearchQuery, generateRecommendation, summarizeReviews, compareProducts, shoppingAgent };
