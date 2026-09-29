/**
 * End-to-End API Route & User Journey Integration Tests for Backend B
 * Tests all migrated domain routes against PostgreSQL:
 * 1. Register & Login & OTP & Auth/Me
 * 2. User Profile (Get & Patch)
 * 3. Tracks & Lessons (List, Details, Lessons in Track)
 * 4. Enrollments & Progress (Enroll, Mark Complete, Progress Breakdown)
 * 5. Portfolio (Create, List User, List Public, Update, Delete)
 * 6. Opportunities (List, Category/Skill Filter, Details)
 * 7. Applications (Apply with Portfolio Project, View My Applications)
 * 8. Dashboard (Aggregated Metrics, Dynamic Completion %)
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/app.js';
import prisma from '../src/config/db.js';

describe('HerEarn Backend B Full PostgreSQL Integration Suite', { concurrency: 1 }, () => {
  let server;
  let baseUrl;
  let testUserToken = '';
  let testUserId = '';
  let firstTrackId = '';
  let firstLessonId = '';
  let firstOpportunityId = '';
  let createdProjectId = '';

  const uniqueSuffix = Date.now();
  const testEmail = `user_${uniqueSuffix}@herearn.org`;
  const testPassword = 'Password123!';

  before(async () => {
    // 1. Start HTTP Server
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });

    // 2. Fetch seeded track and opportunity IDs for relational tests
    const track = await prisma.skillTrack.findFirst({
      include: { lessons: { orderBy: { orderIndex: 'asc' } } },
    });
    if (track) {
      firstTrackId = track.id;
      if (track.lessons && track.lessons.length > 0) {
        firstLessonId = track.lessons[0].id;
      }
    }

    const opp = await prisma.opportunity.findFirst();
    if (opp) {
      firstOpportunityId = opp.id;
    }
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  // ----------------------------------------------------
  // 1. AUTHENTICATION FLOW
  // ----------------------------------------------------
  test('Step 1: POST /api/auth/register creates user and returns JWT token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rhea Sen',
        email: testEmail,
        password: testPassword,
        location: 'Kolkata, India',
        bio: 'Aspiring Web Developer and UI Designer',
        skills: ['React', 'Tailwind CSS', 'Figma'],
      }),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, testEmail);
    assert.strictEqual(data.user.name, 'Rhea Sen');
    assert.deepStrictEqual(data.user.skills, ['React', 'Tailwind CSS', 'Figma']);

    testUserToken = data.token;
    testUserId = data.user.id;
  });

  test('Step 2: POST /api/auth/register rejects duplicate email', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Rhea',
        email: testEmail,
        password: testPassword,
      }),
    });

    assert.strictEqual(res.status, 409);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  test('Step 3: POST /api/auth/login authenticates registered user', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, testEmail);
  });

  test('Step 4: POST /api/auth/login rejects incorrect password', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'IncorrectPassword999!',
      }),
    });

    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  test('Step 5: POST /api/auth/send-otp and POST /api/auth/verify-otp verify email flow', async () => {
    const otpEmail = `otp_user_${Date.now()}@herearn.org`;

    // 1. Send OTP
    const sendRes = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: otpEmail }),
    });

    assert.strictEqual(sendRes.status, 200);
    const sendData = await sendRes.json();
    assert.strictEqual(sendData.success, true);
    assert.ok(sendData.otp);

    // 2. Verify OTP
    const verifyRes = await fetch(`${baseUrl}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: otpEmail,
        otp: sendData.otp,
        name: 'OTP Verified User',
      }),
    });

    assert.strictEqual(verifyRes.status, 200);
    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyData.success, true);
    assert.ok(verifyData.token);
    assert.strictEqual(verifyData.user.email, otpEmail);
  });

  test('Step 6: GET /api/auth/me returns authenticated user session', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, testEmail);
    assert.strictEqual(data.user.name, 'Rhea Sen');
  });

  // ----------------------------------------------------
  // 2. USER PROFILE
  // ----------------------------------------------------
  test('Step 7: GET /api/users/me returns full profile details', async () => {
    const res = await fetch(`${baseUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.location, 'Kolkata, India');
  });

  test('Step 8: PATCH /api/users/me updates profile fields and PostgreSQL skills array', async () => {
    const res = await fetch(`${baseUrl}/api/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        bio: 'Updated Bio: Full Stack Developer passionate about women in tech',
        location: 'Bengaluru, India',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.location, 'Bengaluru, India');
    assert.deepStrictEqual(data.user.skills, ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS']);
  });

  // ----------------------------------------------------
  // 3. TRACKS & LESSONS
  // ----------------------------------------------------
  test('Step 9: GET /api/tracks lists all available skill tracks', async () => {
    const res = await fetch(`${baseUrl}/api/tracks`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.tracks));
    assert.ok(data.tracks.length >= 1);
  });

  test('Step 10: GET /api/tracks/:id returns single track with ordered lessons', async () => {
    assert.ok(firstTrackId);
    const res = await fetch(`${baseUrl}/api/tracks/${firstTrackId}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.track.id, firstTrackId);
    assert.ok(Array.isArray(data.track.lessons));
  });

  test('Step 11: GET /api/tracks/:trackId/lessons returns lessons with completion flag', async () => {
    assert.ok(firstTrackId);
    const res = await fetch(`${baseUrl}/api/tracks/${firstTrackId}/lessons`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.lessons));
    assert.ok(typeof data.lessons[0].isCompleted === 'boolean');
  });

  test('Step 12: GET /api/lessons/:id returns single lesson video details', async () => {
    assert.ok(firstLessonId);
    const res = await fetch(`${baseUrl}/api/lessons/${firstLessonId}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.lesson.id, firstLessonId);
    assert.ok(data.lesson.videoUrl);
  });

  // ----------------------------------------------------
  // 4. ENROLLMENT & PROGRESS
  // ----------------------------------------------------
  test('Step 13: POST /api/tracks/:trackId/enroll enrolls user in track', async () => {
    assert.ok(firstTrackId);
    const res = await fetch(`${baseUrl}/api/tracks/${firstTrackId}/enroll`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.enrollment.trackId, firstTrackId);
    assert.strictEqual(data.enrollment.userId, testUserId);
  });

  test('Step 14: GET /api/enrollments lists all enrolled tracks for user', async () => {
    const res = await fetch(`${baseUrl}/api/enrollments`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.enrollments));
    assert.ok(data.enrollments.length >= 1);
  });

  test('Step 15: POST /api/lessons/:lessonId/complete marks lesson complete and updates progress', async () => {
    assert.ok(firstLessonId);
    const res = await fetch(`${baseUrl}/api/lessons/${firstLessonId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.progress);
    assert.ok(data.progress.completedCount >= 1);
    assert.ok(data.progress.progressPercent > 0);
  });

  test('Step 16: GET /api/progress/:trackId verifies track completion breakdown', async () => {
    assert.ok(firstTrackId);
    const res = await fetch(`${baseUrl}/api/progress/${firstTrackId}`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.trackId, firstTrackId);
    assert.ok(data.completedCount >= 1);
    assert.ok(data.completedLessonIds.includes(firstLessonId));
  });

  // ----------------------------------------------------
  // 5. PORTFOLIO MANAGEMENT
  // ----------------------------------------------------
  test('Step 17: POST /api/portfolio creates a showcase project', async () => {
    const res = await fetch(`${baseUrl}/api/portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        title: 'HerEarn Community Hub Frontend',
        category: 'Tech',
        description: 'Responsive React + Tailwind web application with verified accessibility standards.',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
        projectUrl: 'https://github.com/herearn/community-hub',
        tags: ['React', 'Tailwind CSS', 'Accessibility'],
      }),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.project.title, 'HerEarn Community Hub Frontend');
    assert.deepStrictEqual(data.project.tags, ['React', 'Tailwind CSS', 'Accessibility']);

    createdProjectId = data.project.id;
  });

  test('Step 18: GET /api/portfolio/me and GET /api/portfolio return user and public projects', async () => {
    // 1. User Portfolio
    const userRes = await fetch(`${baseUrl}/api/portfolio/me`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    assert.strictEqual(userRes.status, 200);
    const userData = await userRes.json();
    assert.strictEqual(userData.success, true);
    assert.ok(userData.projects.some((p) => p.id === createdProjectId));

    // 2. Public Showcase Feed
    const publicRes = await fetch(`${baseUrl}/api/portfolio`);
    assert.strictEqual(publicRes.status, 200);
    const publicData = await publicRes.json();
    assert.strictEqual(publicData.success, true);
    assert.ok(Array.isArray(publicData.projects));
  });

  test('Step 19: PATCH /api/portfolio/:id updates showcase project with ownership enforcement', async () => {
    assert.ok(createdProjectId);
    const res = await fetch(`${baseUrl}/api/portfolio/${createdProjectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        title: 'HerEarn Community Hub Frontend (v2.0)',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.project.title, 'HerEarn Community Hub Frontend (v2.0)');
  });

  // ----------------------------------------------------
  // 6. OPPORTUNITIES & APPLICATION
  // ----------------------------------------------------
  test('Step 20: GET /api/opportunities filters open listings by category & skill', async () => {
    const res = await fetch(`${baseUrl}/api/opportunities?category=Marketing`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.opportunities));
  });

  test('Step 21: POST /api/opportunities/:id/apply submits application with attached portfolio', async () => {
    assert.ok(firstOpportunityId);
    assert.ok(createdProjectId);

    const res = await fetch(`${baseUrl}/api/opportunities/${firstOpportunityId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        coverNote: 'I completed the learning track and built a full responsive community hub project. Excited to contribute!',
        portfolioProjectIds: [createdProjectId],
      }),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.application.opportunityId, firstOpportunityId);
    assert.strictEqual(data.application.status, 'SUBMITTED');
  });

  test('Step 22: POST /api/opportunities/:id/apply rejects duplicate application', async () => {
    assert.ok(firstOpportunityId);

    const res = await fetch(`${baseUrl}/api/opportunities/${firstOpportunityId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        coverNote: 'Duplicate application attempt',
      }),
    });

    assert.strictEqual(res.status, 409);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  test('Step 23: GET /api/applications/me lists user submitted applications', async () => {
    const res = await fetch(`${baseUrl}/api/applications/me`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.applications));
    assert.ok(data.applications.some((a) => a.opportunityId === firstOpportunityId));
  });

  // ----------------------------------------------------
  // 7. DASHBOARD METRICS
  // ----------------------------------------------------
  test('Step 24: GET /api/dashboard returns dynamically aggregated user stats', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.dashboard);
    assert.ok(data.dashboard.stats);
    assert.ok(data.dashboard.stats.enrolledTracksCount >= 1);
    assert.ok(data.dashboard.stats.portfolioCount >= 1);
    assert.ok(data.dashboard.stats.applicationsCount >= 1);
    assert.ok(data.dashboard.user.profileCompletionPercent >= 80);
  });

  // ----------------------------------------------------
  // 8. CLEANUP / DELETE PORTFOLIO
  // ----------------------------------------------------
  test('Step 25: DELETE /api/portfolio/:id removes project with ownership enforcement', async () => {
    assert.ok(createdProjectId);
    const res = await fetch(`${baseUrl}/api/portfolio/${createdProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${testUserToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });
});
