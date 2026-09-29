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

### Allowed hardcoded data

Small static UI data is acceptable, such as:

* Navigation labels
* Skill category names where appropriate
* Icons
* Empty-state messages
* UI configuration
* Demo fallback content if absolutely necessary

### Avoid

```javascript
const opportunities = [
   {...},
   {...},
   {...},
   {...}
]
```

Instead:

```text
GET /api/opportunities
```

and render the response dynamically.

---

# 4. Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Fetch / Axios for API communication
* React Context or lightweight state management
* LocalStorage only for non-critical client state

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

Preferred:

* PostgreSQL
* Prisma ORM

Alternative for local development:

* SQLite

The production architecture should remain compatible with PostgreSQL.

---

## Deployment

### Frontend

Vercel

### Backend

Suitable Node.js hosting such as:

* Render
* Railway
* Other Node-compatible hosting

### Database

Hosted PostgreSQL such as:

* Neon
* Supabase
* Railway PostgreSQL

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
                 PostgreSQL
```

---

# 6. Repository Structure

Recommended structure:

```text
her-earn/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   └── assets/
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   └── package.json
│
├── docs/
│   └── implementation-plan.md
│
└── README.md
```

---

# 7. Feature Modules

The implementation is divided into the following modules:

```text
Module 1  → Authentication
Module 2  → User Profile
Module 3  → Dashboard
Module 4  → Learning Tracks
Module 5  → Lesson & Progress Tracking
Module 6  → Portfolio
Module 7  → Opportunities
Module 8  → Applications
Module 9  → Backend & Database
Module 10 → Integration
Module 11 → Testing
Module 12 → Deployment
```

---

# 8. FRONTEND IMPLEMENTATION

# F1. Landing Page

### Status

Existing implementation can be retained.

### Requirements

Landing page should communicate:

* What HerEarn is
* Why free upskilling matters
* Available skill categories
* How the Learn → Showcase → Earn journey works
* Call-to-action for registration

### CTA

Primary:

```text
Start Learning Free
```

Secondary:

```text
Explore Opportunities
```

### Backend

Not required for static landing content.

---

# F2. Authentication UI

## Pages

```text
/login
/signup
```

### Signup fields

* Name
* Email
* Password
* Confirm password

Optional:

* Location

### Login fields

* Email
* Password

### Frontend responsibilities

* Form validation
* Loading state
* Error state
* Success handling
* Store authentication token
* Redirect authenticated user

### API

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

# F3. Authentication State

Create an authentication context/provider.

Responsibilities:

```text
user
token
isAuthenticated
login()
logout()
register()
refreshUser()
```

Protected pages should not be accessible without authentication.

Example:

```text
/dashboard
/profile
/courses
/portfolio
/opportunities
/applications
```

---

# F4. Profile Setup

## Page

```text
/profile
```

### Fields

* Name
* Profile photo
* Location
* Bio
* Skills
* Interests
* Experience level

### UX

After registration:

```text
Signup
  ↓
Profile Setup
  ↓
Dashboard
```

Profile completion should be represented visually.

Example:

```text
Profile completion: 70%
```

The percentage should be calculated from actual profile fields rather than hardcoded.

---

# F5. Dashboard

Dashboard should be dynamic.

### Main sections

#### Welcome section

```text
Welcome back, [User Name]
```

#### Learning Progress

Show:

* Enrolled tracks
* Overall progress
* Current lesson
* Completed tracks

#### Portfolio

Show:

* Number of projects
* Verified projects
* Recent project

#### Opportunities

Show:

* Available opportunities
* Applications submitted
* Applications under review
* Accepted applications

#### Quick Actions

```text
Continue Learning
Build Portfolio
Explore Opportunities
View Applications
```

All statistics should be calculated from backend data.

---

# F6. Learning Tracks

## Page

```text
/courses
```

Tracks should be fetched dynamically.

### Track card

Each card may display:

* Title
* Category
* Level
* Duration
* Instructor
* Description
* Progress
* Number of lessons

Example:

```text
Digital Marketing
Beginner
8 Lessons
3h 20m
Progress: 45%
```

### API

```text
GET /api/tracks
GET /api/tracks/:id
```

---

# F7. Track Details

## Page

```text
/courses/:trackId
```

Display:

* Track information
* Description
* Instructor
* Duration
* Level
* Lesson list
* Current progress

### User actions

```text
Start Track
Continue Learning
```

---

# F8. Lesson Page

## Page

```text
/courses/:trackId/lessons/:lessonId
```

### Content

* Lesson title
* Embedded YouTube video
* Lesson summary
* Key takeaways
* Previous lesson
* Next lesson

### Completion

Button:

```text
Mark Lesson Complete
```

On completion:

```text
Frontend
   ↓
POST /api/progress
   ↓
Backend updates enrollment
   ↓
New progress returned
   ↓
UI updates
```

---

# F9. Progress Tracking

Progress should be calculated from completed lessons.

Example:

```text
Total lessons = 10
Completed = 6

Progress = 60%
```

Do not manually store arbitrary progress values from the frontend.

Backend should derive progress from enrollment/lesson completion data.

---

# F10. Portfolio

## Page

```text
/portfolio
```

### Features

* View own projects
* Add project
* Edit project
* Delete project
* View project details

### Project fields

* Title
* Category
* Description
* Project image
* Project URL
* Skills/tags

### Add Project

Use modal or dedicated form.

```text
POST /api/portfolio
```

---

# F11. Public Profile

## Page

```text
/profile/:userId
```

Display:

* Name
* Bio
* Skills
* Completed learning tracks
* Portfolio projects

This allows an opportunity application to reference the user's actual profile.

---

# F12. Opportunities

## Page

```text
/opportunities
```

Opportunities must be retrieved from backend.

### Filters

* Category
* Opportunity type
* Skill
* Remote/on-site if implemented
* Search

### Opportunity card

Display:

* Opportunity title
* Company
* Category
* Type
* Stipend
* Required skills
* Duration
* Deadline
* Verified client status

---

# F13. Opportunity Details

## Page

```text
/opportunities/:id
```

Display:

* Full description
* Company
* Required skills
* Deliverables
* Duration
* Stipend
* Deadline
* Verification status
* Applicant count

CTA:

```text
Apply Now
```

---

# F14. Application Flow

When user clicks:

```text
Apply Now
```

Open application form.

### Application fields

* Cover note
* Portfolio projects

Portfolio projects should be fetched from the logged-in user's account.

The user should not manually type arbitrary project IDs.

### API

```text
POST /api/opportunities/:id/apply
```

Backend should:

1. Verify authentication
2. Verify opportunity exists
3. Verify opportunity is open
4. Verify deadline has not passed
5. Verify user has not already applied
6. Validate portfolio project ownership
7. Create application
8. Increment applicant count if required

---

# F15. Applications

## Page

```text
/applications
```

Display:

* Opportunity
* Company
* Applied date
* Status

Possible statuses:

```text
SUBMITTED
UNDER_REVIEW
SHORTLISTED
ACCEPTED
REJECTED
```

Status should come from backend.

---

# 9. BACKEND IMPLEMENTATION

# B1. Backend Foundation

Set up:

```text
Node.js
Express
Prisma
PostgreSQL
dotenv
cors
bcrypt
jsonwebtoken
```

### Basic API structure

```text
/api
   /auth
   /users
   /tracks
   /lessons
   /progress
   /portfolio
   /opportunities
   /applications
```

---

# B2. Authentication

## Register

```text
POST /api/auth/register
```

Process:

```text
Validate input
    ↓
Check email
    ↓
Hash password
    ↓
Create user
    ↓
Generate JWT
    ↓
Return user + token
```

---

## Login

```text
POST /api/auth/login
```

Process:

```text
Validate credentials
    ↓
Find user
    ↓
Compare password hash
    ↓
Generate JWT
    ↓
Return authenticated user
```

---

## Current User

```text
GET /api/auth/me
```

Protected route.

---

# B3. Authentication Middleware

Create:

```text
authMiddleware
```

Responsibilities:

* Read JWT
* Validate JWT
* Identify user
* Attach user ID to request

Example conceptual flow:

```text
Request
  ↓
Authorization Header
  ↓
JWT Validation
  ↓
req.user
  ↓
Controller
```

---

# B4. User Profile API

```text
GET    /api/users/me
PATCH  /api/users/me
```

Profile updates must only modify the authenticated user's own data.

---

# B5. Learning Track APIs

```text
GET /api/tracks
GET /api/tracks/:id
```

Optional:

```text
POST /api/tracks
PATCH /api/tracks/:id
DELETE /api/tracks/:id
```

These can remain admin-only or unused in the MVP.

---

# B6. Lesson APIs

```text
GET /api/tracks/:trackId/lessons
GET /api/lessons/:id
```

Lessons must be associated with actual tracks through the database.

---

# B7. Enrollment APIs

```text
POST /api/tracks/:trackId/enroll
GET  /api/enrollments
GET  /api/enrollments/:trackId
```

If a user opens a track for the first time, an enrollment record should be created.

Repeated enrollment should not create duplicate records.

---

# B8. Progress APIs

```text
POST /api/lessons/:lessonId/complete
GET  /api/progress/:trackId
```

When a lesson is completed:

```text
Validate user
    ↓
Find enrollment
    ↓
Validate lesson belongs to track
    ↓
Add completion
    ↓
Calculate progress
    ↓
Update enrollment
    ↓
Return progress
```

---

# B9. Portfolio APIs

```text
GET    /api/portfolio/me
POST   /api/portfolio
GET    /api/portfolio/:id
PATCH  /api/portfolio/:id
DELETE /api/portfolio/:id
```

Ownership must be checked on update/delete.

A user must not be able to modify another user's portfolio project.

---

# B10. Opportunity APIs

```text
GET /api/opportunities
GET /api/opportunities/:id
```

Filtering should be handled through query parameters.

Example:

```text
GET /api/opportunities?category=design
```

or:

```text
GET /api/opportunities?skill=canva
```

or:

```text
GET /api/opportunities?search=marketing
```

Backend performs the filtering instead of sending a huge hardcoded dataset to the frontend.

---

# B11. Application APIs

```text
POST /api/opportunities/:id/apply
GET  /api/applications/me
GET  /api/applications/:id
```

Application creation must perform server-side validation.

---

# B12. Dashboard API

Instead of making the frontend request many unrelated endpoints every time, create:

```text
GET /api/dashboard
```

Response can contain:

```json
{
  "profile": {},
  "learning": {},
  "portfolio": {},
  "applications": {},
  "opportunities": {}
}
```

This keeps the dashboard fast and easier to maintain.

---

# 10. DATABASE IMPLEMENTATION

The database should be normalized enough for the MVP and should avoid unnecessary duplication.

## Core tables

```text
users
skill_tracks
lessons
enrollments
lesson_progress
portfolio_projects
opportunities
applications
application_projects
```

---

# 11. Recommended Database Improvement

The previous design stored:

```text
completedLessonIds
```

as an array inside Enrollment.

For a real relational backend, this should preferably be replaced with a separate table:

```text
lesson_progress
```

Example:

```text
lesson_progress
----------------
id
userId
lessonId
completedAt
```

This provides a cleaner relationship:

```text
User
 ↓
Enrollment
 ↓
Lesson Progress
 ↓
Lesson
 ↓
Skill Track
```

It also makes progress queries easier and more reliable.

---

# 12. Portfolio/Application Relationship

Instead of storing:

```text
portfolioProjectIds[]
```

inside Application, use a junction table:

```text
application_projects
--------------------
id
applicationId
projectId
```

Relationship:

```text
Application
     ↓
ApplicationProject
     ↓
PortfolioProject
```

This follows relational database design more cleanly.

---

# 13. Seed Data Strategy

Hardcoded data should be limited to **database seed data**, not frontend code.

The MVP can contain a small set of actual database records.

Recommended initial seed:

### Skill Tracks

3–5 tracks:

```text
Digital Marketing
Graphic Design
Web Development
Content & Social Media
Business & Entrepreneurship
```

### Lessons

Approximately:

```text
4–6 lessons per track
```

Only enough to demonstrate progress tracking.

### Opportunities

Approximately:

```text
6–10 opportunities
```

These should be inserted into the database using Prisma seed scripts.

Example:

```text
prisma/seed.js
```

The frontend should never contain this dataset directly.

---

# 14. Sample Data Principle

Seed data is acceptable because it represents initial database content.

The important distinction is:

### Good

```text
Database
   ↓
GET /api/opportunities
   ↓
React
```

### Avoid

```text
React
   ↓
const opportunities = [...]
```

The same applies to courses, lessons and users.

---

# 15. Frontend ↔️ Backend Integration

Create a centralized API service.

Example:

```text
frontend/src/services/api.js
```

or:

```text
frontend/src/services/
    authApi.js
    courseApi.js
    portfolioApi.js
    opportunityApi.js
    applicationApi.js
```

Avoid putting API calls directly into every component.

---

# 16. API Error Handling

Frontend should handle:

```text
400 → Invalid request
401 → Login required
403 → Permission denied
404 → Resource not found
409 → Duplicate/conflict
500 → Server error
```

Show user-friendly messages.

Example:

Instead of:

```text
AxiosError: Request failed with status code 409
```

show:

```text
You have already applied to this opportunity.
```

---

# 17. Loading & Empty States

Every dynamic page should handle three states:

```text
Loading
   ↓
Success
   ↓
Empty / Error
```

Examples:

### No portfolio

```text
You haven't added any projects yet.
Build your first project to start showcasing your skills.
```

### No applications

```text
You haven't applied to any opportunities yet.
Explore opportunities that match your skills.
```

### No courses

```text
No learning tracks are available right now.
```

---

# 18. Security Requirements

Even for the prototype:

### Passwords

Never store plain-text passwords.

Use:

```text
bcrypt
```

### Authentication

Use:

```text
JWT
```

### Authorization

Users should only modify their own:

* Profile
* Portfolio
* Applications

### Input validation

Validate all important backend requests.

### Environment variables

Never commit:

```text
DATABASE_URL
JWT_SECRET
API keys
```

Use:

```text
.env
```

and provide:

```text
.env.example
```

---

# 19. Frontend Task Division

## FE-01: Routing

Create routes for:

```text
/
 /login
 /signup
 /profile
 /dashboard
 /courses
 /courses/:id
 /courses/:trackId/lessons/:lessonId
 /portfolio
 /profile/:id
 /opportunities
 /opportunities/:id
 /applications
```

---

## FE-02: Authentication UI

* Login
* Signup
* Validation
* Auth context
* Protected routes
* Logout

---

## FE-03: Profile

* Profile form
* Skills
* Bio
* Profile completion
* Profile update

---

## FE-04: Dashboard

* User greeting
* Learning progress
* Portfolio statistics
* Application statistics
* Quick actions

---

## FE-05: Learning

* Track listing
* Track details
* Lesson listing
* Lesson player
* Progress bar
* Complete lesson

---

## FE-06: Portfolio

* Project listing
* Add project
* Edit project
* Delete project
* Project details

---

## FE-07: Opportunities

* Opportunity listing
* Search
* Category filter
* Skill filter
* Opportunity details

---

## FE-08: Applications

* Application modal
* Portfolio selection
* Cover note
* Application submission
* Application status

---

## FE-09: UI/UX

* Responsive design
* Loading states
* Error states
* Empty states
* Toast notifications
* Modal handling
* Dark/light mode if existing design already supports it

---

# 20. Backend Task Division

## BE-01: Server Setup

* Express
* Environment configuration
* CORS
* Error middleware
* API versioning

---

## BE-02: Database

* Prisma setup
* PostgreSQL connection
* Schema
* Migrations
* Seed script

---

## BE-03: Authentication

* Register
* Login
* JWT
* Password hashing
* Auth middleware
* Current-user endpoint

---

## BE-04: Users

* Profile retrieval
* Profile update
* User validation

---

## BE-05: Learning

* Tracks
* Lessons
* Enrollment
* Progress tracking

---

## BE-06: Portfolio

* CRUD APIs
* Ownership validation

---

## BE-07: Opportunities

* Listing
* Search
* Filtering
* Details

---

## BE-08: Applications

* Apply
* Duplicate application prevention
* Portfolio validation
* Application listing
* Status

---

## BE-09: Dashboard

* Aggregate user statistics
* Learning progress
* Portfolio count
* Application count

---

# 21. Database Task Division

## DB-01

Create Prisma schema.

## DB-02

Create migrations.

## DB-03

Create relationships.

## DB-04

Create indexes.

Important indexes:

```text
users.email
lessons.trackId
enrollments.userId
enrollments.trackId
portfolio_projects.userId
opportunities.category
applications.userId
applications.opportunityId
```

## DB-05

Create seed script.

Seed only the minimum content required for the demo.

---

# 22. Integration Tasks

After frontend and backend are individually functional:

### INT-01

Connect authentication.

### INT-02

Connect profile.

### INT-03

Connect dashboard.

### INT-04

Connect learning tracks.

### INT-05

Connect lesson progress.

### INT-06

Connect portfolio.

### INT-07

Connect opportunities.

### INT-08

Connect application flow.

### INT-09

Verify application appears in dashboard.

---

# 23. End-to-End Demo Test

The final demo should use one test account.

## Step 1

Register.

```text
Name
Email
Password
```

---

## Step 2

Complete profile.

Add:

```text
Skills
Bio
Location
```

---

## Step 3

Dashboard

Verify:

```text
Profile completion
Learning section
Portfolio count
Application count
```

---

## Step 4

Choose a learning track.

Example:

```text
Digital Marketing
```

---

## Step 5

Open lesson.

Watch embedded YouTube content.

---

## Step 6

Mark lesson complete.

Verify:

```text
Lesson = Completed
Progress = Updated
Dashboard = Updated
```

---

## Step 7

Create portfolio project.

Example:

```text
Social Media Campaign
```

---

## Step 8

Open Opportunities.

Use:

```text
Category
Skill
Search
```

---

## Step 9

Open opportunity details.

Verify:

```text
Company
Description
Skills
Stipend
Deadline
Deliverables
```

---

## Step 10

Apply.

Select portfolio project and enter cover note.

---

## Step 11

Open Applications.

Verify:

```text
Application
Opportunity
Applied date
Status = SUBMITTED
```

---

## Step 12

Return to Dashboard.

Verify application count increased.

---

# 24. Testing Checklist

## Authentication

* [ ] Signup works
* [ ] Duplicate email rejected
* [ ] Login works
* [ ] Incorrect password rejected
* [ ] Logout works
* [ ] Protected routes work

## Profile

* [ ] Profile loads
* [ ] Profile updates
* [ ] Skills save correctly
* [ ] Profile completion updates

## Learning

* [ ] Tracks load from API
* [ ] Track details load
* [ ] Lessons load
* [ ] Enrollment works
* [ ] Lesson completion works
* [ ] Progress updates correctly

## Portfolio

* [ ] Projects load
* [ ] Add project works
* [ ] Edit project works
* [ ] Delete project works
* [ ] Ownership is enforced

## Opportunities

* [ ] Opportunities load
* [ ] Search works
* [ ] Category filter works
* [ ] Skill filter works
* [ ] Details page works

## Applications

* [ ] Apply works
* [ ] Portfolio selection works
* [ ] Duplicate applications blocked
* [ ] Application status visible
* [ ] Dashboard reflects application

---

# 25. Responsive Testing

Test at minimum:

```text
Mobile:   375px
Mobile:   425px
Tablet:   768px
Laptop:   1024px
Desktop:  1440px
```

Check:

* Navbar
* Dashboard cards
* Course cards
* Lesson player
* Portfolio cards
* Opportunity cards
* Application modal
* Forms

---

# 26. Deployment Plan

## Step 1: Database

Create production PostgreSQL database.

Set:

```text
DATABASE_URL
```

---

## Step 2: Backend

Deploy Node.js backend.

Set:

```text
DATABASE_URL
JWT_SECRET
CORS_ORIGIN
```

Run:

```text
prisma migrate deploy
```

and seed only if required.

---

## Step 3: Frontend

Set:

```text
VITE_API_URL
```

to the deployed backend URL.

Build:

```text
npm run build
```

Deploy frontend to Vercel.

---

# 27. Environment Configuration

## Frontend

```text
VITE_API_URL=
```

## Backend

```text
DATABASE_URL=
JWT_SECRET=
CORS_ORIGIN=
PORT=
```

Never commit actual secrets.

---

# 28. MVP Priority

Because the prototype has a tight deadline, implementation should follow this order.

## P0 – Absolutely Required

```text
Authentication
      ↓
Profile
      ↓
Dashboard
      ↓
Learning Tracks
      ↓
Lesson Progress
      ↓
Portfolio
      ↓
Opportunities
      ↓
Application
```

These form the complete demo path.

---

## P1 – Important

```text
Search
Filters
Profile completion
Application status
Responsive UI
Error handling
Loading states
```

---

## P2 – If Time Remains

```text
Advanced animations
Advanced profile customization
Likes
Project verification workflow
More filtering
Enhanced analytics
```

---

# 29. Explicitly Out of MVP

The following should NOT consume development time for the current prototype:

### Payments

Only show:

```text
Payments coming soon
```

No real payment gateway.

---

### AI Matching

Do not implement complex AI recommendation.

For MVP:

```text
Skill/category based filtering
```

is sufficient.

---

### Mentorship

Keep as future functionality.

---

### Employer Dashboard

Not required for the current demo.

---

### Admin Panel

Not required for the current demo.

---

### Mobile Application

Not required.

---

### Full Multilingual Translation

Not required for MVP.

---

### Escrow

Future feature.

---

# 30. Future Roadmap

After MVP:

## Phase 2

```text
Employer Dashboard
Opportunity Posting
Advanced Skill Matching
Certificates
```

## Phase 3

```text
AI-based opportunity recommendations
AI learning recommendations
Resume generation
Skill-gap analysis
```

## Phase 4

```text
Mentorship
Women-focused professional communities
Real payment system
Escrow
Employer verification
```

## Phase 5

```text
Mobile application
Multilingual learning
Advanced analytics
National-scale opportunity ecosystem
```

---

# 31. Final MVP Definition

HerEarn MVP is considered complete when a new user can successfully:

```text
CREATE ACCOUNT
      ↓
COMPLETE PROFILE
      ↓
ENTER DASHBOARD
      ↓
SELECT FREE LEARNING TRACK
      ↓
WATCH LESSON
      ↓
MARK LESSON COMPLETE
      ↓
SEE PROGRESS UPDATE
      ↓
CREATE PORTFOLIO PROJECT
      ↓
FIND RELEVANT OPPORTUNITY
      ↓
SELECT PORTFOLIO
      ↓
SUBMIT APPLICATION
      ↓
SEE APPLICATION STATUS
```

The complete journey must use real frontend-to-backend communication and persistent database data.

---

# 32. Definition of Done

A feature is considered complete only when:

* Frontend UI exists
* Backend API exists where required
* Database persistence works
* Validation exists
* Loading state exists
* Error state exists
* Responsive layout works
* Authentication/authorization is respected
* Data is not unnecessarily hardcoded
* The feature works after refreshing the page

The final prototype should demonstrate that HerEarn is a functional **free women-upskilling-to-income platform**, not only a collection of static screens.

---

# 33. Final Team Work Split

## Frontend Team

Responsible for:

```text
Routing
Authentication UI
Dashboard
Profile
Courses
Lessons
Progress UI
Portfolio
Opportunities
Application UI
Responsive UI
API integration
```

---

## Backend Team

Responsible for:

```text
Express setup
Authentication
JWT
User APIs
Course APIs
Lesson APIs
Enrollment
Progress
Portfolio CRUD
Opportunity APIs
Application APIs
Dashboard API
Validation
Error handling
Security
```

---

## Database / Integration Team

Responsible for:

```text
Prisma schema
Migrations
Relationships
Indexes
Seed data
Database deployment
Frontend-backend integration
Environment configuration
End-to-end testing
Deployment verification
```

---

# 34. Core Architecture Principle

The most important implementation rule for the project is:

```text
                    HER EARN
                       │
                       ▼
                React Frontend
                       │
                       │ REST API
                       ▼
                Express Backend
                       │
                       │ Prisma
                       ▼
                  PostgreSQL
```

The frontend should **display and interact with data**, not own the application's main data.

Courses, lessons, users, portfolios, opportunities and applications should be persisted in the backend/database.

Only genuinely static UI information should remain hardcoded.

This keeps the prototype simple enough to finish quickly while giving HerEarn a proper architecture that can be extended after the demo.