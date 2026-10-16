import express from 'express';
import { prisma } from '../config/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Curated Showcase Seed Data for Bootstrap
export const CURATED_PROJECTS = [
  {
    title: 'Luxe Ayurvedic Skincare Brand Identity & Eco-Packaging System',
    category: 'Design & Branding',
    description: 'Complete visual identity crafted for an organic cosmetics startup in Jaipur. Developed custom brand marks, earthy botanical color palettes, 8 bottle label variations, and print-ready carton mockups in Canva Pro and Illustrator.',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=1000',
    projectUrl: 'https://dribbble.com/shots/ayur-botanics',
    tags: ['Canva Pro', 'Brand Identity', 'Packaging', 'Typography', 'Illustrator'],
    likesCount: 142,
    verified: true,
    authorName: 'Priya Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    location: 'Jaipur, Rajasthan',
    impact: '⭐⭐⭐⭐⭐ 5.0 Rating • 8 Print Deliverables',
    deliverables: [
      'Custom vector logo package (SVG, PNG, PDF)',
      'Brand style guide (color palettes, font pairings, spacing)',
      '8 Cosmetic label dielines with ingredient layouts',
      'Sustainable kraft box 3D mockup renders'
    ],
    toolsUsed: ['Canva Pro', 'Adobe Illustrator', 'Photoshop Mockups'],
    clientTestimonial: 'Priya took our family herbal store and turned it into an upscale national boutique brand. Our wholesale orders doubled within a month!'
  },
  {
    title: 'Viral Instagram Reel Strategy & 30-Day Growth Funnel for Handloom Apparel',
    category: 'Social Media & Growth',
    description: 'End-to-end content production and 12 aesthetic transition Reels for a Banarasi saree artisan house. Generated over 185,000 views and 420 direct WhatsApp purchase inquiries with zero paid ad budget.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000',
    projectUrl: 'https://instagram.com/desi_weaves',
    tags: ['Instagram Reels', 'Content Strategy', 'Video Editing', 'Meta Ads', 'Growth'],
    likesCount: 198,
    verified: true,
    authorName: 'Ananya Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    location: 'Surat, Gujarat',
    impact: '📈 +185K Organic Views • 420 WhatsApp Orders',
    deliverables: [
      '30-Day storytelling & viral trend content calendar',
      '12 High-definition transition Reels with audio hooks',
      'Captions & hyper-local hashtag vault',
      'Automated WhatsApp quick-reply DM template system'
    ],
    toolsUsed: ['CapCut', 'Canva', 'Meta Business Suite', 'WhatsApp Business'],
    clientTestimonial: 'Ananya\'s Reels went viral in our state. We sold out two full collections of Chanderi silk sarees in under 48 hours!'
  },
  {
    title: 'High-Converting Shopify Storefront & Mobile UX for Artisan Ceramics',
    category: 'E-Commerce & Shopify',
    description: 'Transformed a slow artisan pottery site into a mobile-first Shopify boutique. Structured multi-tier collections, one-click checkout, automated cart recovery emails, and local currency support.',
    imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=1000',
    projectUrl: 'https://craft-living.myshopify.com',
    tags: ['Shopify', 'E-Commerce', 'UX Design', 'Klaviyo', 'Product Catalog'],
    likesCount: 126,
    verified: true,
    authorName: 'Ritu Sengupta',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    location: 'Kolkata, West Bengal',
    impact: '🛒 2.8x Checkout Conversion • 99% Mobile Score',
    deliverables: [
      'Customized responsive Shopify theme layout',
      'Catalog setup for 80+ handcrafted ceramic items',
      '3 Automated Klaviyo email flows (abandoned cart, welcome)',
      'Razorpay payment gateway & WhatsApp order tracking'
    ],
    toolsUsed: ['Shopify Liquid', 'Figma', 'Klaviyo', 'Canva'],
    clientTestimonial: 'Our online orders jumped from 3 per week to over 35! Ritu created an intuitive, gorgeous store that customers adore.'
  },
  {
    title: 'Interactive Artisan Marketplace Web App & Order Portal',
    category: 'Web & Fullstack',
    description: 'Fullstack web platform connecting rural women weaving collectives with wholesale buyers. Features instant quote generation, real-time inventory tracking, and responsive design across all devices.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
    projectUrl: 'https://github.com/herearn/artisan-marketplace',
    tags: ['React', 'Tailwind CSS', 'JavaScript', 'REST APIs', 'Node.js'],
    likesCount: 215,
    verified: true,
    authorName: 'Sneha Roy',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    location: 'Bengaluru, Karnataka',
    impact: '⚡ 99+ Lighthouse Score • Zero Lag UI',
    deliverables: [
      'Modular React 19 UI component architecture',
      'Dynamic wholesale price calculator and invoice generation',
      'Multi-language support for rural cooperative coordinators',
      'Full documentation & deployment guide'
    ],
    toolsUsed: ['React', 'Tailwind CSS', 'Express', 'Prisma'],
    clientTestimonial: 'Sneha built a tool that our cooperative now uses daily to manage 45 weaver groups. Exceptionally clean code and design.'
  },
  {
    title: 'D2C Wellness Brand Storytelling & Email Marketing Funnel',
    category: 'Copywriting & Content',
    description: 'Wrote a 5-part emotional email sequence, packaging micro-copy, and website homepage copy for an ethical cold-pressed oil brand. Blended heritage founder storytelling with compelling science-backed nutritional proof.',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000',
    projectUrl: 'https://medium.com/@meera/cold-pressed-story',
    tags: ['Copywriting', 'Email Marketing', 'SEO Content', 'Storytelling', 'Brand Voice'],
    likesCount: 94,
    verified: true,
    authorName: 'Meera Nair',
    authorAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200',
    location: 'Kochi, Kerala',
    impact: '💌 48.2% Email Open Rate • 16.5% CTR',
    deliverables: [
      '5-Stage welcome automation email series',
      'Conversion-focused homepage hero copy & value props',
      '6 Search-engine optimized blog guides',
      'Brand tone of voice guide for customer service'
    ],
    toolsUsed: ['Google Docs', 'Notion', 'Klaviyo', 'SurferSEO'],
    clientTestimonial: 'Meera\'s words gave our brand a soul. Customers constantly reply to our emails saying how touched they were by our story.'
  },
  {
    title: 'Gourmet Cloud Bakery & Patisserie Mobile App Design System',
    category: 'Design & Branding',
    description: 'Designed 26 interactive mobile screens in Figma for a women-led gourmet cloud bakery app. Features dark-mode elegance, dietary filter tags, custom cake customizer, and seamless order dispatch tracking.',
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000',
    projectUrl: 'https://figma.com/@diya/cloud-bakery-ui',
    tags: ['Figma', 'UI/UX', 'Mobile App', 'Design System', 'Prototyping'],
    likesCount: 167,
    verified: true,
    authorName: 'Diya Varma',
    authorAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200',
    location: 'Mumbai, Maharashtra',
    impact: '🎨 26 Production Screens • Tested with 45 Users',
    deliverables: [
      'Complete Figma component design system & typography tokens',
      'Interactive clickable prototype for customer ordering flow',
      'Baker kitchen dashboard tablet view',
      'Developer handoff documentation with iOS/Android assets'
    ],
    toolsUsed: ['Figma', 'FigJam', 'Adobe Illustrator'],
    clientTestimonial: 'Diya\'s UX was so thorough that our development team finished building the mobile app two weeks ahead of schedule!'
  },
  {
    title: 'Bridal Studio Meta Ads Campaign & ₹18 Cost-Per-Lead Engine',
    category: 'Social Media & Growth',
    description: 'Architected high-ROI Facebook and Instagram lead generation ads for a bridal mehndi artist studio. Implemented geographic pin-code targeting, lookalike wedding audiences, and video testimonial ads.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    projectUrl: 'https://herearn.org/case-studies/bridal-ads',
    tags: ['Meta Ads', 'Lead Generation', 'Digital Marketing', 'Local Business', 'Analytics'],
    likesCount: 88,
    verified: true,
    authorName: 'Kavita Reddy',
    authorAvatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=200',
    location: 'Hyderabad, Telangana',
    impact: '🎯 ₹18 Cost/Lead • ₹52,000 Client Bookings',
    deliverables: [
      'Campaign setup in Meta Ads Manager with pixel tracking',
      '6 Carousel ad graphics and video variations',
      'Custom instant form with automated lead notification to phone',
      'Bi-weekly ROAS optimization report'
    ],
    toolsUsed: ['Meta Ads Manager', 'Canva', 'Google Sheets', 'Zapier'],
    clientTestimonial: 'Kavita completely booked our bridal dates for the entire wedding season within three weeks of starting ads!'
  },
  {
    title: 'Eco-Friendly Stationery Catalog Optimization & On-Page SEO',
    category: 'E-Commerce & Shopify',
    description: 'Revamped 110 product titles, meta descriptions, image alt tags, and collections for a plantable seed-paper stationery brand, driving page 1 organic rankings on Google for eco gifting keywords.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
    projectUrl: 'https://plantable-stationery.com',
    tags: ['E-Commerce', 'SEO Optimization', 'Shopify', 'Data Entry', 'Catalog'],
    likesCount: 105,
    verified: true,
    authorName: 'Tanvi Mehta',
    authorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200',
    location: 'Ahmedabad, Gujarat',
    impact: '🔍 Page 1 Google Rank • 110 SKUs Optimized',
    deliverables: [
      '110 High-converting product titles and SEO descriptions',
      'Hierarchical collection taxonomy and internal linking',
      'Image compression and WebP alt-text indexing',
      'Structured data schema markup for rich Google snippets'
    ],
    toolsUsed: ['Shopify Admin', 'Ahrefs', 'Google Search Console'],
    clientTestimonial: 'Tanvi\'s work gave us consistent organic search traffic that now accounts for 40% of our daily revenue without running ads.'
  }
];

// Helper to auto-seed projects if database has fewer than 2
async function ensureSeededProjects() {
  try {
    const count = await prisma.portfolioProject.count();
    if (count < 2) {
      let defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            name: 'Ananya Sharma',
            username: 'ananya',
            email: 'ananya@herearn.org',
            passwordHash: 'dummy_hash',
            role: 'LEARNER',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
            location: 'Jaipur, Rajasthan',
            bio: 'Aspiring Digital Marketer & Graphic Designer passionate about helping local artisan businesses thrive.',
          }
        });
      }

      for (const p of CURATED_PROJECTS) {
        const existing = await prisma.portfolioProject.findFirst({
          where: { title: p.title }
        });
        if (!existing) {
          await prisma.portfolioProject.create({
            data: {
              userId: defaultUser.id,
              title: p.title,
              category: p.category,
              description: p.description,
              imageUrl: p.imageUrl,
              projectUrl: p.projectUrl,
              tags: JSON.stringify(p.tags),
              likesCount: p.likesCount,
              verified: p.verified,
            }
          });
        }
      }
    }
  } catch (err) {
    console.warn('[Portfolio] Auto-seed notice:', err.message);
  }
}

// GET /api/portfolio/stats - Community showcase metrics
router.get('/stats', async (req, res) => {
  try {
    await ensureSeededProjects();
    const totalProjects = await prisma.portfolioProject.count();
    const projects = await prisma.portfolioProject.findMany({
      select: { likesCount: true, category: true, verified: true }
    });

    const totalLikes = projects.reduce((acc, p) => acc + (p.likesCount || 0), 0);
    const verifiedCount = projects.filter(p => p.verified).length;
    
    // Category distribution
    const categoryCounts = {};
    projects.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalProjects,
        totalLikes,
        verifiedCount,
        verifiedPercentage: totalProjects > 0 ? Math.round((verifiedCount / totalProjects) * 100) : 100,
        totalClientPayouts: '₹28,40,000+',
        categories: categoryCounts,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch portfolio stats', error: error.message });
  }
});

// GET /api/portfolio/me or /api/portfolio/mine
const getMyProjectsHandler = async (req, res) => {
  try {
    const projects = await prisma.portfolioProject.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const formattedProjects = projects.map((p) => {
      let tags = [];
      try {
        tags = typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []);
      } catch {
        tags = [p.category];
      }
      return {
        ...p,
        tags,
        likes: p.likesCount,
      };
    });

    res.json({ success: true, projects: formattedProjects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user portfolio', error: error.message });
  }
};

router.get('/me', authMiddleware, getMyProjectsHandler);
router.get('/mine', authMiddleware, getMyProjectsHandler);
router.get('/projects/mine', authMiddleware, getMyProjectsHandler);

// GET /api/portfolio (Public Gallery with category, search & sort)
router.get('/', async (req, res) => {
  try {
    await ensureSeededProjects();

    const { category, search, sort } = req.query;

    const where = {};
    if (category && category !== 'All' && category !== 'all') {
      where.category = { contains: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'trending' || sort === 'popular') {
      orderBy = { likesCount: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const projects = await prisma.portfolioProject.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatar: true, location: true, username: true } },
      },
      orderBy,
    });

    // If query resulted in 0 matches and no filter was applied, fallback to curated list
    let listToReturn = projects;
    if (listToReturn.length === 0 && (!category || category === 'All') && !search) {
      listToReturn = CURATED_PROJECTS.map((p, idx) => ({
        id: `curated-${idx + 1}`,
        ...p,
        user: {
          name: p.authorName,
          avatar: p.authorAvatar,
          location: p.location,
          username: p.authorName.toLowerCase().replace(/[^a-z0-9]/g, '_')
        },
        createdAt: new Date().toISOString()
      }));
    }

    const formattedProjects = listToReturn.map((p) => {
      let tags = [];
      try {
        tags = typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []);
      } catch {
        tags = [p.category];
      }

      // Check curated enrichment for deliverables and impact
      const curatedMatch = CURATED_PROJECTS.find(cp => cp.title === p.title);

      return {
        id: p.id,
        title: p.title,
        category: p.category,
        skillTrack: p.category,
        description: p.description,
        imageUrl: p.imageUrl,
        image: p.imageUrl,
        projectUrl: p.projectUrl || curatedMatch?.projectUrl || '',
        link: p.projectUrl || curatedMatch?.projectUrl || '',
        tags,
        likes: p.likesCount !== undefined ? p.likesCount : (curatedMatch?.likesCount || 42),
        verified: p.verified !== undefined ? p.verified : true,
        authorName: p.user?.name || curatedMatch?.authorName || 'Learner',
        authorAvatar: p.user?.avatar || curatedMatch?.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.title)}`,
        authorUsername: p.user?.username || (p.user?.name || 'learner').toLowerCase().replace(/[^a-z0-9]/g, '_'),
        location: p.user?.location || curatedMatch?.location || 'India',
        impact: curatedMatch?.impact || 'Verified Deliverable • 5.0 Rating',
        deliverables: curatedMatch?.deliverables || [
          'High-resolution client assets and source files',
          'Production guidelines and design documentation',
          'Exported deliverables reviewed & approved by client'
        ],
        toolsUsed: curatedMatch?.toolsUsed || tags.slice(0, 3),
        clientTestimonial: curatedMatch?.clientTestimonial || 'Exceptional attention to detail and on-time delivery.',
        createdAt: p.createdAt || new Date().toISOString(),
      };
    });

    res.json({ success: true, count: formattedProjects.length, projects: formattedProjects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch public portfolio feed', error: error.message });
  }
});

// POST /api/portfolio/:id/like - Toggle like on project
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.portfolioProject.findUnique({ where: { id } }).catch(() => null);

    if (!project) {
      // If it's a curated non-persisted ID, return mock response
      return res.json({ success: true, likes: 145, message: 'Appreciation recorded!' });
    }

    const updated = await prisma.portfolioProject.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
    });

    res.json({ success: true, likes: updated.likesCount, message: 'Project liked!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like project', error: error.message });
  }
});

// POST /api/portfolio - Create new project
router.post('/', async (req, res) => {
  try {
    const { title, category, description, imageUrl, projectUrl, tags, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    // Identify user from authMiddleware token if present, or assign to demo/first user
    let userId = req.user?.id;
    if (!userId) {
      const existingUser = await prisma.user.findFirst();
      userId = existingUser?.id;
    }

    if (!userId) {
      const newUser = await prisma.user.create({
        data: {
          name: 'Independent Creator',
          username: `creator_${Date.now()}`,
          email: `creator_${Date.now()}@herearn.org`,
          passwordHash: 'placeholder',
          role: 'LEARNER',
        }
      });
      userId = newUser.id;
    }

    const tagList = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [category || 'Digital Creation'];

    const project = await prisma.portfolioProject.create({
      data: {
        userId,
        title: title.trim(),
        category: category || 'Digital Marketing',
        description: description.trim(),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
        projectUrl: projectUrl || link || '',
        tags: JSON.stringify(tagList),
        verified: true,
        likesCount: 1,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true, location: true, username: true } }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Project published successfully!',
      project: {
        ...project,
        tags: tagList,
        likes: project.likesCount,
        authorName: project.user?.name || 'Creator',
        authorAvatar: project.user?.avatar,
        location: project.user?.location || 'India',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create portfolio project', error: error.message });
  }
});

// GET /api/portfolio/:id - Detail view
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let project = await prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true, location: true, bio: true, username: true } },
      },
    }).catch(() => null);

    const curatedMatch = CURATED_PROJECTS.find(p => p.title === project?.title) || CURATED_PROJECTS[0];

    if (!project) {
      // Fallback to curated match if looking up non-uuid or mock id
      const mockIndex = parseInt(id.replace(/\D/g, ''), 10) - 1;
      const matchedCurated = CURATED_PROJECTS[mockIndex] || CURATED_PROJECTS[0];
      return res.json({
        success: true,
        project: {
          id,
          ...matchedCurated,
          authorName: matchedCurated.authorName,
          authorAvatar: matchedCurated.authorAvatar,
          location: matchedCurated.location,
          likes: matchedCurated.likesCount,
          createdAt: new Date().toISOString()
        }
      });
    }

    let parsedTags = [];
    try {
      parsedTags = typeof project.tags === 'string' ? JSON.parse(project.tags || '[]') : (project.tags || []);
    } catch {
      parsedTags = [project.category];
    }

    res.json({
      success: true,
      project: {
        ...project,
        tags: parsedTags,
        likes: project.likesCount,
        authorName: project.user?.name || curatedMatch.authorName,
        authorAvatar: project.user?.avatar || curatedMatch.authorAvatar,
        location: project.user?.location || curatedMatch.location,
        bio: project.user?.bio,
        impact: curatedMatch?.impact || 'Verified Deliverable • 5.0 Rating',
        deliverables: curatedMatch?.deliverables || [
          'Production ready deliverables approved by client',
          'Asset package and style guidelines',
          'Performance metrics and analytics review'
        ],
        toolsUsed: curatedMatch?.toolsUsed || parsedTags.slice(0, 4),
        clientTestimonial: curatedMatch?.clientTestimonial || 'Highly professional, great visual quality, and delivered on schedule.',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project details', error: error.message });
  }
});

// PATCH /api/portfolio/:id
router.patch('/:id', async (req, res) => {
  try {
    const project = await prisma.portfolioProject.findUnique({ where: { id: req.params.id } });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, category, description, imageUrl, projectUrl, tags, link } = req.body;
    const updatedData = {};
    if (title !== undefined) updatedData.title = title.trim();
    if (category !== undefined) updatedData.category = category;
    if (description !== undefined) updatedData.description = description.trim();
    if (imageUrl !== undefined) updatedData.imageUrl = imageUrl;
    if (projectUrl !== undefined || link !== undefined) updatedData.projectUrl = projectUrl || link;
    if (tags !== undefined) {
      const tagList = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [category];
      updatedData.tags = JSON.stringify(tagList);
    }

    const updated = await prisma.portfolioProject.update({
      where: { id: req.params.id },
      data: updatedData,
    });

    let tagsArr = [];
    try {
      tagsArr = JSON.parse(updated.tags || '[]');
    } catch {
      tagsArr = [updated.category];
    }

    res.json({
      success: true,
      project: {
        ...updated,
        tags: tagsArr,
        likes: updated.likesCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update project', error: error.message });
  }
});

// DELETE /api/portfolio/:id
router.delete('/:id', async (req, res) => {
  try {
    const project = await prisma.portfolioProject.findUnique({ where: { id: req.params.id } });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await prisma.portfolioProject.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project', error: error.message });
  }
});

export default router;
