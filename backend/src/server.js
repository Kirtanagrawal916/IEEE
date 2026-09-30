/**
 * HTTP Server Entry Point
 * Starts the Express server and binds graceful shutdown listeners
 */

import app from './app.js';
import { env } from './config/env.js';
import prisma from './config/db.js';

const PORT = env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`
🚀 ===================================================
   HerEarn Backend Server is running!
   Environment: ${env.NODE_ENV}
   Host:        ${HOST}
   Port:        ${PORT}
   API URL:     http://${HOST}:${PORT}/api
   Health:      http://${HOST}:${PORT}/api/health
===================================================
  `);
});

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('🔌 HTTP server closed.');

    try {
      await prisma.$disconnect();
      console.log('💾 Database connection closed cleanly.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during database disconnect:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if hanging
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
