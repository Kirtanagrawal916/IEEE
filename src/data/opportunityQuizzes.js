// Skill Assessment Quiz Questions for Opportunities categorized by topic/skill
// Each topic has Easy, Medium, and Hard difficulty levels

export const OPPORTUNITY_QUIZZES = {
  'Digital Marketing': [
    {
      id: 'dm-e1',
      difficulty: 'Easy',
      points: 10,
      question: 'What does CTA stand for in digital marketing campaigns?',
      options: [
        'Call To Action',
        'Customer Tech Assistance',
        'Click Through Analysis',
        'Content Targeted Audience'
      ],
      correctAnswer: 0,
      explanation: 'CTA (Call To Action) is a prompt on a website or ad that encourages the user to take a specific action, such as "Buy Now" or "Sign Up".'
    },
    {
      id: 'dm-e2',
      difficulty: 'Easy',
      points: 10,
      question: 'Which social media platform is best suited for visual image and reel marketing?',
      options: [
        'LinkedIn',
        'Instagram',
        'Twitter / X',
        'Reddit'
      ],
      correctAnswer: 1,
      explanation: 'Instagram is inherently visual, making it ideal for visual brand stories, posts, and reels.'
    },
    {
      id: 'dm-m1',
      difficulty: 'Medium',
      points: 20,
      question: 'If a campaign receives 1,000 ad clicks from 50,000 ad impressions, what is the Click-Through Rate (CTR)?',
      options: [
        '0.5%',
        '2.0%',
        '5.0%',
        '20.0%'
      ],
      correctAnswer: 1,
      explanation: 'CTR = (Clicks / Impressions) * 100 = (1,000 / 50,000) * 100 = 2.0%.'
    },
    {
      id: 'dm-m2',
      difficulty: 'Medium',
      points: 20,
      question: 'Which metric measures the total cost required to acquire a single paying customer?',
      options: [
        'ROAS (Return On Ad Spend)',
        'CAC (Customer Acquisition Cost)',
        'LTV (Lifetime Value)',
        'CPM (Cost Per Mille)'
      ],
      correctAnswer: 1,
      explanation: 'CAC (Customer Acquisition Cost) measures marketing spend divided by number of acquired customers.'
    },
    {
      id: 'dm-h1',
      difficulty: 'Hard',
      points: 30,
      question: 'In Advanced SEO, what is the primary purpose of canonical tags (rel="canonical")?',
      options: [
        'To speed up website page rendering on mobile devices',
        'To prevent duplicate content issues by signaling the authoritative URL to search engines',
        'To encrypt user data transmitted between client and server',
        'To generate automatic XML sitemaps for Google indexers'
      ],
      correctAnswer: 1,
      explanation: 'Canonical tags specify which master version of a page search engines should index, avoiding duplicate content penalties.'
    },
    {
      id: 'dm-h2',
      difficulty: 'Hard',
      points: 30,
      question: 'What is the ideal ratio for a healthy LTV to CAC in scaling performance marketing campaigns?',
      options: [
        '1:1',
        '3:1 or higher',
        '1:3',
        '0.5:1'
      ],
      correctAnswer: 1,
      explanation: 'A 3:1 LTV:CAC ratio means customer lifetime value is 3x the cost to acquire them, ensuring long-term profitability.'
    }
  ],

  'Design': [
    {
      id: 'des-e1',
      difficulty: 'Easy',
      points: 10,
      question: 'Which file format supports transparent backgrounds for digital graphics?',
      options: [
        'JPEG / JPG',
        'PNG',
        'BMP',
        'MP4'
      ],
      correctAnswer: 1,
      explanation: 'PNG (Portable Network Graphics) supports alpha transparency.'
    },
    {
      id: 'des-e2',
      difficulty: 'Easy',
      points: 10,
      question: 'What is the primary difference between RGB and CMYK color modes?',
      options: [
        'RGB is for screen displays; CMYK is for physical print printing',
        'RGB is for print; CMYK is for mobile apps',
        'RGB has 4 colors; CMYK has 3 colors',
        'RGB is monochrome; CMYK is full color'
      ],
      correctAnswer: 0,
      explanation: 'RGB (Red, Green, Blue) is additive light for digital screens, while CMYK (Cyan, Magenta, Yellow, Key/Black) is for physical ink printing.'
    },
    {
      id: 'des-m1',
      difficulty: 'Medium',
      points: 20,
      question: 'In visual typography, what does "Kerning" refer to?',
      options: [
        'The vertical space between lines of text',
        'The spacing between specific individual letter pairs',
        'The weight and thickness of a font style',
        'The alignment of text blocks to grid margins'
      ],
      correctAnswer: 1,
      explanation: 'Kerning is the process of adjusting the spacing between individual characters to achieve a visually pleasing result.'
    },
    {
      id: 'des-m2',
      difficulty: 'Medium',
      points: 20,
      question: 'Why are SVG (Scalable Vector Graphics) preferred over raster images for logo design?',
      options: [
        'They can be scaled infinitely without losing quality or becoming pixelated',
        'They automatically translate text into multiple languages',
        'They consume more storage memory than JPEGs',
        'They cannot be edited once saved'
      ],
      correctAnswer: 0,
      explanation: 'Vector graphics use mathematical equations to render lines and curves, allowing lossless scaling to any resolution.'
    },
    {
      id: 'des-h1',
      difficulty: 'Hard',
      points: 30,
      question: 'What is the Golden Ratio value commonly applied in visual balance and layout grid composition?',
      options: [
        '1.414',
        '1.618',
        '2.718',
        '3.141'
      ],
      correctAnswer: 1,
      explanation: 'The Golden Ratio (~1.618) is a mathematical proportion observed in nature and used by designers for naturally pleasing balance.'
    },
    {
      id: 'des-h2',
      difficulty: 'Hard',
      points: 30,
      question: 'In UI/UX accessibility guidelines (WCAG 2.1 AA), what is the minimum contrast ratio required for normal body text against its background?',
      options: [
        '2:1',
        '3:1',
        '4.5:1',
        '7:1'
      ],
      correctAnswer: 2,
      explanation: 'WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal body text to ensure readability for users with low vision.'
    }
  ],

  'E-Commerce': [
    {
      id: 'ec-e1',
      difficulty: 'Easy',
      points: 10,
      question: 'What is an SKU in e-commerce inventory management?',
      options: [
        'Stock Keeping Unit',
        'Sales Key User',
        'Standard Shipping Unit',
        'Shopping Kart Universal'
      ],
      correctAnswer: 0,
      explanation: 'An SKU (Stock Keeping Unit) is a unique scannable code assigned to identify specific product variants.'
    },
    {
      id: 'ec-e2',
      difficulty: 'Easy',
      points: 10,
      question: 'Which of the following is a leading e-commerce platform for setting up online stores?',
      options: [
        'Shopify',
        'Figma',
        'Canva',
        'Postman'
      ],
      correctAnswer: 0,
      explanation: 'Shopify is a top hosted e-commerce platform.'
    },
    {
      id: 'ec-m1',
      difficulty: 'Medium',
      points: 20,
      question: 'What is Cart Abandonment Rate and how is it calculated?',
      options: [
        'Percentage of visitors who add items to cart but do not complete checkout',
        'Percentage of items returned due to damage during delivery',
        'Total number of refunds issued in a month',
        'Ratio of new customers to repeat buyers'
      ],
      correctAnswer: 0,
      explanation: 'Cart Abandonment Rate = (1 - (Completed Purchases / Created Carts)) * 100.'
    },
    {
      id: 'ec-m2',
      difficulty: 'Medium',
      points: 20,
      question: 'What strategy involves suggesting a higher-tier or upgraded product version during online checkout?',
      options: [
        'Cross-selling',
        'Upselling',
        'Drop-shipping',
        'Retargeting'
      ],
      correctAnswer: 1,
      explanation: 'Upselling encourages customers to purchase a premium or upgraded version of an item.'
    },
    {
      id: 'ec-h1',
      difficulty: 'Hard',
      points: 30,
      question: 'What is the main advantage of integrating Headless Architecture in modern e-commerce stores?',
      options: [
        'Eliminating the need for product pricing',
        'Decoupling the frontend presentation layer from the backend commerce logic for faster loading and flexibility',
        'Removing inventory tracking requirements',
        'Bypassing payment gateway fees automatically'
      ],
      correctAnswer: 1,
      explanation: 'Headless commerce decouples frontend UI from backend business logic, enabling custom high-speed storefronts across web & mobile.'
    },
    {
      id: 'ec-h2',
      difficulty: 'Hard',
      points: 30,
      question: 'In e-commerce logistics, what is the role of 3PL (Third-Party Logistics) partners?',
      options: [
        'Designing social media promotional banners',
        'Outsourced warehousing, order fulfillment, packaging, and shipping distribution',
        'Audit taxation and corporate accounts',
        'Manage website domain SSL certificates'
      ],
      correctAnswer: 1,
      explanation: '3PL providers handle end-to-end warehousing, fulfillment, and shipping operations for e-commerce brands.'
    }
  ],

  'Content Writing': [
    {
      id: 'cw-e1',
      difficulty: 'Easy',
      points: 10,
      question: 'What is the primary focus of SEO Copywriting?',
      options: [
        'Writing content optimized for both human readers and search engine rankings',
        'Writing legal court documents',
        'Filling pages with repetitive keywords without grammar structure',
        'Translating code comments into English'
      ],
      correctAnswer: 0,
      explanation: 'SEO Copywriting crafts engaging content that incorporates relevant keywords naturally to rank well on search engines.'
    },
    {
      id: 'cw-e2',
      difficulty: 'Easy',
      points: 10,
      question: 'Which headline structure usually garners higher click rates in blog posts?',
      options: [
        'Vague 1-word titles',
        'Specific numbers and actionable benefit promises (e.g. "10 Proven Ways to...")',
        'All CAPS text with no spaces',
        'Technical internal SKU numbers'
      ],
      correctAnswer: 1,
      explanation: 'Numbered, benefit-driven headlines give readers a clear value proposition and structure.'
    },
    {
      id: 'cw-m1',
      difficulty: 'Medium',
      points: 20,
      question: 'What is "Keyword Stuffing" and why is it penalized by Google?',
      options: [
        'Overloading a web page with repetitive keywords to manipulate search ranking artificially',
        'Adding meta tags to blog posts',
        'Using synonyms in body paragraphs',
        'Hyperlinking to internal blog posts'
      ],
      correctAnswer: 0,
      explanation: 'Keyword stuffing creates poor user experience and is flagged as webspam by search algorithms.'
    },
    {
      id: 'cw-m2',
      difficulty: 'Medium',
      points: 20,
      question: 'What copywriting framework uses Attention, Interest, Desire, and Action?',
      options: [
        'PAS Framework',
        'AIDA Framework',
        'BAB Framework',
        '4P Framework'
      ],
      correctAnswer: 1,
      explanation: 'AIDA stands for Attention, Interest, Desire, and Action.'
    },
    {
      id: 'cw-h1',
      difficulty: 'Hard',
      points: 30,
      question: 'What does Google\'s E-E-A-T guideline stand for in quality content evaluation?',
      options: [
        'Efficiency, Execution, Accuracy, and Testing',
        'Experience, Expertise, Authoritativeness, and Trustworthiness',
        'Engagement, Entertainment, Advertising, and Traffic',
        'Everyday Ecommerce Application Transfer'
      ],
      correctAnswer: 1,
      explanation: 'E-E-A-T evaluates content quality based on Experience, Expertise, Authoritativeness, and Trustworthiness.'
    },
    {
      id: 'cw-h2',
      difficulty: 'Hard',
      points: 30,
      question: 'In content strategy, what is the role of Topic Clusters and Pillar Pages?',
      options: [
        'To organize content into core central topics linked to detailed supporting sub-pages for SEO topical authority',
        'To delete older blog posts automatically',
        'To limit blog posts to 100 words maximum',
        'To hide content from search engine crawlers'
      ],
      correctAnswer: 0,
      explanation: 'Topic clusters build deep topical authority by interconnecting a comprehensive pillar page with focused cluster articles.'
    }
  ]
};

// Fallback quiz for any uncategorized gig
export const DEFAULT_QUIZ = [
  {
    id: 'gen-e1',
    difficulty: 'Easy',
    points: 10,
    question: 'What is the most professional way to handle client feedback and revisions on a micro-gig?',
    options: [
      'Ignore feedback and deliver the original file',
      'Review feedback constructively, clarify questions, and update deliverables promptly',
      'Cancel the gig immediately',
      'Ask for extra payment before reading the feedback'
    ],
    correctAnswer: 1,
    explanation: 'Constructive review and clear communication build strong professional client relationships.'
  },
  {
    id: 'gen-e2',
    difficulty: 'Easy',
    points: 10,
    question: 'Why is proof of work (portfolio samples) important when applying for remote opportunities?',
    options: [
      'It demonstrates real practical skill execution and builds instant client trust',
      'It is required by law for internet connections',
      'It increases file download speeds',
      'It replaces the need for completing client deliverables'
    ],
    correctAnswer: 0,
    explanation: 'Proof of work provides tangible evidence of your capabilities and quality standards.'
  },
  {
    id: 'gen-m1',
    difficulty: 'Medium',
    points: 20,
    question: 'What key information should be included in a project status update to a client?',
    options: [
      'Completed tasks, upcoming milestones, and any potential blockers or questions',
      'Personal daily routine details',
      'List of other client payments',
      'Only one-word messages like "Done"'
    ],
    correctAnswer: 0,
    explanation: 'Clear milestone tracking keeps clients informed and prevents misunderstandings.'
  },
  {
    id: 'gen-m2',
    difficulty: 'Medium',
    points: 20,
    question: 'How does HerEarn Escrow payment system protect gig workers?',
    options: [
      'It holds client funds in secure escrow prior to work commencement and releases payment upon completed delivery',
      'It forces workers to pay upfront fees',
      'It deducts interest on earnings',
      'It requires 6 months waiting time for withdrawals'
    ],
    correctAnswer: 0,
    explanation: 'Escrow ensures client funds are verified upfront, protecting learners against non-payment.'
  },
  {
    id: 'gen-h1',
    difficulty: 'Hard',
    points: 30,
    question: 'When prioritizing multiple client deliverables with conflicting deadlines, which framework is most effective?',
    options: [
      'Eisenhower Decision Matrix (Urgent vs. Important prioritization)',
      'Random selection by drawing names from a hat',
      'Only working on the highest paying task and ignoring all others',
      'Delaying all tasks until the last minute'
    ],
    correctAnswer: 0,
    explanation: 'The Eisenhower Matrix categorizes tasks by urgency and importance to optimize workflow throughput.'
  },
  {
    id: 'gen-h2',
    difficulty: 'Hard',
    points: 30,
    question: 'What is the best practice for storing working files and assets during client handoff?',
    options: [
      'Organize assets into well-named folders with source files, exported formats, and a README overview',
      'Send unsorted raw files across multiple email threads',
      'Delete working files as soon as the project ends',
      'Send low-resolution screenshot previews only'
    ],
    correctAnswer: 0,
    explanation: 'Structured asset delivery ensures seamless client onboarding and future scalability.'
  }
];

export function getQuizForCategory(category) {
  return OPPORTUNITY_QUIZZES[category] || DEFAULT_QUIZ;
}
