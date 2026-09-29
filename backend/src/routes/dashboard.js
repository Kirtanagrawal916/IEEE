/**
 * User Dashboard Aggregated Metrics Routes
 * Conforms to frontend API contract (src/services/api.js) and PostgreSQL Prisma Schema
 */

import { Router } from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * @route   GET /api/dashboard
 * @desc    Get aggregated learner metrics (stats, learning tracks, portfolio, applications)
 * @access  Protected
 */
router.get(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // 1. User details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        location: true,
        bio: true,
        skills: true,
        totalEarned: true,
      },
    });

    // 2. Enrollments & calculated progress
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        track: {
          include: { lessons: { select: { id: true } } },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    const userProgress = await prisma.lessonProgress.findMany({
      where: { userId },
      select: { lessonId: true },
    });
    const completedLessonIds = userProgress.map((p) => p.lessonId);

    const formattedEnrollments = enrollments.map((e) => {
      const trackLessonIds = e.track.lessons.map((l) => l.id);
      const completedCount = trackLessonIds.filter((id) => completedLessonIds.includes(id)).length;
      const progressPercent =
        trackLessonIds.length > 0 ? Math.round((completedCount / trackLessonIds.length) * 100) : 0;

      return {
        id: e.id,
        trackId: e.trackId,
        title: e.track.title,
        category: e.track.category,
        image: e.track.image,
        completedCount,
        totalLessons: trackLessonIds.length,
        progressPercent,
        isCompleted: e.isCompleted,
      };
    });

    // 3. Portfolio projects
    const portfolioProjects = await prisma.portfolioProject.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // 4. Applications
    const applications = await prisma.application.findMany({
      where: { userId },
      include: { opportunity: true },
      orderBy: { appliedAt: 'desc' },
    });

    // 5. Dynamic Profile completion percentage calculation
    let completion = 20; // Base score for account creation
    if (user.avatar) completion += 20;
    if (user.bio) completion += 20;
    if (Array.isArray(user.skills) && user.skills.length > 0) completion += 20;
    if (portfolioProjects.length > 0) completion += 20;

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          ...user,
          profileCompletionPercent: completion,
        },
        stats: {
          totalEarned: user.totalEarned,
          enrolledTracksCount: enrollments.length,
          completedCoursesCount: enrollments.filter((e) => e.isCompleted).length,
          portfolioCount: portfolioProjects.length,
          applicationsCount: applications.length,
          activeApplicationsCount: applications.filter(
            (a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW'
          ).length,
        },
        learning: {
          enrollments: formattedEnrollments,
          completedCount: enrollments.filter((e) => e.isCompleted).length,
        },
        portfolio: {
          count: portfolioProjects.length,
          projects: portfolioProjects,
        },
        applications: {
          count: applications.length,
          list: applications.map((a) => ({
            id: a.id,
            opportunityId: a.opportunityId,
            title: a.opportunity.title,
            company: a.opportunity.company,
            logo: a.opportunity.logo,
            stipend: a.opportunity.stipend,
            type: a.opportunity.type,
            status: a.status,
            appliedAt: a.appliedAt,
          })),
        },
      },
    });
  })
);

export default router;
