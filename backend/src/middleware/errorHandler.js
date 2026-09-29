/**
 * Centralized Global Error Handling & 404 Middleware
 * Formats errors into standardized JSON responses without leaking stack traces in production
 */

import { env } from '../config/env.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Endpoint not found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    statusCode = 409;
    const target = err.meta?.target ? ` (${err.meta.target.join(', ')})` : '';
    message = `A resource with that unique identifier already exists${target}.`;
  }

  // Handle Prisma record not found (P2025)
  if (err.code === 'P2025') {
    statusCode = 404;
    message = err.meta?.cause || 'Requested database record not found.';
  }

  // Handle Prisma foreign key constraint failure (P2003)
  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Invalid reference: related entity does not exist.';
  }

  // Handle invalid JSON body syntax
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload in request body.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default {
  notFoundHandler,
  errorHandler,
};
