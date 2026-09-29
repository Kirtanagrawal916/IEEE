/**
 * API Server Health Check Integration Test
 * Verifies that the Express server starts and /api/health responds with 200 OK
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/app.js';

describe('Server & Health Probe', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('GET /api/health returns 200 OK with service status', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(response.status, 200);

    const data = await response.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.service, 'HerEarn Backend API');
    assert.strictEqual(data.status, 'healthy');
    assert.ok(data.timestamp);
    assert.ok(data.database);
  });

  test('GET /api/nonexistent-route returns 404 Not Found', async () => {
    const response = await fetch(`${baseUrl}/api/nonexistent-route`);
    assert.strictEqual(response.status, 404);

    const data = await response.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes('Endpoint not found'));
  });
});
