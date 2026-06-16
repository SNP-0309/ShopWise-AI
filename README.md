# ShopWise AI 🛍️✨

> **India's smartest AI-powered Shopping Aggregator** — Compare prices across Amazon, Flipkart, Croma & 7+ stores with AI-powered recommendations, review summaries, and price alerts.

![ShopWise AI](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop)

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 AI Natural Language Search | "gaming laptop under ₹70k for coding" |
| 🏪 Multi-Store Aggregation | Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales, Myntra, Ajio |
| 💡 AI Recommendations | Best price, best rating, fastest delivery — AI picks the winner |
| 📊 Price History Chart | 30-day price trend with Recharts |
| 🔔 Price Drop Alerts | Set target price, get notified when it drops |
| 📝 AI Review Summarizer | Pros, cons & verdict from thousands of reviews |
| 🤖 AI Shopping Agent | Budget planner for multiple products |
| 💬 Floating AI Chatbot | Groq-powered assistant on every page |
| ❤️ Smart Wishlist | Save products, get AI tips |
| 🌙 Dark / Light Mode | Glassmorphism premium UI |

## 🛠️ Tech Stack

**Frontend:** React + Vite + Tailwind CSS + SCSS + Framer Motion + React Router + Axios + Recharts + Zustand

**Backend:** Node.js + Express.js + MongoDB + Mongoose + Redis (ioredis) + Socket.io

**AI:** Gemini API (search parsing, recommendations, review summaries) + Groq API (chatbot)

**Auth:** JWT + Google OAuth

**Payments:** Razorpay (premium subscriptions — placeholder)

**Storage:** Cloudinary

## 📁 Project Structure

```
ShopWise-AI/
├── client/          # React + Vite Frontend
│   └── src/
│       ├── components/   # Navbar, ProductCard, AIChat, Skeleton...
│       ├── pages/        # Home, Search, ProductDetail, Compare, Wishlist
│       ├── context/      # ThemeContext, AuthContext
│       └── services/     # API layer (Axios)
│
└── server/          # Node.js + Express Backend
    └── src/
        ├── models/       # User, Alert, Wishlist, PriceHistory...
        ├── controllers/  # auth, products, ai, users
        ├── routes/       # /api/auth, /api/products, /api/ai, /api/users
        └── services/     # Gemini AI, Groq AI, Cache, Marketplace connectors
```

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 2. Configure Environment

```bash
# Copy and fill in your API keys
cp server/.env.example server/.env
```

Required keys:
- `MONGODB_URI` — MongoDB Atlas connection string
- `GEMINI_API_KEY` — [Google AI Studio](https://aistudio.google.com/)
- `GROQ_API_KEY` — [Groq Console](https://console.groq.com/)
- `JWT_SECRET` — Any random long string

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔑 API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login with JWT |
| `GET` | `/api/products/search?q=...` | AI-powered product search |
| `GET` | `/api/products/:id` | Product detail + AI summary |
| `GET` | `/api/products/trending` | Trending products |
| `GET` | `/api/products/featured` | Featured deals |
| `POST` | `/api/ai/chat` | AI chatbot (Groq) |
| `POST` | `/api/ai/compare` | AI product comparison |
| `POST` | `/api/ai/agent` | AI shopping agent |
| `GET` | `/api/users/wishlist` | User's wishlist |
| `POST` | `/api/users/alerts` | Set price alert |

## 🎨 Design System

- **Colors:** Deep Indigo `#6C63FF` + Electric Violet + Cyan accents
- **Typography:** Inter (body) + Sora (headings)
- **Glassmorphism:** `backdrop-filter: blur(20px)` + semi-transparent cards
- **Dark Mode:** CSS variables with `[data-theme="dark"]` selector
- **Animations:** Framer Motion with stagger, page transitions, card hover

---

Made with ❤️ for smart Indian shoppers | ShopWise AI © 2026 | Under Production | Deployed soon 
