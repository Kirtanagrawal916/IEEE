import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding HerEarn database...');

  // 1. Seed Demo User
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'ananya@herearn.org' },
    update: {},
    create: {
      name: 'Ananya Sharma',
      email: 'ananya@herearn.org',
      passwordHash,
      role: 'LEARNER',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      location: 'Jaipur, Rajasthan',
      bio: 'Aspiring Digital Marketer & Graphic Designer passionate about helping local artisan businesses thrive.',
      skills: JSON.stringify(['Digital Marketing', 'Canva Design', 'Social Media Strategy', 'Shopify']),
      totalEarned: 14500.0,
    },
  });

  console.log('Created user:', demoUser.email);

  // 2. Seed Skill Tracks & Lessons
  const track1 = await prisma.skillTrack.create({
    data: {
      title: 'Digital Marketing & Social Media',
      category: 'Marketing',
      icon: 'Megaphone',
      duration: '4 Hours • 5 Lessons',
      level: 'Beginner to Pro',
      instructor: 'Meera Nair (Senior Growth Marketer)',
      description: 'Learn to manage social media accounts for small businesses, run Instagram campaigns, and create high-converting graphics.',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600',
      lessons: {
        create: [
          {
            title: 'Lesson 1: Social Media Basics for Local Businesses',
            duration: '15 min',
            videoUrl: 'https://www.youtube.com/embed/nU-IIXBWlS4',
            summary: 'Understand how Instagram & WhatsApp Business help small stores reach local customers.',
            keyTakeaways: JSON.stringify(['Setting up a Professional Profile', 'Targeting local audience', 'Content pillars']),
            orderIndex: 1,
          },
          {
            title: 'Lesson 2: Designing Eye-Catching Posts using Canva',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/un50Bs4BvZ8',
            summary: 'Step-by-step guide to choosing brand colors, fonts, and crafting product promo banners.',
            keyTakeaways: JSON.stringify(['Color theory', 'Canva templates', 'Exporting high-res banners']),
            orderIndex: 2,
          },
          {
            title: 'Lesson 3: Writing Captions & Using Hashtags that Convert',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/4y_f0L6J-uQ',
            summary: 'Mastering hooks, storytelling, call-to-action (CTA), and hyper-local hashtags.',
            keyTakeaways: JSON.stringify(['AIDA formula', 'Hashtag strategy', 'WhatsApp CTA links']),
            orderIndex: 3,
          },
          {
            title: 'Lesson 4: Running Your First ₹500 Meta Ad Campaign',
            duration: '30 min',
            videoUrl: 'https://www.youtube.com/embed/3Q95b6XmXn8',
            summary: 'Learn how to target local customers near a boutique, bakery, or handicraft shop.',
            keyTakeaways: JSON.stringify(['Meta Ads Manager setup', 'Location targeting', 'Tracking lead conversions']),
            orderIndex: 4,
          },
          {
            title: 'Capstone Project: Submit Your Client Marketing Plan',
            duration: '45 min',
            videoUrl: 'https://www.youtube.com/embed/VpXJ27p2Wlg',
            summary: 'Build a complete 1-week sample Instagram calendar for a local boutique to showcase in your portfolio.',
            keyTakeaways: JSON.stringify(['7-day content schedule', 'Sample Instagram posts', 'Publishing portfolio project']),
            orderIndex: 5,
          },
        ],
      },
    },
  });

  const track2 = await prisma.skillTrack.create({
    data: {
      title: 'Graphic Design & Brand Asset Creation',
      category: 'Design',
      icon: 'Palette',
      duration: '5 Hours • 4 Lessons',
      level: 'Beginner',
      instructor: 'Ritu Sengupta (Creative Director)',
      description: 'Create logos, flyers, product packaging labels, and promotional posters for e-commerce and retail brands.',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600',
      lessons: {
        create: [
          {
            title: 'Lesson 1: Introduction to Graphic Design Fundamentals',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/YqQx75OPRa0',
            summary: 'Learn layout, alignment, typography, and visual hierarchy principles.',
            keyTakeaways: JSON.stringify(['Visual balance', 'Typography rules', 'Color psychology']),
            orderIndex: 1,
          },
          {
            title: 'Lesson 2: Crafting Brand Logos & Style Guides',
            duration: '30 min',
            videoUrl: 'https://www.youtube.com/embed/2_Yn127tG_I',
            summary: 'How to design memorable minimalist logos for small enterprises.',
            keyTakeaways: JSON.stringify(['Vector design concepts', 'Iconography selection', 'Exporting SVG & PNG']),
            orderIndex: 2,
          },
        ],
      },
    },
  });

  console.log('Created tracks:', track1.title, track2.title);

  // 3. Seed Opportunities
  await prisma.opportunity.createMany({
    data: [
      {
        title: 'Social Media Manager for Organic Spices Brand',
        company: 'Desi Flavors Handcrafted',
        logo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=150',
        stipend: '₹8,000 / month',
        type: 'Remote Part-time',
        category: 'Marketing',
        skillsRequired: JSON.stringify(['Digital Marketing', 'Canva Design', 'Instagram Management']),
        duration: '3 Months',
        description: 'Looking for a skilled woman creator to manage our Instagram page, post 4 posts per week, create Canva graphics, and reply to customer DMs.',
        deliverables: JSON.stringify(['16 Instagram posts/month', 'Weekly performance report', 'DM customer support']),
        verifiedClient: true,
        isOpen: true,
        applicantsCount: 14,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Canva Banner & Flyer Designer for Event',
        company: 'Women Entrepreneurship Summit',
        logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=150',
        stipend: '₹3,500 (Project Flat)',
        type: 'Micro-Gig',
        category: 'Design',
        skillsRequired: JSON.stringify(['Canva Design', 'Graphic Design', 'Banner Design']),
        duration: '1 Week',
        description: 'Need 5 digital banners for social media promotion and 1 printable PDF flyer for an upcoming women founders event.',
        deliverables: JSON.stringify(['5 Social Media Banners', '1 Print-ready PDF Brochure']),
        verifiedClient: true,
        isOpen: true,
        applicantsCount: 8,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Shopify Product Catalog Assistant',
        company: 'KalaKriti Handloom Collective',
        logo: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=150',
        stipend: '₹12,000 / month',
        type: 'Remote Internship',
        category: 'Business',
        skillsRequired: JSON.stringify(['Shopify', 'E-Commerce', 'Data Entry']),
        duration: '2 Months',
        description: 'Help our artisan collective upload new saree & dupatta collections onto Shopify, write clear product descriptions, and tag inventory.',
        deliverables: JSON.stringify(['Upload 80+ catalog items', 'Write SEO product tags']),
        verifiedClient: true,
        isOpen: true,
        applicantsCount: 19,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // 4. Seed User Portfolio Projects
  await prisma.portfolioProject.create({
    data: {
      userId: demoUser.id,
      title: '7-Day Instagram Growth Strategy for CraftBoutique Jaipur',
      category: 'Marketing',
      description: 'Designed 7 high-engagement posts, story templates, and a Reels calendar for a local handloom store.',
      imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600',
      tags: JSON.stringify(['Canva', 'Instagram Strategy', 'Local Business']),
      likesCount: 42,
      verified: true,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
