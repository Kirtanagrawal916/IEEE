# HerEarn: Website Implementation Plan (Prototype)

**Project:** A website where women learn market-relevant skills, showcase their work, and connect with real income opportunities.

**Core loop:** Learn → Showcase → Earn

**Deadline:** tomorrow. The goal is a **live, working website** with a real frontend and a simple real backend, covering one complete user path from sign-up to applying for a gig.

**Status so far:** The landing page and navbar are done (React + Tailwind, pushed to GitHub). The plan below covers everything still to build.

---

## 1. Scope

### Must build (the demo path)

| # | Feature | Frontend page | Backend needed |
|---|---|---|---|
| 1 | Landing page | Home | No (done) |
| 2 | Sign up / login | Login, Signup | Yes (auth) |
| 3 | Profile setup | Profile | Yes |
| 4 | Learning track with progress | Courses, Lesson | Yes (progress) |
| 5 | Portfolio: add and view projects | Portfolio, Public Profile | Yes |
| 6 | Opportunity board + apply | Opportunities | Yes |
| 7 | User dashboard (progress, applications) | Dashboard | Yes |

### Keep simple or mock

- Lesson videos: embedded YouTube links
- Opportunities: seeded sample data (8 gigs and internships)
- Payments: "Coming soon" button only
- Matching: filter by skill tag and category

### Do NOT build tomorrow (mention in roadmap)

Mentorship, AI matching, real payments and escrow, mobile app, full multilingual translation, admin panel, employer dashboard.

---

## 2. Tech Stack

| Need | Choice | Why |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS | Fast to build, modular, looks great |
| State & Storage | LocalStorage + React State | Fast, persistent offline prototype loop |
| Content | Embedded YouTube links | Practical learning tracks |
| Hosting | Vercel / GitHub Pages | Instant deployment |

---

## 3. Demo Path & End-to-End Loop

1. **Sign Up / Login**: Register or 1-click sign in.
2. **Dashboard**: View enrolled courses, earnings, active gigs, and quick shortcuts.
3. **Learn Track**: Watch bite-sized video lessons & mark lessons complete to increase track progress.
4. **Showcase Portfolio**: Submit verified projects (title, category, image/link, description).
5. **Opportunity Board**: Filter gigs by skill tag/category & submit application with attached portfolio.

---

## 4. Checklist & Submission Readiness

- [x] Clean Vite + React architecture (no hardcoded inline scripts)
- [x] Fully responsive Light Mode and Dark Mode support
- [x] Dynamic Dashboard with stats, course progress, active gigs, and modal shortcuts
- [x] Verified project portfolio submission modal
- [x] Interactive micro-gig application modal
- [x] About Us & Terms & Conditions policies in 3-dot dropdown menu
- [x] Pushed to Git branch `yashi`
