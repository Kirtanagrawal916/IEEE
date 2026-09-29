/**
 * HerEarn Database Seed Script
 * Pre-populates the database with realistic demonstration data:
 * - Demo Users (Learners and Employers) with hashed passwords
 * - 5 Skill Tracks with 4-5 bite-sized video lessons each
 * - 8 Opportunities (Micro-gigs and Remote Internships)
 * - Sample Portfolio Project and Enrollment with progress
 *
 * Conforms to Sections 10, 11, 12, 13 & 14 of the Implementation Plan.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting HerEarn database seed...');

  // 1. Clean existing records in reverse dependency order
  console.log('🧹 Cleaning existing records...');
  await prisma.paymentTransaction.deleteMany();
  await prisma.applicationProject.deleteMany();
  await prisma.application.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.portfolioProject.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.skillTrack.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users with Bcrypt Hashed Passwords
  console.log('👤 Seeding users...');
  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('Password123!', salt);

  const learnerUser = await prisma.user.create({
    data: {
      name: 'Ananya Sharma',
      email: 'ananya@herearn.org',
      passwordHash: defaultPasswordHash,
      role: 'LEARNER',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43210',
      location: 'Mumbai, India',
      bio: 'Aspiring digital marketer and content creator eager to learn, build high-impact campaigns, and earn independently.',
      skills: ['Social Media Marketing', 'Canva', 'Content Writing', 'SEO Basics'],
      totalEarned: 14500.0,
    },
  });

  const employerUser = await prisma.user.create({
    data: {
      name: 'Priya Mehta',
      email: 'priya.mehta@brandcraft.in',
      passwordHash: defaultPasswordHash,
      role: 'EMPLOYER',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98111 22334',
      location: 'Bangalore, India',
      bio: 'Founder at BrandCraft Agency. Passionate about empowering women freelancers with flexible, remote micro-gigs.',
      skills: ['Team Leadership', 'Brand Strategy', 'Client Management'],
      totalEarned: 0.0,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'HerEarn Admin',
      email: 'admin@herearn.org',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+91 99999 88888',
      location: 'New Delhi, India',
      bio: 'Platform administrator overseeing safety, mentorship tracks, and verified opportunities.',
      skills: ['Operations', 'Platform Safety', 'Mentorship'],
      totalEarned: 0.0,
    },
  });

  // 3. Create 5 Skill Tracks with Lessons (Section 13)
  console.log('📚 Seeding skill tracks and lessons...');

  // Track 1: Digital Marketing
  const trackMarketing = await prisma.skillTrack.create({
    data: {
      title: 'Digital Marketing & Social Media Strategy',
      category: 'Marketing',
      icon: 'Megaphone',
      duration: '4h 15m',
      level: 'BEGINNER',
      instructor: 'Sneha Roy (Senior Growth Strategist)',
      description: 'Master practical digital marketing: content creation, Instagram growth, paid ads strategy, and conversion metrics.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      lessons: {
        create: [
          {
            title: '1. Fundamentals of Digital Marketing in 2026',
            duration: '12m',
            videoUrl: 'https://www.youtube.com/embed/nU-IIXBWlS4',
            summary: 'Understand the marketing funnel, defining target personas, and choosing high-ROI organic channels.',
            keyTakeaways: ['Customer awareness stages', 'Organic vs paid traffic', 'Setting measurable campaign KPIs'],
            orderIndex: 1,
          },
          {
            title: '2. Crafting High-Engagement Content with Canva',
            duration: '15m',
            videoUrl: 'https://www.youtube.com/embed/OC-HjhWbQ30',
            summary: 'Step-by-step visual design tips for carousel posts, promotional banners, and compelling hooks.',
            keyTakeaways: ['Visual hierarchy & color theory', 'Designing templates for client batches', 'Exporting high-res assets'],
            orderIndex: 2,
          },
          {
            title: '3. Instagram Reels & TikTok Algorithms Demystified',
            duration: '18m',
            videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
            summary: 'How short-form video algorithms distribute content and how to write scripts that retain viewers.',
            keyTakeaways: ['3-second hook framework', 'Auditory retention cues', 'Call-to-action optimization'],
            orderIndex: 3,
          },
          {
            title: '4. Client Reporting: Analytics & ROI Presentation',
            duration: '14m',
            videoUrl: 'https://www.youtube.com/embed/DvwS7cV9GmQ',
            summary: 'How to turn numbers into client-ready monthly reports that justify your retainer fee.',
            keyTakeaways: ['Google Analytics 4 essentials', 'Cost per acquisition metrics', 'Presenting results to business owners'],
            orderIndex: 4,
          },
        ],
      },
    },
    include: { lessons: true },
  });

  // Track 2: Graphic Design
  const trackDesign = await prisma.skillTrack.create({
    data: {
      title: 'Graphic Design & Brand Identity for Freelancers',
      category: 'Design',
      icon: 'Palette',
      duration: '3h 45m',
      level: 'BEGINNER',
      instructor: 'Kavita Nair (Creative Director)',
      description: 'Learn modern logo design, brand kits, typography, and practical layout design for real clients.',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
      lessons: {
        create: [
          {
            title: '1. Color Theory and Typography Essentials',
            duration: '14m',
            videoUrl: 'https://www.youtube.com/embed/AvgCkHrcj90',
            summary: 'Learn how colors influence buying decisions and how to pair font families harmoniously.',
            keyTakeaways: ['60-30-10 color rule', 'Serif vs Sans-serif readability', 'Creating accessible palettes'],
            orderIndex: 1,
          },
          {
            title: '2. Designing Professional Brand Identity Kits',
            duration: '18m',
            videoUrl: 'https://www.youtube.com/embed/s24qY4s4XgU',
            summary: 'Build complete brand guideline sheets: logo variations, typography scale, and social assets.',
            keyTakeaways: ['Vector logo standards', 'Deliverable checklist for clients', 'Pricing your first branding gig'],
            orderIndex: 2,
          },
          {
            title: '3. Packaging and Marketing Collateral Layout',
            duration: '16m',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            summary: 'Create printable flyers, business cards, and digital brochure mockups.',
            keyTakeaways: ['Print margins & bleed rules', 'Mockup presentation techniques', 'File formats (CMYK vs RGB)'],
            orderIndex: 3,
          },
          {
            title: '4. Building a Freelance Client Design Portfolio',
            duration: '12m',
            videoUrl: 'https://www.youtube.com/embed/bJzb-Ey42a8',
            summary: 'Curating your best case studies to convert visitors into paying clients.',
            keyTakeaways: ['Case study storytelling', 'Before & After showcasing', 'Client testimonial placement'],
            orderIndex: 4,
          },
        ],
      },
    },
    include: { lessons: true },
  });

  // Track 3: Web Development
  const trackWeb = await prisma.skillTrack.create({
    data: {
      title: 'Modern Web Development with React & Tailwind',
      category: 'Tech',
      icon: 'Code',
      duration: '5h 30m',
      level: 'INTERMEDIATE',
      instructor: 'Ritu Sharma (Full-Stack Engineer)',
      description: 'Build fast, responsive web applications from scratch and deploy them to free production hosts.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      lessons: {
        create: [
          {
            title: '1. Modern HTML5, Semantic Elements & Accessibility',
            duration: '15m',
            videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU',
            summary: 'Semantic structure, ARIA accessibility attributes, and SEO foundation.',
            keyTakeaways: ['Semantic tags structure', 'Screen reader support', 'Meta tags for social sharing'],
            orderIndex: 1,
          },
          {
            title: '2. Tailwind CSS Styling & Mobile Responsive Layouts',
            duration: '22m',
            videoUrl: 'https://www.youtube.com/embed/dFgzHOX84xQ',
            summary: 'Master Flexbox, Grid, breakpoints, and dynamic dark mode styling.',
            keyTakeaways: ['Utility-first mindset', 'Fluid typography & spacing', 'Dark mode with CSS variables'],
            orderIndex: 2,
          },
          {
            title: '3. React Components, Props, and State Management',
            duration: '25m',
            videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
            summary: 'Build reusable UI components, manage useState/useEffect, and handle form events.',
            keyTakeaways: ['Component lifecycle', 'Lifting state up', 'Controlled inputs validation'],
            orderIndex: 3,
          },
          {
            title: '4. Deploying Live Web Apps to Vercel and Netlify',
            duration: '12m',
            videoUrl: 'https://www.youtube.com/embed/22R_7pP_u38',
            summary: 'Git workflow, environment variables setup, and continuous deployment.',
            keyTakeaways: ['Git commit best practices', 'Setting production env variables', 'Custom domain mapping'],
            orderIndex: 4,
          },
        ],
      },
    },
    include: { lessons: true },
  });

  // Track 4: Content & Social Media
  await prisma.skillTrack.create({
    data: {
      title: 'Content Writing & Copywriting for Online Brands',
      category: 'Content',
      icon: 'Feather',
      duration: '3h 10m',
      level: 'BEGINNER',
      instructor: 'Ayesha Khan (Freelance Copywriter)',
      description: 'Write persuasive website copy, email newsletters, and SEO blog articles that drive conversions.',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
      lessons: {
        create: [
          {
            title: '1. Copywriting vs Content Writing: Core Differences',
            duration: '10m',
            videoUrl: 'https://www.youtube.com/embed/nU-IIXBWlS4',
            summary: 'Understand when to inform vs when to persuade the reader into taking immediate action.',
            keyTakeaways: ['PAS (Problem-Agitate-Solution) formula', 'AIDA framework', 'Writing headlines that hook'],
            orderIndex: 1,
          },
          {
            title: '2. SEO Blog Writing That Ranks on Google',
            duration: '18m',
            videoUrl: 'https://www.youtube.com/embed/AvgCkHrcj90',
            summary: 'Keyword research, search intent, internal linking, and readable formatting.',
            keyTakeaways: ['Search intent categories', 'On-page SEO checklists', 'Skimmable article layouts'],
            orderIndex: 2,
          },
          {
            title: '3. Email Newsletters & High-Converting Sequences',
            duration: '15m',
            videoUrl: 'https://www.youtube.com/embed/OC-HjhWbQ30',
            summary: 'Welcome sequences, subject line testing, and open-rate optimization.',
            keyTakeaways: ['Subject line power words', 'Personalized tone of voice', 'Call-to-action button placement'],
            orderIndex: 3,
          },
          {
            title: '4. Pitching Clients & Writing Proposals That Win',
            duration: '14m',
            videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
            summary: 'Cold outreach templates, sample portfolio links, and closing retainer contracts.',
            keyTakeaways: ['Client research before pitching', 'Value-first cold email template', 'Setting milestone deliverables'],
            orderIndex: 4,
          },
        ],
      },
    },
  });

  // Track 5: Business & Entrepreneurship
  await prisma.skillTrack.create({
    data: {
      title: 'Freelancing Fundamentals & Micro-Business Setup',
      category: 'Business',
      icon: 'Briefcase',
      duration: '2h 50m',
      level: 'BEGINNER',
      instructor: 'Deepa Verma (Startup Advisor)',
      description: 'Turn your skills into sustainable freelance income, invoice clients, and manage contracts safely.',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
      lessons: {
        create: [
          {
            title: '1. Packaging Your Skills into Irresistible Offers',
            duration: '12m',
            videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
            summary: 'Defining your freelance niche and pricing based on value rather than trading hours.',
            keyTakeaways: ['Tiered service packages', 'Value-based pricing basics', 'Defining scope boundaries'],
            orderIndex: 1,
          },
          {
            title: '2. Client Contracts, Deposits & Scope Protection',
            duration: '16m',
            videoUrl: 'https://www.youtube.com/embed/22R_7pP_u38',
            summary: 'Standard agreements, milestone payment terms, and avoiding scope creep.',
            keyTakeaways: ['50% advance deposit rule', 'Revision limits in writing', 'Copyright release upon final pay'],
            orderIndex: 2,
          },
          {
            title: '3. Invoicing, Bookkeeping & Tax Basics for Freelancers',
            duration: '14m',
            videoUrl: 'https://www.youtube.com/embed/s24qY4s4XgU',
            summary: 'Creating GST-compliant invoices, tracking business expenses, and organizing finances.',
            keyTakeaways: ['Invoice templates essentials', 'Separate business bank accounts', 'Quarterly tax estimations'],
            orderIndex: 3,
          },
        ],
      },
    },
  });

  // 4. Seed 8 Opportunities (Section 13)
  console.log('💼 Seeding opportunities...');

  const opp1 = await prisma.opportunity.create({
    data: {
      postedById: employerUser.id,
      title: 'Social Media Content Creator (Beauty & Wellness Brand)',
      company: 'Aura Botanicals',
      logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&auto=format&fit=crop&q=80',
      stipend: '₹12,000 / month',
      type: 'REMOTE_INTERNSHIP',
      category: 'Marketing',
      skillsRequired: ['Canva', 'Instagram Reels', 'Copywriting', 'Content Scheduling'],
      duration: '3 Months',
      description: 'We are seeking a creative content creator to produce 15 Instagram Reels and 20 carousel posts per month. Remote, flexible hours, perfect for graduates of the Digital Marketing track.',
      deliverables: ['Weekly content calendar', '15 short-form video reels', 'Monthly analytics performance review'],
      verifiedClient: true,
      isOpen: true,
      applicantsCount: 3,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  });

  const opp2 = await prisma.opportunity.create({
    data: {
      postedById: employerUser.id,
      title: 'Brand Identity & Logo Redesign for Organic Food Store',
      company: 'GreenRoot Organics',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
      stipend: '₹8,500 (Fixed Project)',
      type: 'MICRO_GIG',
      category: 'Design',
      skillsRequired: ['Logo Design', 'Typography', 'Figma', 'Brand Guidelines'],
      duration: '2 Weeks',
      description: 'Create a modern, earthy logo and brand guide (color palette, typography, social media templates) for our expanding organic grocery store.',
      deliverables: ['Primary & secondary logo marks', 'Full brand style guide PDF', '10 social media post templates'],
      verifiedClient: true,
      isOpen: true,
      applicantsCount: 5,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.opportunity.create({
    data: {
      postedById: employerUser.id,
      title: 'Junior Frontend Developer (React + Tailwind)',
      company: 'FemmeTech Innovations',
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80',
      stipend: '₹18,000 / month',
      type: 'REMOTE_INTERNSHIP',
      category: 'Tech',
      skillsRequired: ['React', 'Tailwind CSS', 'Git', 'REST APIs'],
      duration: '6 Months',
      description: 'Join our mission-driven tech team building accessibility tools. You will implement modular UI components and connect frontend views with backend REST endpoints.',
      deliverables: ['Responsive UI components', 'API integration tests', 'Weekly code reviews'],
      verifiedClient: true,
      isOpen: true,
      applicantsCount: 8,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.opportunity.create({
    data: {
      postedById: employerUser.id,
      title: 'SEO Blog Writer for EdTech Portal',
      company: 'EduSpark Global',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      stipend: '₹6,000 (8 Articles)',
      type: 'MICRO_GIG',
      category: 'Content',
      skillsRequired: ['Content Writing', 'SEO', 'Keyword Research'],
      duration: '3 Weeks',
      description: 'Write 8 engaging, SEO-optimized articles (1,200 words each) on modern career skills and upskilling resources for college students.',
      deliverables: ['8 SEO-optimized blog posts', 'Meta titles and descriptions', 'Royalty-free image suggestions'],
      verifiedClient: true,
      isOpen: true,
      applicantsCount: 2,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.opportunity.create({
    data: {
      postedById: employerUser.id,
      title: 'E-commerce Product Photo Retoucher & Banner Designer',
      company: 'Silk & Threads Boutique',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&auto=format&fit=crop&q=80',
      stipend: '₹7,500 (Fixed Project)',
      type: 'FREELANCE',
      category: 'Design',
      skillsRequired: ['Photoshop', 'Canva', 'Photo Editing', 'Banner Design'],
      duration: '10 Days',
      description: 'Retouch 40 ethnic wear product photos and produce 5 promotional hero banners for our upcoming festive sale.',
      deliverables: ['40 cleaned product images', '5 festive website banners'],
      verifiedClient: true,
      isOpen: true,
      applicantsCount: 4,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.opportunity.create({
    data: {
      postedById: employerUser.id,
      title: 'Community Manager & Support Specialist',
      company: 'SheSparks Network',
      logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
      stipend: '₹10,000 / month',
      type: 'REMOTE_INTERNSHIP',
      category: 'Business',
      skillsRequired: ['Communication', 'Community Moderation', 'Customer Support'],
      duration: '4 Months',
      description: 'Moderate our community group, welcome new members, host weekly Q&A threads, and compile member feedback.',
      deliverables: ['Daily discussion moderation', 'Weekly community recap post', 'Member onboarding assistance'],
      verifiedClient: true,
      isOpen: true,
      applicantsCount: 6,
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.opportunity.create({
    data: {
      postedById: employerUser.id,
      title: 'Email Marketing & Newsletter Strategist',
      company: 'Zenith Wellness Hub',
      logo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=100&auto=format&fit=crop&q=80',
      stipend: '₹9,000 / month',
      type: 'FREELANCE',
      category: 'Marketing',
      skillsRequired: ['Email Copywriting', 'Mailchimp', 'Lead Generation'],
      duration: '2 Months',
      description: 'Design and draft weekly newsletters, set up a 4-part automated welcome email sequence, and report open/click metrics.',
      deliverables: ['4-email automated welcome sequence', '8 weekly newsletter broadcasts', 'Monthly engagement report'],
      verifiedClient: true,
      isOpen: true,
      applicantsCount: 1,
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.opportunity.create({
    data: {
      postedById: employerUser.id,
      title: 'Landing Page Developer for NGO Campaign',
      company: 'Udaan Foundation',
      logo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100&auto=format&fit=crop&q=80',
      stipend: '₹11,000 (Fixed Project)',
      type: 'MICRO_GIG',
      category: 'Tech',
      skillsRequired: ['HTML/CSS', 'Tailwind', 'Responsive Design'],
      duration: '2 Weeks',
      description: 'Build a mobile-friendly, accessible 3-page website for an educational fundraiser initiative. Clean code and fast load time required.',
      deliverables: ['3-page responsive static website', 'Donation pledge form UI', 'Deployment to Netlify/Vercel'],
      verifiedClient: true,
      isOpen: true,
      applicantsCount: 3,
      deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
  });

  // 5. Seed Learner Demo Portfolio Project (Section 10 & 12)
  console.log('🎨 Seeding sample portfolio project...');
  const portfolio1 = await prisma.portfolioProject.create({
    data: {
      userId: learnerUser.id,
      title: 'Organic Tea Brand Instagram Launch Campaign',
      category: 'Marketing',
      description: 'Planned and designed a 30-day social media launch for a local artisan tea brand, achieving 4,200 organic impressions and 18% engagement.',
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
      projectUrl: 'https://instagram.com/sample_tea_brand',
      tags: ['Social Media', 'Canva', 'Content Strategy'],
      likesCount: 24,
      verified: true,
    },
  });

  // 6. Seed Enrollment and Normalized Lesson Progress (Section 11)
  console.log('📈 Seeding demo enrollment and progress...');
  const enrolledTrack = trackMarketing;
  const marketingLessons = trackMarketing.lessons;

  // Mark first 2 lessons as completed
  await prisma.lessonProgress.create({
    data: {
      userId: learnerUser.id,
      lessonId: marketingLessons[0].id,
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: learnerUser.id,
      lessonId: marketingLessons[1].id,
    },
  });

  // Create enrollment with 50% calculated progress
  await prisma.enrollment.create({
    data: {
      userId: learnerUser.id,
      trackId: enrolledTrack.id,
      progressPercent: 50.0,
      isCompleted: false,
    },
  });

  // 7. Seed Sample Application with Attached Portfolio Project (Section 12)
  console.log('📝 Seeding sample application...');
  const sampleApp = await prisma.application.create({
    data: {
      opportunityId: opp1.id,
      userId: learnerUser.id,
      coverNote: 'Hello! I completed the Digital Marketing track on HerEarn with 50%+ progress and built a real Instagram launch campaign for an artisan tea brand. I would love to bring this aesthetic to Aura Botanicals!',
      status: 'SUBMITTED',
    },
  });

  await prisma.applicationProject.create({
    data: {
      applicationId: sampleApp.id,
      projectId: portfolio1.id,
    },
  });

  // 8. Seed Sample Mock Payment Payout (Section 10)
  console.log('💳 Seeding sample payment payout...');
  await prisma.paymentTransaction.create({
    data: {
      userId: learnerUser.id,
      amount: 14500.0,
      currency: 'INR',
      type: 'GIG_PAYOUT',
      status: 'COMPLETED',
    },
  });

  console.log('✅ HerEarn database seeded successfully!');
  console.log(`
Demo Accounts:
- Learner:  ananya@herearn.org  (Password: Password123!)
- Employer: priya.mehta@brandcraft.in (Password: Password123!)
- Admin:    admin@herearn.org   (Password: Password123!)
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
