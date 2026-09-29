/**
 * HerEarn - Database Models & Entity Schemas Definition
 * Task 3.3 Implementation
 */

export const ROLES = {
  LEARNER: 'LEARNER',
  EMPLOYER: 'EMPLOYER',
  ADMIN: 'ADMIN',
};

export const COURSE_LEVELS = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
};

export const GIG_TYPES = {
  MICRO_GIG: 'MICRO_GIG',
  REMOTE_INTERNSHIP: 'REMOTE_INTERNSHIP',
  FREELANCE: 'FREELANCE',
  FULL_TIME: 'FULL_TIME',
};

export const APPLICATION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  SHORTLISTED: 'SHORTLISTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

/**
 * 1. User Entity Schema
 */
export const UserModel = {
  name: 'User',
  fields: {
    id: { type: 'String', primaryKey: true, required: true },
    name: { type: 'String', required: true },
    email: { type: 'String', unique: true, required: true },
    passwordHash: { type: 'String', required: true },
    role: { type: 'Enum', enum: ROLES, default: ROLES.LEARNER },
    avatar: { type: 'String', required: false },
    phone: { type: 'String', required: false },
    location: { type: 'String', required: false },
    bio: { type: 'String', required: false },
    skills: { type: 'Array', itemType: 'String', default: [] },
    totalEarned: { type: 'Number', default: 0.0 },
    createdAt: { type: 'Date', default: () => new Date() },
    updatedAt: { type: 'Date', default: () => new Date() },
  },
};

/**
 * 2. SkillTrack Entity Schema
 */
export const SkillTrackModel = {
  name: 'SkillTrack',
  fields: {
    id: { type: 'String', primaryKey: true, required: true },
    title: { type: 'String', required: true },
    category: { type: 'String', required: true },
    icon: { type: 'String', required: true },
    duration: { type: 'String', required: true },
    level: { type: 'Enum', enum: COURSE_LEVELS, default: COURSE_LEVELS.BEGINNER },
    instructor: { type: 'String', required: true },
    description: { type: 'String', required: true },
    image: { type: 'String', required: true },
    createdAt: { type: 'Date', default: () => new Date() },
    updatedAt: { type: 'Date', default: () => new Date() },
  },
};

/**
 * 3. Lesson Entity Schema
 */
export const LessonModel = {
  name: 'Lesson',
  fields: {
    id: { type: 'String', primaryKey: true, required: true },
    trackId: { type: 'String', foreignKey: 'SkillTrack.id', required: true },
    title: { type: 'String', required: true },
    duration: { type: 'String', required: true },
    videoUrl: { type: 'String', required: true },
    summary: { type: 'String', required: true },
    keyTakeaways: { type: 'Array', itemType: 'String', default: [] },
    orderIndex: { type: 'Number', default: 0 },
  },
};

/**
 * 4. Enrollment / User Progress Entity Schema
 */
export const EnrollmentModel = {
  name: 'Enrollment',
  fields: {
    id: { type: 'String', primaryKey: true, required: true },
    userId: { type: 'String', foreignKey: 'User.id', required: true },
    trackId: { type: 'String', foreignKey: 'SkillTrack.id', required: true },
    completedLessonIds: { type: 'Array', itemType: 'String', default: [] },
    progressPercent: { type: 'Number', default: 0.0 },
    isCompleted: { type: 'Boolean', default: false },
    completedAt: { type: 'Date', required: false },
    lastAccessedAt: { type: 'Date', default: () => new Date() },
    createdAt: { type: 'Date', default: () => new Date() },
  },
};

/**
 * 5. PortfolioProject Entity Schema
 */
export const PortfolioProjectModel = {
  name: 'PortfolioProject',
  fields: {
    id: { type: 'String', primaryKey: true, required: true },
    userId: { type: 'String', foreignKey: 'User.id', required: true },
    title: { type: 'String', required: true },
    category: { type: 'String', required: true },
    description: { type: 'String', required: true },
    imageUrl: { type: 'String', required: true },
    projectUrl: { type: 'String', required: false },
    tags: { type: 'Array', itemType: 'String', default: [] },
    likesCount: { type: 'Number', default: 0 },
    verified: { type: 'Boolean', default: false },
    createdAt: { type: 'Date', default: () => new Date() },
    updatedAt: { type: 'Date', default: () => new Date() },
  },
};

/**
 * 6. Opportunity Entity Schema
 */
export const OpportunityModel = {
  name: 'Opportunity',
  fields: {
    id: { type: 'String', primaryKey: true, required: true },
    postedById: { type: 'String', foreignKey: 'User.id', required: true },
    title: { type: 'String', required: true },
    company: { type: 'String', required: true },
    logo: { type: 'String', required: false },
    stipend: { type: 'String', required: true },
    type: { type: 'Enum', enum: GIG_TYPES, default: GIG_TYPES.MICRO_GIG },
    category: { type: 'String', required: true },
    skillsRequired: { type: 'Array', itemType: 'String', default: [] },
    duration: { type: 'String', required: true },
    description: { type: 'String', required: true },
    deliverables: { type: 'Array', itemType: 'String', default: [] },
    verifiedClient: { type: 'Boolean', default: true },
    isOpen: { type: 'Boolean', default: true },
    applicantsCount: { type: 'Number', default: 0 },
    deadline: { type: 'Date', required: true },
    createdAt: { type: 'Date', default: () => new Date() },
    updatedAt: { type: 'Date', default: () => new Date() },
  },
};

/**
 * 7. Application Entity Schema
 */
export const ApplicationModel = {
  name: 'Application',
  fields: {
    id: { type: 'String', primaryKey: true, required: true },
    opportunityId: { type: 'String', foreignKey: 'Opportunity.id', required: true },
    userId: { type: 'String', foreignKey: 'User.id', required: true },
    coverNote: { type: 'String', required: true },
    portfolioProjectIds: { type: 'Array', itemType: 'String', default: [] },
    status: { type: 'Enum', enum: APPLICATION_STATUS, default: APPLICATION_STATUS.SUBMITTED },
    appliedAt: { type: 'Date', default: () => new Date() },
  },
};

/**
 * 8. PaymentTransaction Entity Schema
 */
export const PaymentTransactionModel = {
  name: 'PaymentTransaction',
  fields: {
    id: { type: 'String', primaryKey: true, required: true },
    userId: { type: 'String', foreignKey: 'User.id', required: true },
    opportunityId: { type: 'String', foreignKey: 'Opportunity.id', required: false },
    amount: { type: 'Number', required: true },
    currency: { type: 'String', default: 'INR' },
    type: { type: 'String', default: 'GIG_PAYOUT' },
    status: { type: 'String', default: 'COMPLETED' },
    transactionDate: { type: 'Date', default: () => new Date() },
  },
};
