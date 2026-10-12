/**
 * Express Application Setup
 * Configures middleware, security headers, CORS, body parsers, routes, and error handlers
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Cross-Origin Resource Sharing (CORS)
const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Rate Limiting for API routes
app.use('/api', apiLimiter);

// 5. Mount Main API Router
app.use('/api', apiRouter);

// 6. Catch-all for undefined routes (404)
app.use(notFoundHandler);

// 7. Global Error Handler
app.use(errorHandler);

export default app;
