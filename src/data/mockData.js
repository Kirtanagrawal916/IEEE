export const initialUser = null;

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

export const initialPortfolios = [];

export const initialOpportunities = [
  {
    id: "gig-1",
    title: "Social Media Manager for Organic Spices Brand",
    company: "Desi Flavors Handcrafted",
    logo: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=150",
    stipend: "₹8,000 / month",
    type: "Remote Part-time",
    category: "Digital Marketing",
    skillsRequired: ["Digital Marketing", "Canva Design", "Instagram Management", "Content Writing"],
    duration: "3 Months",
    description: "Looking for a skilled woman creator to manage our Instagram page, post 4 high-quality posts per week, design Canva graphics, write product captions, and reply to customer DMs.",
    deliverables: ["16 Instagram posts & reels/month", "Weekly engagement report", "Customer DM response management"],
    verifiedClient: true,
    isOpen: true,
    applicantsCount: 14,
    deadline: "5 Days Left",
    location: "Remote (India)"
  },
  {
    id: "gig-2",
    title: "Canva Banner & Flyer Designer for Event",
    company: "Women Entrepreneurship Summit",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=150",
    stipend: "₹3,500 (Flat Fee)",
    type: "Micro-Gig",
    category: "Design",
    skillsRequired: ["Canva Design", "Graphic Design", "Banner Design", "Poster Layout"],
    duration: "1 Week",
    description: "Need 5 digital promo banners for social media outreach and 1 printable PDF brochure for an upcoming women founders conference in Delhi.",
    deliverables: ["5 Social Media Banners (PNG/JPG)", "1 Print-ready PDF Brochure"],
    verifiedClient: true,
    isOpen: true,
    applicantsCount: 8,
    deadline: "3 Days Left",
    location: "Remote"
  },
  {
    id: "gig-3",
    title: "Shopify Product Catalog Assistant",
    company: "KalaKriti Handloom Collective",
    logo: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=150",
    stipend: "₹12,000 / month",
    type: "Remote Internship",
    category: "E-Commerce",
    skillsRequired: ["Shopify", "E-Commerce", "Data Entry", "Product Writing"],
    duration: "2 Months",
    description: "Help our artisan collective upload new handloom saree & dupatta collections onto Shopify, write clear product descriptions, set pricing variants, and tag inventory.",
    deliverables: ["Upload 80+ catalog items", "Write SEO product tags", "Optimize images for web"],
    verifiedClient: true,
    isOpen: true,
    applicantsCount: 19,
    deadline: "2 Days Left",
    location: "Remote (India)"
  },
  {
    id: "gig-4",
    title: "Content Writer for Women Wellness Blog",
    company: "AyuCare Natural Health",
    logo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=150",
    stipend: "₹6,000 / month",
    type: "Remote Part-time",
    category: "Content Writing",
    skillsRequired: ["Content Writing", "SEO Blogging", "Copywriting"],
    duration: "3 Months",
    description: "Write 6 engaging, SEO-optimized blog posts per month on women's wellness, natural skincare remedies, and holistic living.",
    deliverables: ["6 Blog articles (800-1000 words each)", "Meta descriptions & keyword tags"],
    verifiedClient: true,
    isOpen: true,
    applicantsCount: 11,
    deadline: "6 Days Left",
    location: "Remote"
  },
  {
    id: "gig-5",
    title: "Product Packaging & Label Designer",
    company: "Sudha Handmade Organics",
    logo: "https://images.unsplash.com/photo-1608248597263-0057e43a4522?auto=format&fit=crop&q=80&w=150",
    stipend: "₹4,500 (Flat Fee)",
    type: "Micro-Gig",
    category: "Design",
    skillsRequired: ["Graphic Design", "Canva Design", "Packaging Design"],
    duration: "10 Days",
    description: "Design front & back eco-friendly box and bottle sticker labels for a new line of organic body scrubs and herbal oils.",
    deliverables: ["3 Label designs print-ready", "Source Canva / Illustrator files"],
    verifiedClient: true,
    isOpen: true,
    applicantsCount: 7,
    deadline: "4 Days Left",
    location: "Remote"
  },
  {
    id: "gig-6",
    title: "Instagram Reels & Short Video Creator",
    company: "StyleCraft Boutiques",
    logo: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=150",
    stipend: "₹10,000 / month",
    type: "Remote Part-time",
    category: "Digital Marketing",
    skillsRequired: ["Video Editing", "Instagram Reels", "Content Writing"],
    duration: "2 Months",
    description: "Edit 8 short trendy Reels per month from provided raw product video footage. Add trending music, engaging captions, and dynamic transition effects.",
    deliverables: ["8 Edited Instagram Reels/month", "Trending hashtag lists"],
    verifiedClient: true,
    isOpen: true,
    applicantsCount: 16,
    deadline: "1 Week Left",
    location: "Remote (India)"
  }
];

export const platformStats = [
  { label: "Women Learners Upskilled", value: "0+" },
  { label: "Income Generated for Women", value: "₹0" },
  { label: "Partner Small Businesses", value: "0+" },
  { label: "Average First Gig Earnings", value: "₹0/mo" }
];
