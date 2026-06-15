const Groq = require('groq-sdk');

let groqClient = null;

const getGroq = () => {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

const SYSTEM_PROMPT = `You are ShopWise AI, a friendly and knowledgeable shopping assistant for India's leading product comparison platform. You help users:
- Find the best products within their budget
- Compare products across Amazon, Flipkart, Croma, Reliance Digital, and more
- Understand product specifications
- Find alternatives and deals
- Create shopping lists

Keep responses concise, helpful, and use ₹ for prices. Format product recommendations clearly.`;

/**
 * Chat with Groq (fast inference for chatbot)
 */
const chat = async (messages, context = '') => {
  try {
    const groq = getGroq();
    if (!groq) {
      return "I'm ShopWise AI! Please configure the GROQ_API_KEY to enable AI chat. I can help you find the best products and deals across all major Indian stores.";
    }

    const systemMessage = context
      ? `${SYSTEM_PROMPT}\n\nContext: ${context}`
      : SYSTEM_PROMPT;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.';
  } catch (err) {
    console.error('Groq chat error:', err.message);
    return 'I encountered an error. Please check your API configuration and try again.';
  }
};

/**
 * Generate product suggestions from chat
 */
const suggestProducts = async (userMessage) => {
  try {
    const groq = getGroq();
    if (!groq) return null;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Extract product search terms from user messages. Respond with JSON only: {"searchTerms": ["term1"], "budget": number|null, "category": "string|null"}',
        },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 256,
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (err) {
    return null;
  }
};

module.exports = { chat, suggestProducts };
