require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');

// Routes
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const aiRoutes = require('./src/routes/ai');
const userRoutes = require('./src/routes/users');

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
  socket.on('join-user', (userId) => socket.join(`user-${userId}`));
  socket.on('disconnect', () => console.log('🔌 Socket disconnected:', socket.id));
});

app.set('io', io);

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

app.use('/api/', limiter);
app.use('/api/ai/', aiLimiter);

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

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
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
