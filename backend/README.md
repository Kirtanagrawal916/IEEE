# HerEarn Backend

Backend foundation and REST API server for the **HerEarn** platform (Learn → Build → Showcase → Earn).

Built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**.

---

## 📁 Architecture Overview

```
backend/
├── .env.example              # Environment variable template
├── Dockerfile                # Production multi-stage Docker container
├── package.json              # ES Modules ("type": "module")
├── prisma/
│   ├── schema.prisma         # Normalized database models & indexes (Sections 10, 11, 12, 21)
│   └── seed.js               # Database seeder (3-5 tracks, 4-6 lessons each, 8 opportunities)
├── src/
│   ├── config/
│   │   ├── db.js             # Shared PrismaClient singleton
│   │   └── env.js            # Environment validation
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication (authenticateToken, requireRole, requireOwnership)
│   │   ├── errorHandler.js   # Global error formatting & 404 handler
│   │   ├── rateLimiter.js    # Rate limiting for APIs and auth endpoints
│   │   └── validate.js       # Request body & email validator helpers
│   ├── routes/
│   │   └── index.js          # Main router mounting /api/health and teammate route stubs
│   ├── utils/
│   │   ├── asyncHandler.js   # Wrapper catching async errors in controllers
│   │   ├── jwt.js            # generateToken & verifyToken helpers
│   │   └── password.js       # hashPassword & comparePassword helpers (bcrypt)
│   ├── app.js                # Express app configuration (Helmet, CORS, parsers, routes)
│   └── server.js             # HTTP server listener and graceful shutdown
└── tests/
    ├── auth.test.js          # Unit tests for JWT and bcrypt
    └── health.test.js        # Health check and 404 integration tests
```

---

## 🚀 Getting Started

### 1. Install Dependencies
From the repository root:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` points to your PostgreSQL instance.

### 3. Initialize Database & Seed Sample Data
```bash
# Generate Prisma Client
npm run db:generate

# Push schema directly to database (or run npm run db:migrate)
npm run db:push

# Seed database with realistic tracks, video lessons, and opportunities
npm run db:seed
```

### 4. Run Server
```bash
# Development (with node --watch)
npm run dev

# Production
npm run start
```
The server will start at `http://localhost:5000` with the health probe available at `http://localhost:5000/api/health`.

---

## 👩‍💻 Guide for Route/Controller Teammate

All shared utilities, middleware, and database access are ready for you. To implement your API endpoints:

### 1. Database Access
Import the shared singleton instance:
```javascript
import prisma from '../config/db.js';

const users = await prisma.user.findMany();
```

### 2. Wrapping Controllers
Eliminate `try/catch` boilerplate by wrapping controllers with `asyncHandler`:
```javascript
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTracks = asyncHandler(async (req, res) => {
  const tracks = await prisma.skillTrack.findMany({
    include: { lessons: true }
  });
  res.json({ success: true, data: tracks });
});
```

### 3. Protecting Routes with Authentication
Use `authenticateToken` to secure endpoints. It attaches the authenticated user to `req.user`:
```javascript
import { authenticateToken, requireRole } from '../middleware/auth.js';

router.get('/profile', authenticateToken, getProfile);
router.post('/admin/track', authenticateToken, requireRole('ADMIN'), createTrack);
```

### 4. Hashing Passwords & Issuing Tokens
```javascript
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

// In register controller
const passwordHash = await hashPassword(req.body.password);

// In login controller
const isValid = await comparePassword(req.body.password, user.passwordHash);
if (isValid) {
  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  res.json({ success: true, token, user });
}
```

### 5. Mounting Your Router
Add your router to `src/routes/index.js`:
```javascript
import authRoutes from './authRoutes.js';
router.use('/auth', authRoutes);
```

---

## 🧪 Testing

Run automated tests:
```bash
npm run test
```
