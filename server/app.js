require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');

const isProduction = process.env.NODE_ENV === 'production';

const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');

// Routes
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const aiRoutes = require('./src/routes/ai');
const userRoutes = require('./src/routes/users');

const app = express();
const server = http.createServer(app);

// Socket.io — restrict origin in production
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  // Prevent socket hijacking
  allowEIO3: false,
  pingTimeout: 30000,
  pingInterval: 25000,
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
  socket.on('join-user', (userId) => socket.join(`user-${userId}`));
  socket.on('disconnect', () => console.log('🔌 Socket disconnected:', socket.id));
});

app.set('io', io);

// ── Security & Middleware ──────────────────────────────────────────

// Helmet — comprehensive HTTP security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: isProduction ? undefined : false, // CSP in production only
  hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Remove X-Powered-By to avoid exposing Express
app.disable('x-powered-by');

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// CORS — strict origin in production, permissive in development
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (origin === allowedOrigin) return callback(null, true);
    if (!isProduction && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight for 24h
}));

// Body parser with size limits to prevent payload attacks
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Request logging (disabled in production for performance, disabled in test)
if (!isProduction && process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
if (isProduction) app.use(morgan('combined'));

// ── Rate Limiting ─────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: isProduction ? 100 : 200, // Stricter in production
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,  // Disable `X-RateLimit-*` headers
});
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isProduction ? 10 : 20, // AI endpoints are expensive — stricter limit
  message: { success: false, message: 'AI rate limit exceeded. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Prevent brute-force login attempts
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
app.use('/api/ai/', aiLimiter);
app.use('/api/auth/', authLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ShopWise AI Server Running 🚀', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler — hide error details in production to prevent info leakage
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB().catch((err) => console.warn('DB not available:', err.message));
  connectRedis();
  server.listen(PORT, () => {
    console.log(`\n🚀 ShopWise AI Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
  });
};

start();

module.exports = app;
