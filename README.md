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

**AI & Data:** Gemini API (search parsing, recommendations, review summaries) + Groq API (chatbot) + SerpAPI (Google Shopping real-time aggregation)

**Auth:** Firebase Authentication (Google, Email/Password) + JWT token verification

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
- `SERPAPI_KEY` — [SerpAPI Console](https://serpapi.com/) (real-time Google Shopping aggregation)
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
| `POST` | `/api/auth/sync` | Sync Firebase user with MongoDB |
| `GET` | `/api/auth/me` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update user profile |
| `GET` | `/api/products/search?q=...` | AI-powered product search |
| `GET` | `/api/products/:id` | Product detail + AI summary |
| `GET` | `/api/products/trending` | Trending products |
| `GET` | `/api/products/featured` | Featured deals |
| `GET` | `/api/products/suggestions?q=...` | Search autocomplete |
| `POST` | `/api/ai/chat` | AI chatbot (Groq) |
| `POST` | `/api/ai/compare` | AI product comparison |
| `POST` | `/api/ai/agent` | AI shopping agent |
| `GET` | `/api/users/wishlist` | User's wishlist |
| `POST` | `/api/users/wishlist` | Add to wishlist |
| `DELETE` | `/api/users/wishlist/:productId` | Remove from wishlist |
| `GET` | `/api/users/alerts` | Get price alerts |
| `POST` | `/api/users/alerts` | Set price alert |
| `DELETE` | `/api/users/alerts/:id` | Delete price alert |
| `GET` | `/api/users/notifications` | Get notifications |
| `GET` | `/api/users/search-history` | Get search history |
| `GET` | `/api/health` | Server health check |

## 🎨 Design System

- **Colors:** Deep Indigo `#6C63FF` + Electric Violet + Cyan accents
- **Typography:** Inter (body) + Sora (headings)
- **Glassmorphism:** `backdrop-filter: blur(20px)` + semi-transparent cards
- **Dark Mode:** CSS variables with `[data-theme="dark"]` selector
- **Animations:** Framer Motion with stagger, page transitions, card hover

---

Made with ❤️ for smart Indian shoppers | ShopWise AI © 2026 | Under Production | Deployed 
Viewed app.js:128-149

Here is the step-by-step process to build **ShopWise-AI** from scratch manually. 

This project is structured as a **monorepo** containing two main parts:
1. **`/server`**: A Node.js + Express.js backend API that handles database interactions, real-time WebSockets (Socket.io), and integrations with external APIs (SerpAPI, Gemini, Groq, Firebase).
2. **`/client`**: A React + Vite + Tailwind CSS frontend that handles the user interface, state management (Zustand), interactive charts (Recharts), and speech recognition.

---

## Phase 1: Initialize the Project Structure

1. **Create the Project Directory:**
   ```bash
   mkdir ShopWise-AI && cd ShopWise-AI
   ```
2. **Create Subfolders:**
   Create a `client` folder for the frontend and a `server` folder for the backend.

---

## Phase 2: Building the Backend (`/server`)

### 1. Initialize Node.js & Install Dependencies
Navigate into `server/`, initialize `package.json`, and install dependencies:
```bash
cd server
npm init -y
npm install express cors dotenv mongoose ioredis socket.io firebase-admin @google/generative-ai groq-sdk helmet morgan express-rate-limit express-validator node-cron nodemailer razorpay jsonwebtoken multer bcryptjs
npm install --save-dev nodemon
```

### 2. Configure Environment Variables (`.env`)
Create a `.env` file containing ports, MongoDB credentials, Redis URL, JWT Secrets, and API Keys (Gemini, Groq, SerpAPI, Cloudinary).

### 3. Create the Database Configuration (`src/config/`)
* **MongoDB (`db.js`):** Use `mongoose.connect()` to connect to MongoDB Atlas.
* **Redis (`redis.js`):** Set up `ioredis` to establish a connection to Upstash Redis for caching heavy search results.
* **Firebase (`firebase.js`):** Set up `firebase-admin` to verify user auth tokens securely in the backend.

### 4. Define Database Models (`src/models/`)
Create Mongoose schemas:
* **`User.js`**: Stores Firebase UID, email, profile name, and search history.
* **`Notification.js`**: Stores real-time messages for user price drops.
* **`PriceHistory.js`**: Logs price history points for products over 30 days to build charts.
* **`Wishlist.js`**: Connects products saved by users.
* **`Alert.js`**: Stores the user's targeted price drop trigger (e.g., alert me if iPhone drops below $700).

### 5. Build External Services & API Connectors (`src/services/`)
* **SerpAPI (`serpService.js`):** Make HTTP requests to SerpAPI's Google Shopping engine. This retrieves real-time pricing and stock data from merchants like Amazon, Flipkart, and Croma.
* **Gemini AI (`geminiService.js`):** Integrates Google's Generative AI SDK to:
  1. Parse messy natural language queries (e.g., "laptop under 50k") into structured parameters.
  2. Parse and generate AI reviews (Pros, Cons, Verdict).
* **Groq Chatbot (`groqService.js`):** Connects to Groq's fast LLMs to handle real-time chat helper questions on the website.

### 6. Create Express Routes & Controllers (`src/routes/` & `src/controllers/`)
* **Auth**: `/api/auth/sync` to check Firebase logins and sync them with MongoDB.
* **Products**: `/api/products/search` to call SerpAPI, parse with Gemini, cache results in Redis, and return products.
* **AI Features**: `/api/ai/compare` (to let Gemini compile side-by-side product charts) and `/api/ai/agent` (to draft budget plans).
* **User features**: Routes to manage the Wishlist, set/delete Price Alerts, and fetch Notifications.

### 7. Core server entry point (`app.js`)
* Create `app.js` and initialize Express, HTTP Server, and Socket.io.
* Apply security middlewares: `cors`, `helmet`, and `express-rate-limit` (make sure to set `app.set('trust proxy', 1)` when deploying to Render).
* Setup a `node-cron` job to run daily/hourly to check product prices and alert users via Socket.io if prices drop.
* Start the server on a defined port (e.g. `5000`).

---

## Phase 3: Building the Frontend (`/client`)

### 1. Initialize React app with Vite
Navigate back to the project root and create a React + Vite application:
```bash
cd ..
npm create vite@latest client -- --template react
cd client
npm install
```

### 2. Install Frontend Dependencies
Install CSS preprocessors, icons, charts, state management, router, and motion packages:
```bash
npm install tailwindcss @tailwindcss/vite sass lucide-react react-icons react-router-dom axios zustand framer-motion recharts react-hot-toast firebase annyang react-speech-recognition
```

### 3. Setup Routing & Contexts
* **`App.jsx`**: Wrap the app with `BrowserRouter` and construct routing for pages like Home (`/`), Search Result (`/search`), Product Detail (`/product/:id`), Compare (`/compare`), and User Profile/Wishlist.
* **`AuthContext.jsx`**: Integrates the client-side Firebase SDK. Whenever a user logs in via Google OAuth or Email/Password, Firebase provides an ID token. The frontend sends this token to the backend (`/api/auth/sync`) to authenticate and establish a session.

### 4. Create Reusable Components (`src/components/`)
* **`Navbar.jsx`**: Custom glassmorphic navigation bar with profile info, notifications dropdown, and search.
* **`SearchBar.jsx`**: Features voice search (using `react-speech-recognition`) and interactive suggestions as the user types.
* **`ProductCard.jsx`**: Renders product images, title, lowest price, rating badge, and buttons to add to a wishlist/set a price alert.
* **`AIChat.jsx`**: Floating chatbot assistant visible on all pages, posting queries to `/api/ai/chat`.

### 5. Build Core Pages (`src/pages/`)
* **Home Page (`Home.jsx`):** Beautiful hero section displaying popular trends and a prompt-based AI search bar.
* **Search Page (`Search.jsx`):** Displays query results. When loading, it displays skeleton placeholders. Includes filters for sorting, rating, and price.
* **Product Detail (`ProductDetail.jsx`):** Renders selected product info, a price history chart (using `recharts`), and an AI-generated Review Summary (Pros/Cons) created dynamically by Gemini.
* **Compare Page (`Compare.jsx`):** Allows selecting 2-3 products side-by-side, posting to the backend to get a comparison analysis.

---

## Phase 4: Connecting Frontend and Backend

1. Configure the API service in the frontend (`client/src/services/api.js`) using Axios. Point `baseURL` to `import.meta.env.VITE_API_URL` (local or production backend address).
2. Attach request interceptors to send the Firebase authorization header on every API call.
3. Test locally by running:
   * **Backend:** `cd server && npm run dev`
   * **Frontend:** `cd client && npm run dev`

---

## Phase 5: Production Deployment

1. **Deploy Backend (Render):**
   * Create a Git repository.
   * Put `render.yaml` in the root folder.
   * Select Render Blueprints, connect the repo, and fill in the `.env` variables.
2. **Deploy Frontend (Vercel):**
   * Connect the repository to Vercel.
   * Set the root directory to `client` and add `VITE_API_URL` pointing to the Render backend URL.
3. **Link Back:** Update `CLIENT_URL` in the Render environment variables with the live Vercel URL to authorize CORS requests.
