# HerEarn – Detailed Implementation Plan

## 1. Project Overview

**Project Name:** HerEarn

**Core Idea:**
HerEarn is a free upskilling and opportunity platform designed to help women learn market-relevant skills, build a credible portfolio, and connect their skills with real income opportunities.

### Core Loop

**Learn → Build → Showcase → Earn**

The platform should not work like a simple course website. The objective is to connect learning with actual employability and income opportunities.

A user should be able to:

1. Create an account
2. Complete her profile
3. Select relevant skills/interests
4. Explore free learning tracks
5. Watch lessons
6. Track learning progress
7. Complete a learning track
8. Add projects to her portfolio
9. Browse relevant opportunities
10. Apply using her profile and portfolio
11. Track application status from the dashboard

---

# 2. MVP Objective

The objective of the current implementation is to deliver a **live, functional prototype** rather than a complete production platform.

The MVP must demonstrate one complete end-to-end user journey:

```text
Landing Page
      ↓
Sign Up / Login
      ↓
Profile Setup
      ↓
Dashboard
      ↓
Choose Skill Track
      ↓
View Lessons
      ↓
Complete Lessons
      ↓
Track Progress
      ↓
Create Portfolio Project
      ↓
Browse Opportunities
      ↓
Filter Opportunity
      ↓
View Opportunity Details
      ↓
Apply
      ↓
Application Appears in Dashboard
```

The demo should prove that the platform is not only a static UI but has a working frontend, backend, database, authentication, progress tracking, portfolio management, and opportunity application flow.

---

# 3. Product Principles

## 3.1 Free Upskilling First

All core learning content available in the MVP should be accessible to women without payment.

There should be no payment requirement for:

* Creating an account
* Creating a profile
* Enrolling in a learning track
* Watching lessons
* Tracking progress
* Creating a portfolio

---

## 3.2 Learning Must Lead to Action

Every learning track should eventually connect with practical work.

For example:

```text
Digital Marketing Track
        ↓
Learn Social Media Marketing
        ↓
Complete Lessons
        ↓
Create Sample Campaign
        ↓
Add Campaign to Portfolio
        ↓
Find Marketing Opportunity
        ↓
Apply
```

---

## 3.3 Minimal Hardcoded Data

The frontend should not contain large arrays of:

* Courses
* Lessons
* Opportunities
* Users
* Applications
* Portfolio projects

Instead:

```text
React UI
   ↓
API
   ↓
Backend
   ↓
Database
```

The frontend should primarily render data received from APIs.

---

# 4. Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Fetch / Axios for API communication
* React Context or lightweight state management

---

## Backend

* Node.js
* Express.js
* REST API architecture
* JWT-based authentication
* bcrypt/password hashing
* Validation middleware
* Centralized error handling

---

## Database

* PostgreSQL / SQLite
* Prisma ORM

---

# 5. High-Level Architecture

```text
                    HER EARN
                       │
                       ▼
              React + Vite Frontend
                       │
              REST API / HTTP Requests
                       │
                       ▼
              Node.js + Express Backend
                       │
                 Prisma ORM
                       │
                       ▼
            Database (SQLite/PostgreSQL)
```

---

# 6. Feature Modules & API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### User Profile
- `GET /api/users/me`
- `PATCH /api/users/me`

### Learning Tracks & Lessons
- `GET /api/tracks`
- `GET /api/tracks/:id`
- `GET /api/tracks/:trackId/lessons`
- `GET /api/lessons/:id`

### Enrollment & Progress
- `POST /api/tracks/:trackId/enroll`
- `GET /api/enrollments`
- `GET /api/enrollments/:trackId`
- `POST /api/lessons/:lessonId/complete`
- `GET /api/progress/:trackId`

### Portfolio
- `GET /api/portfolio/me`
- `POST /api/portfolio`
- `GET /api/portfolio/:id`
- `PATCH /api/portfolio/:id`
- `DELETE /api/portfolio/:id`

### Opportunities
- `GET /api/opportunities`
- `GET /api/opportunities/:id`

### Applications
- `POST /api/opportunities/:id/apply`
- `GET /api/applications/me`
- `GET /api/applications/:id`

### Dashboard
- `GET /api/dashboard`

---

# 7. Database Models (Prisma)

- `User`: id, name, email, passwordHash, role, avatar, location, bio, skills, totalEarned
- `SkillTrack`: id, title, category, icon, duration, level, instructor, description, image
- `Lesson`: id, trackId, title, duration, videoUrl, summary, keyTakeaways, orderIndex
- `Enrollment`: id, userId, trackId, progressPercent, isCompleted, lastAccessedAt
- `LessonProgress`: id, userId, lessonId, completedAt
- `PortfolioProject`: id, userId, title, category, description, imageUrl, projectUrl, tags, likesCount, verified
- `Opportunity`: id, title, company, logo, stipend, type, category, skillsRequired, duration, description, deliverables, verifiedClient, isOpen, applicantsCount, deadline
- `Application`: id, opportunityId, userId, coverNote, status, appliedAt
- `ApplicationProject`: id, applicationId, projectId
