import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath, override: false });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed Origins for CORS Security
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://herearn.vercel.app',
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : [])
].filter(Boolean);

// CORS configuration with credentials support for HttpOnly cookies
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked request from origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-admin-key', 'x-admin-passkey'],
  })
);

// Body and Cookie Parsing Middlewares
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HerEarn Backend API is operational',
    healthCheck: '/api/health',
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HerEarn Backend API is operational',
    healthCheck: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HerEarn Backend API is operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', trackRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 HerEarn Secure Express Backend running on http://localhost:${PORT}`);
  });
}

export default app;
