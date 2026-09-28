export const initialUser = {
  id: "u1",
  name: "Ananya Sharma",
  title: "Aspiring Digital Marketer & Content Creator",
  location: "Jaipur, Rajasthan",
  bio: "Passionate about creating engaging social media content and helping small businesses grow online.",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
  verified: true,
  skills: ["Digital Marketing", "Canva Design", "Instagram Management", "Content Writing"],
  earnings: 12500,
  completedLessons: ["m1-l1", "m1-l2", "m1-l3"],
  appliedGigIds: ["g1"],
  enrolledTrackId: "track-1"
};

export const skillTracks = [
  {
    id: "track-1",
    title: "Digital Marketing & Social Media",
    category: "Marketing",
    icon: "Megaphone",
    duration: "4 Hours • 5 Lessons",
    level: "Beginner to Pro",
    instructor: "Meera Nair (Senior Growth Marketer)",
    description: "Learn to manage social media accounts for small businesses, run Instagram campaigns, and create high-converting graphics.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600",
    lessons: [
      {
        id: "m1-l1",
        title: "Lesson 1: Social Media Basics for Local Businesses",
        duration: "15 min",
        videoUrl: "https://www.youtube.com/embed/nU-IIXBWlS4",
        summary: "Understand how Instagram & WhatsApp Business help small stores reach local customers.",
        keyTakeaways: [
          "Setting up a Professional Instagram Business Profile",
          "Understanding your local target audience",
          "Creating content pillars for consistent posting"
        ]
      },
      {
        id: "m1-l2",
        title: "Lesson 2: Designing Eye-Catching Posts using Canva",
        duration: "25 min",
        videoUrl: "https://www.youtube.com/embed/un50Bs4BvZ8",
        summary: "Step-by-step guide to choosing brand colors, fonts, and crafting product promo banners.",
        keyTakeaways: [
          "Color theory for brand identity",
          "Using Canva templates effectively",
          "Exporting high-resolution graphics for Instagram & Facebook"
        ]
      },
      {
        id: "m1-l3",
        title: "Lesson 3: Writing Captions & Using Hashtags that Convert",
        duration: "20 min",
        videoUrl: "https://www.youtube.com/embed/4y_f0L6J-uQ",
        summary: "Mastering hooks, storytelling, call-to-action (CTA), and hyper-local hashtags.",
        keyTakeaways: [
          "The AIDA formula for captions (Attention, Interest, Desire, Action)",
          "Hashtag strategy for local discovery",
          "Adding WhatsApp booking links in bio"
        ]
      },
      {
        id: "m1-l4",
        title: "Lesson 4: Running Your First ₹500 Meta Ad Campaign",
        duration: "30 min",
        videoUrl: "https://www.youtube.com/embed/3Q95b6XmXn8",
        summary: "Learn how to target local customers near a boutique, bakery, or handicraft shop.",
        keyTakeaways: [
          "Setting up Meta Ads Manager",
          "Audience targeting by location & interests",
          "Tracking WhatsApp lead conversions"
        ]
      },
      {
        id: "m1-l5",
        title: "Capstone Project: Submit Your Client Marketing Plan",
        duration: "45 min",
        videoUrl: "https://www.youtube.com/embed/VpXJ27p2Wlg",
        summary: "Build a complete 1-week sample Instagram calendar for a local boutique to showcase in your portfolio.",
        keyTakeaways: [
          "Creating a 7-day content schedule",
          "Designing 3 sample Instagram posts",
          "Publishing your project to unlock the Opportunity Board"
        ]
      }
    ]
  },
  {
    id: "track-2",
    title: "Graphic Design & Brand Asset Creation",
    category: "Design",
    icon: "Palette",
    duration: "5 Hours • 6 Lessons",
    level: "Beginner",
    instructor: "Ritu Sengupta (Creative Director)",
    description: "Create logos, flyers, product packaging labels, and promotional posters for e-commerce and retail brands.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600",
    lessons: [
      {
        id: "m2-l1",
        title: "Lesson 1: Introduction to Graphic Design Fundamentals",
        duration: "20 min",
        videoUrl: "https://www.youtube.com/embed/YqQx75OPRa0",
        summary: "Learn layout, alignment, typography, and visual hierarchy principles.",
        keyTakeaways: ["Visual balance", "Typography rules", "Color psychology"]
      },
      {
        id: "m2-l2",
        title: "Lesson 2: Crafting Brand Logos & Style Guides",
        duration: "30 min",
        videoUrl: "https://www.youtube.com/embed/2_Yn127tG_I",
        summary: "How to design memorable minimalist logos for small enterprises.",
        keyTakeaways: ["Vector design concepts", "Iconography selection", "Exporting SVG & PNG formats"]
      }
    ]
  },
  {
    id: "track-3",
    title: "E-Commerce & Shopify Store Management",
    category: "Business",
    icon: "ShoppingBag",
    duration: "4.5 Hours • 5 Lessons",
    level: "Intermediate",
    instructor: "Kavita Rao (E-Commerce Specialist)",
    description: "Help artisans and home businesses list products online, manage store catalog, and handle customer support.",
    image: "https://images.unsplash.com/photo-1556742049-0a670fc8078a?auto=format&fit=crop&q=80&w=600",
    lessons: [
      {
        id: "m3-l1",
        title: "Lesson 1: Setting up Product Listings & Descriptions",
        duration: "25 min",
        videoUrl: "https://www.youtube.com/embed/1vR_2fA9O4w",
        summary: "Writing product titles, descriptions, pricing, and SEO tags for online sales.",
        keyTakeaways: ["Product SEO", "High quality photo editing", "Inventory basics"]
      }
    ]
  }
];

export const initialPortfolios = [
  {
    id: "p1",
    authorName: "Ananya Sharma",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    location: "Jaipur",
    skillTrack: "Digital Marketing",
    title: "7-Day Instagram Growth Strategy for CraftBoutique Jaipur",
    description: "Designed 7 high-engagement posts, story templates, and a Reels calendar for a local handloom store. Resulted in 40% increase in WhatsApp inquiries.",
    category: "Digital Marketing",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
    tags: ["Canva", "Instagram Strategy", "Local Business"],
    likes: 42,
    verified: true,
    date: "2 days ago"
  },
  {
    id: "p2",
    authorName: "Sunita Patel",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    location: "Ahmedabad",
    skillTrack: "Graphic Design",
    title: "Eco-Friendly Organic Tea Packaging & Branding",
    description: "Created complete packaging labels, logo design, and promotional flyers for a home-based herbal tea brand.",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    tags: ["Packaging", "Logo Design", "Branding"],
    likes: 58,
    verified: true,
    date: "4 days ago"
  },
  {
    id: "p3",
    authorName: "Priya Verma",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    location: "Indore",
    skillTrack: "E-Commerce",
    title: "Shopify Store Setup & Catalog Management for Handmade Jewelry",
    description: "Uploaded 50+ product listings, integrated UPI payments, and optimized mobile product pages for quick checkout.",
    category: "E-Commerce",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600",
    tags: ["Shopify", "Catalog", "Product Listings"],
    likes: 31,
    verified: true,
    date: "1 week ago"
  }
];

export const initialOpportunities = [
  {
    id: "g1",
    title: "Social Media Manager for Organic Spices Brand",
    company: "Desi Flavors Handcrafted",
    logo: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=150",
    stipend: "₹8,000 / month",
    type: "Remote Part-time",
    category: "Digital Marketing",
    skillsRequired: ["Digital Marketing", "Canva Design", "Instagram Management"],
    duration: "3 Months (Potential to extend)",
    description: "Looking for a skilled woman creator to manage our Instagram page, post 4 posts per week, create Canva graphics, and reply to customer DMs.",
    deliverables: ["16 Instagram posts/month", "Weekly performance report", "DM customer support"],
    verifiedClient: true,
    applied: true,
    applicantsCount: 14,
    deadline: "In 3 days"
  },
  {
    id: "g2",
    title: "Canva Banner & Flyer Designer for Event",
    company: "Women Entrepreneurship Summit",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=150",
    stipend: "₹3,500 (Project Flat)",
    type: "Micro-Gig",
    category: "Design",
    skillsRequired: ["Canva Design", "Graphic Design", "Banner Design"],
    duration: "1 Week",
    description: "Need 5 digital banners for social media promotion and 1 printable PDF flyer for an upcoming women founders event.",
    deliverables: ["5 Social Media Banners", "1 Print-ready PDF Brochure"],
    verifiedClient: true,
    applied: false,
    applicantsCount: 8,
    deadline: "In 5 days"
  },
  {
    id: "g3",
    title: "Shopify Product Catalog Assistant",
    company: "KalaKriti Handloom Collective",
    logo: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=150",
    stipend: "₹12,000 / month",
    type: "Remote Internship",
    category: "E-Commerce",
    skillsRequired: ["Shopify", "E-Commerce", "Data Entry"],
    duration: "2 Months",
    description: "Help our artisan collective upload new saree & dupatta collections onto Shopify, write clear product descriptions, and tag inventory.",
    deliverables: ["Upload 80+ catalog items", "Write SEO product tags"],
    verifiedClient: true,
    applied: false,
    applicantsCount: 19,
    deadline: "In 2 days"
  },
  {
    id: "g4",
    title: "Content Writer for Healthy Snacks Blog",
    company: "NourishBites Foods",
    logo: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=150",
    stipend: "₹5,000 / month",
    type: "Freelance",
    category: "Digital Marketing",
    skillsRequired: ["Content Writing", "SEO Basics", "Blog Writing"],
    duration: "Ongoing",
    description: "Write 4 engaging blog articles per month (600 words each) on healthy snacking tips for working mothers.",
    deliverables: ["4 Blog Posts / month", "Basic Keyword Research"],
    verifiedClient: true,
    applied: false,
    applicantsCount: 6,
    deadline: "In 6 days"
  }
];

export const platformStats = [
  { label: "Women Learners Upskilled", value: "12,450+" },
  { label: "Income Generated for Women", value: "₹1.8 Crore+" },
  { label: "Partner Small Businesses", value: "650+" },
  { label: "Average First Gig Earnings", value: "₹6,500/mo" }
];
