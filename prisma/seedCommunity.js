import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const COMMUNITY_MEMBERS = [
  {
    name: 'Priya Patel',
    username: 'priya_uiux',
    email: 'priya.patel@herearn.org',
    role: 'LEARNER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    location: 'Ahmedabad, Gujarat',
    title: 'Lead UI/UX & Canva Brand Designer',
    bio: 'Passionate about crafting clean, human-centered mobile apps and branding. Completed Graphic Design track on HerEarn! Happy to review portfolios and collaborate.',
    skills: JSON.stringify(['UI/UX Design', 'Figma', 'Canva Pro', 'Brand Identity', 'Wireframing']),
    interests: JSON.stringify(['Design Systems', 'Micro-Gigs', 'Freelancing', 'Mentoring']),
    learningPath: 'Graphic Design with Canva',
    learningGoal: 'Design Agency Founder',
    skillPoints: 480,
    verified: true,
  },
  {
    name: 'Sneha Roy',
    username: 'sneha_shopify',
    email: 'sneha.roy@herearn.org',
    role: 'LEARNER',
    avatar: 'https://images.unsplash.com/photo-1580894732454-def939105436?auto=format&fit=crop&q=80&w=400',
    location: 'Kolkata, West Bengal',
    title: 'Shopify Store Builder & E-Commerce Expert',
    bio: 'Helped 6+ local boutiques launch their Shopify storefronts. Love product copywriting, inventory organization, and payment gateways. Let’s connect!',
    skills: JSON.stringify(['Shopify E-Commerce', 'Product Listings', 'Inventory Setup', 'Dropshipping', 'WhatsApp Business']),
    interests: JSON.stringify(['E-Commerce', 'D2C Brands', 'Remote Work', 'Financial Freedom']),
    learningPath: 'Shopify E-Commerce',
    learningGoal: 'Independent Shopify Consultant',
    skillPoints: 520,
    verified: true,
  },
  {
    name: 'Ritu Sengupta',
    username: 'ritu_writes',
    email: 'ritu.sengupta@herearn.org',
    role: 'LEARNER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    location: 'Bengaluru, Karnataka',
    title: 'SEO Content Strategist & Copywriter',
    bio: 'Storyteller with a love for high-ranking blog articles, Google Search Console, and keyword research. Balancing freelancing with motherhood.',
    skills: JSON.stringify(['SEO Content Writing', 'Keyword Research', 'Blog Copywriting', 'Google Docs', 'On-Page SEO']),
    interests: JSON.stringify(['Content Strategy', 'Blogging', 'Work From Home', 'Parenting & Tech']),
    learningPath: 'SEO Content Writing',
    learningGoal: 'Freelance Editorial Director',
    skillPoints: 460,
    verified: true,
  },
  {
    name: 'Meera Nair',
    username: 'meera_growth',
    email: 'meera.nair@herearn.org',
    role: 'LEARNER',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    location: 'Kochi, Kerala',
    title: 'Digital Marketing & Social Media Strategist',
    bio: 'Former school teacher transitioning into digital marketing. Loving Meta ad campaigns, ROAS optimization, and Canva storytelling.',
    skills: JSON.stringify(['Digital Marketing', 'Meta Ads', 'Instagram Growth', 'Canva Pro', 'Analytics']),
    interests: JSON.stringify(['Performance Marketing', 'Community Building', 'Social Strategy']),
    learningPath: 'Digital Marketing',
    learningGoal: 'Growth Marketing Lead',
    skillPoints: 390,
    verified: true,
  },
  {
    name: 'Diya Varma',
    username: 'diya_code',
    email: 'diya.varma@herearn.org',
    role: 'LEARNER',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    location: 'Pune, Maharashtra',
    title: 'Frontend React Developer & Open Source Fan',
    bio: 'Building accessible, fast web apps. Learning full-stack development while working on community client projects on HerEarn. Code with me!',
    skills: JSON.stringify(['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'Git & GitHub']),
    interests: JSON.stringify(['Frontend Web', 'Open Source', 'Hackathons', 'Tech Community']),
    learningPath: 'Frontend Development',
    learningGoal: 'Full-Stack Software Engineer',
    skillPoints: 610,
    verified: true,
  },
  {
    name: 'Tanvi Kulkarni',
    username: 'tanvi_art',
    email: 'tanvi.kulkarni@herearn.org',
    role: 'LEARNER',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    location: 'Mumbai, Maharashtra',
    title: 'Brand Illustrator & Visual Designer',
    bio: 'Illustrating stories for digital brands. Always curious about new color palettes, social templates, and creative freelancing.',
    skills: JSON.stringify(['Canva Pro', 'Digital Illustration', 'Logo Design', 'Social Media Templates', 'Visual Branding']),
    interests: JSON.stringify(['Graphic Art', 'Branding', 'Typography', 'Creative Entrepreneurship']),
    learningPath: 'Graphic Design with Canva',
    learningGoal: 'Creative Director',
    skillPoints: 350,
    verified: true,
  },
];

async function seed() {
  console.log('🌱 Starting Community & 1:1 Chat seeding...');
  const defaultPasswordHash = await bcrypt.hash('HerEarn2026!', 10);

  // 1. Create or update community seed users
  const createdSeedUsers = [];
  for (const m of COMMUNITY_MEMBERS) {
    const existing = await prisma.user.findUnique({ where: { email: m.email } });
    if (existing) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: m.name,
          username: m.username,
          avatar: m.avatar,
          location: m.location,
          title: m.title,
          bio: m.bio,
          skills: m.skills,
          interests: m.interests,
          learningPath: m.learningPath,
          learningGoal: m.learningGoal,
          skillPoints: m.skillPoints,
          verified: m.verified,
        },
      });
      createdSeedUsers.push(updated);
    } else {
      const created = await prisma.user.create({
        data: {
          ...m,
          passwordHash: defaultPasswordHash,
          status: 'Active',
          portfolioLinks: JSON.stringify([
            { label: 'Portfolio Showcase', url: 'https://herearn.vercel.app' },
            { label: 'LinkedIn', url: 'https://linkedin.com' },
          ]),
        },
      });
      createdSeedUsers.push(created);
    }
  }

  console.log(`✅ Seeded ${createdSeedUsers.length} community members.`);

  // 2. Fetch existing platform learners to establish friendly connections & starter chats
  const allUsers = await prisma.user.findMany();
  const primaryUsers = allUsers.filter((u) => !u.email.endsWith('@herearn.org'));

  const [priya, sneha, ritu, meera] = createdSeedUsers;

  for (const learner of primaryUsers) {
    if (!priya || !sneha) continue;

    // Connect with Priya Patel (ACCEPTED friend)
    let connPriya = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: learner.id, receiverId: priya.id },
          { senderId: priya.id, receiverId: learner.id },
        ],
      },
    });

    if (!connPriya) {
      connPriya = await prisma.connection.create({
        data: {
          senderId: priya.id,
          receiverId: learner.id,
          status: 'ACCEPTED',
        },
      });
    } else if (connPriya.status !== 'ACCEPTED') {
      await prisma.connection.update({
        where: { id: connPriya.id },
        data: { status: 'ACCEPTED' },
      });
    }

    // Connect with Sneha Roy (ACCEPTED friend)
    let connSneha = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: learner.id, receiverId: sneha.id },
          { senderId: sneha.id, receiverId: learner.id },
        ],
      },
    });

    if (!connSneha) {
      connSneha = await prisma.connection.create({
        data: {
          senderId: sneha.id,
          receiverId: learner.id,
          status: 'ACCEPTED',
        },
      });
    } else if (connSneha.status !== 'ACCEPTED') {
      await prisma.connection.update({
        where: { id: connSneha.id },
        data: { status: 'ACCEPTED' },
      });
    }

    // Connect with Ritu Sengupta (PENDING inbound request)
    let connRitu = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: learner.id, receiverId: ritu.id },
          { senderId: ritu.id, receiverId: learner.id },
        ],
      },
    });

    if (!connRitu) {
      await prisma.connection.create({
        data: {
          senderId: ritu.id,
          receiverId: learner.id,
          status: 'PENDING',
        },
      });
    }

    // Check if initial messages exist between Priya and learner
    const existingMsg = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId: priya.id, receiverId: learner.id },
          { senderId: learner.id, receiverId: priya.id },
        ],
      },
    });

    if (!existingMsg) {
      await prisma.message.create({
        data: {
          senderId: priya.id,
          receiverId: learner.id,
          content: `Hi ${learner.name.split(' ')[0]}! 👋 Welcome to the HerEarn Community. I saw you're working on building your digital skills. How are your lessons going?`,
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 4),
        },
      });

      await prisma.message.create({
        data: {
          senderId: learner.id,
          receiverId: priya.id,
          content: `Hey Priya! Thanks for reaching out. I'm practicing creating my first proof-of-work project!`,
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 2),
        },
      });

      await prisma.message.create({
        data: {
          senderId: priya.id,
          receiverId: learner.id,
          content: `That's great! Let me know if you want feedback on your Canva graphics or color palette. We're all in this together! 💖`,
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 15),
        },
      });
    }

    // Seed messages with Sneha
    const snehaMsg = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId: sneha.id, receiverId: learner.id },
          { senderId: learner.id, receiverId: sneha.id },
        ],
      },
    });

    if (!snehaMsg) {
      await prisma.message.create({
        data: {
          senderId: sneha.id,
          receiverId: learner.id,
          content: `Hello! If you ever need help with e-commerce product listings or Shopify micro-gigs, feel free to ask anytime! 🛍️✨`,
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 50),
        },
      });
    }
  }

  console.log('🎉 Community & 1:1 chat seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
