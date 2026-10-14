import express from 'express';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Store conversation history per session
const sessions = new Map();
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of sessions.entries()) {
    if (now - data.lastActive > SESSION_TIMEOUT_MS) {
      sessions.delete(sessionId);
    }
  }
}, 10 * 60 * 1000);

const SYSTEM_PROMPT = `You are "Earn Assistant", a warm, empathetic, intelligent, and highly empowering AI companion on HerEarn — a skill-to-income platform dedicated to empowering women across India to achieve financial independence.

Core Platform Knowledge:
1. HerEarn Platform Overview: HerEarn bridges learning and earning through 4 free skill tracks (/learn), an interactive proof-of-work portfolio builder (/portfolio), verified client micro-gigs (/opportunities) with real-time 🎯 Skill Match % and 6-question eligibility quizzes (Easy, Medium, Hard), 100% Escrow Payout Protection (stipends ₹3,500 – ₹12,000/mo), and a learner dashboard (/dashboard).
2. Four Free Skill Tracks:
   - Digital Marketing: Ad campaigns, CTR, CAC, ROAS & social media strategy.
   - Graphic Design with Canva: Visual branding, typography, social graphics, and SVG logos.
   - Shopify E-Commerce: Store management, inventory, product listings, and customer upselling.
   - SEO Content Writing: Copywriting, keyword strategy, E-E-A-T, and topic clusters.
3. Women-Centric Empowerment: Deep understanding of career breaks (after marriage, motherhood, or caretaking), overcoming fear of technology, building financial independence from home, zero upfront investment, and avoiding freelance payment fraud via Escrow protection.
4. Interactive Games & Quizzes: Word guessing, riddles, women in tech trivia, skill quizzes, and collaborative 20 questions with score tracking.

Tone & Style:
- Warm, encouraging, respectful, clear, and actionable.
- Concise responses (2 to 4 sentences max) unless explaining a detailed topic or playing a game.
- NEVER repeat identical answers. Address the user's exact words and question directly.`;

// Call Google Gemini API (Free Tier available at https://aistudio.google.com/)
async function callGeminiAPI(apiKey, systemPrompt, history) {
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = history.map(item => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: item.content }]
  }));

  const payload = {
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!replyText) {
    throw new Error('Gemini API returned empty response candidate');
  }
  return replyText.trim();
}



/**
 * @route   POST /api/chat
 * @desc    AI Assistant Chatbot endpoint — Gemini primary, offline NLP fallback
 * @access  Public
 */
router.post('/', apiLimiter, async (req, res) => {
  try {
    let { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'message and sessionId required' });
    }

    message = String(message).trim().slice(0, 500);
    if (!message) {
      return res.status(400).json({ error: 'Empty message' });
    }

    const now = Date.now();
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, { 
        history: [], 
        gameScore: 0, 
        gameRound: 0,
        sentResponseHashes: new Set(),
        lastActive: now 
      });
    }

    const sessionData = sessions.get(sessionId);
    sessionData.lastActive = now;
    const history = sessionData.history;

    history.push({ role: 'user', content: message });

    let botReply = '';
    let usedProvider = 'local';

    // 1. Try Google Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'your_gemini_key_here' && !geminiKey.includes('dummy')) {
      try {
        botReply = await callGeminiAPI(geminiKey, SYSTEM_PROMPT, history);
        usedProvider = 'gemini';
      } catch (err) {
        console.warn('[Gemini API Fallback]:', err.message);
      }
    }

    // Offline NLP fallback if Gemini is unavailable or key is missing
    if (!botReply) {
      botReply = generateDynamicAIReply(message, sessionData);
    }

    history.push({ role: 'assistant', content: botReply });

    if (history.length > 20) {
      sessionData.history = history.slice(-20);
    }

    res.json({ reply: botReply, provider: usedProvider });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI service temporary issue, please try again.' });
  }
});

function generateDynamicAIReply(message, session) {
  const text = message.toLowerCase().trim();

  const pickUnique = (categoryKey, options) => {
    let pool = options.filter(opt => !session.sentResponseHashes.has(opt));
    if (pool.length === 0) {
      session.sentResponseHashes.clear();
      pool = options;
    }
    const selected = pool[Math.floor(Math.random() * pool.length)];
    session.sentResponseHashes.add(selected);
    return selected;
  };

  // 1. GAME & TRIVIA ENGINE
  if (text.includes('game') || text.includes('play') || text.includes('bored') || text.includes('riddle') || text.includes('trivia') || text.includes('quiz me')) {
    session.gameRound = (session.gameRound || 0) + 1;
    const round = session.gameRound;

    if (round === 1) {
      return "🎮 **Game On! Round 1: Digital Marketing Quiz**\n\n*Question:* Which metric measures how many people click on an advertisement out of total viewers?\n\nA) ROAS (Return On Ad Spend)\nB) CTR (Click-Through Rate)\nC) CAC (Customer Acquisition Cost)\n\n*Reply with A, B, or C to score 10 points!*";
    }
    if (round === 2) {
      return "🎨 **Round 2: Graphic Design Riddle!**\n\n*Riddle:* I use mathematical formulas instead of pixels, so I never get blurry even on huge billboards. What file format am I?\n\nA) JPEG\nB) SVG\nC) PNG\n\n*What is your answer?*";
    }
    if (round === 3) {
      return "👑 **Round 3: Women in Tech History!**\n\n*Question:* Who wrote the world's very first computer algorithm in 1843 for Charles Babbage's mechanical computer?\n\nA) Ada Lovelace\nB) Grace Hopper\nC) Katherine Johnson\n\n*Guess A, B, or C!*";
    }
    if (round === 4) {
      return "✨ **Round 4: 20 Questions Game!**\n\nI am thinking of a design tool loved by freelancers for social media graphics, flyers, and logos. Hint: Starts with 'C'. Can you guess the tool?";
    }
    session.gameRound = 0;
    return `🏆 **Game Summary:** You scored **${session.gameScore || 30} Points**! You have sharp digital skills! Type **'play a game'** anytime to challenge yourself again!`;
  }

  // Game Answer Checking
  if (text === 'b' || text.includes('ctr') || text.includes('click through')) {
    session.gameScore = (session.gameScore || 0) + 10;
    return "🎉 **Spot on! CTR (Click-Through Rate) is correct!** (+10 Pts 🌟)\n\nCTR calculates ad engagement: (Clicks / Impressions) × 100. Higher CTR means more clients want your marketing skills! Ready for the next riddle? Type **'play'**!";
  }

  if (text === 'b' || text.includes('svg') || text.includes('vector')) {
    session.gameScore = (session.gameScore || 0) + 10;
    return "🌟 **Bingo! SVG (Scalable Vector Graphics) is correct!** (+10 Pts 👑)\n\nUnlike JPEGs, SVGs use vectors so brand logos never lose clarity at any scale. Ready for Round 3? Type **'play'**!";
  }

  if (text === 'a' || text.includes('ada') || text.includes('lovelace')) {
    session.gameScore = (session.gameScore || 0) + 10;
    return "👑 **Brilliant! Ada Lovelace is correct!** (+10 Pts 🏆)\n\nAda Lovelace pioneered computing in 1843. Women have shaped technology from day one! Ready for Round 4? Type **'play'**!";
  }

  if (text.includes('canva')) {
    session.gameScore = (session.gameScore || 0) + 10;
    return `🎉 **You got it: Canva!** (+10 Pts 🎨)\n\nCanva is the #1 tool our learners use to deliver professional visual graphics to clients! Total Score: **${session.gameScore} Points**!`;
  }

  // 2. BOT IDENTITY & CAPABILITIES
  if (text.includes('who are you') || text.includes('what are you') || text.includes('what is your name') || text.includes('your role')) {
    return pickUnique('identity', [
      "👋 I'm **Earn Assistant**, your friendly AI career companion on HerEarn! I help you discover free skill tracks, create portfolio deliverables, prepare for client gig quizzes, and navigate remote freelancing safely.",
      "🌸 I'm **Earn Assistant**! My mission is to empower women across India with skills and tools to achieve financial independence. You can ask me questions about courses, gigs, portfolio tips, or type **'play a game'**!",
      "✨ I am your **HerEarn AI Companion**! Whether you want career restart guidance, advice on freelance pricing, or course recommendations, I am here for you 24/7."
    ]);
  }

  if (text.includes('what can you do') || text.includes('how can you help') || text.includes('your features') || text.includes('help me with')) {
    return pickUnique('capabilities', [
      "💡 **Here is what I can do for you:**\n1. Guide you through 4 free skill courses — Graphic Design, Digital Marketing, Shopify, and Content Writing.\n2. Help you build a verified work portfolio to show clients.\n3. Explain how to apply for remote client projects with guaranteed payments.\n4. Answer career questions and play interactive trivia games!",
      "🚀 **I can assist you with:**\n- Finding the right course based on your interests and schedule.\n- Tips to pass the eligibility assessment when applying for projects.\n- Rebuilding your career confidence after a break.\n- Understanding how HerEarn ensures you are always paid on time.",
      "✨ **Try asking me:**\n- What courses are available?\n- How does the payment protection work?\n- How do I restart my career after a break?\n- Play a game with me!"
    ]);
  }

  // 3. GREETINGS & POLITENESS
  if (/^(hi|hello|hey|namaste|greetings|good morning|good afternoon|good evening)\b/.test(text)) {
    return pickUnique('greetings', [
      "Namaste! 👋 I'm Earn Assistant. How can I support your learning or career journey on HerEarn today? You can ask about our tracks, gigs, or say 'play a game'!",
      "Hello! 🌸 Welcome to HerEarn! Whether you want to learn Canva design, write content, or find flexible remote gigs, I'm here to guide you step-by-step.",
      "Hi there! ✨ Great to meet you! Ready to build practical skills and start earning from home? Tell me what you'd like to explore!"
    ]);
  }

  if (text.includes('thank') || text.includes('thx') || text.includes('appreciate')) {
    return pickUnique('thanks', [
      "You're very welcome! 🌸 Remember, every step you take brings you closer to your financial goals. Let me know if you need anything else!",
      "Glad I could help! ✨ Keep up the great energy. You have the skills and potential to succeed on HerEarn!",
      "Always happy to assist! 💖 Feel free to ask more questions anytime."
    ]);
  }

  if (text.includes('how are you')) {
    return pickUnique('how_are_you', [
      "I'm doing wonderful, thank you for asking! 😊 Ready to help you discover courses, polish your portfolio, or find exciting remote gigs. How are you doing today?",
      "Feeling energetic and excited to help women thrive in digital careers! 🌸 How can I assist you right now?"
    ]);
  }

  // 4. PLATFORM OVERVIEW & GETTING STARTED
  if (text.includes('what is herearn') || text.includes('how does herearn work') || text.includes('about herearn') || text.includes('how to start') || text.includes('get started')) {
    return pickUnique('overview', [
      "🌟 **What is HerEarn?** HerEarn is a skill-to-income platform built for women in India. It follows a simple four-step journey:\n1. **Learn:** Complete free courses in Canva Design, Digital Marketing, Shopify, or Content Writing.\n2. **Build:** Create a portfolio of real sample projects to showcase your skills.\n3. **Apply:** Take a short eligibility assessment and apply for verified client projects.\n4. **Earn:** Complete the work and receive your payment securely through our Escrow system.",
      "🚀 **Getting started is straightforward.** You begin by enrolling in any of the four free skill courses — no prior experience or qualifications are needed. Once you have built a few sample projects, you can apply for remote client work and earn a monthly stipend from home.",
      "💡 HerEarn bridges the gap between learning and earning. Women across India use this platform to gain practical digital skills and connect with clients who pay guaranteed, protected stipends ranging from ₹3,500 to ₹12,000 per month."
    ]);
  }

  // 5. SKILL TRACKS & COURSES
  if (text.includes('course') || text.includes('learn') || text.includes('track') || text.includes('class') || text.includes('syllabus') || text.includes('subject')) {
    return pickUnique('courses', [
      "📚 **HerEarn offers four free skill courses:**\n1. 🎨 **Graphic Design with Canva** — Visual branding, social media graphics, and logo design.\n2. 📈 **Digital Marketing** — Ad campaigns, social media growth, and performance metrics.\n3. 🛍️ **Shopify E-Commerce** — Online store management, product listings, and order handling.\n4. ✍️ **SEO Content Writing** — Blog articles, web copy, and keyword strategy.\n\nAll courses are self-paced and include practical projects you can add to your portfolio.",
      "🎓 **No qualifications required.** Every course on HerEarn is designed for complete beginners, with step-by-step lessons and ready-to-use templates. You can start learning today and build real sample work from your very first session.",
      "💡 Finishing a course earns you a verified skill badge on your profile, which increases your chances of being shortlisted when you apply for client projects."
    ]);
  }

  if (text.includes('canva') || text.includes('graphic design') || text.includes('design')) {
    return pickUnique('canva_track', [
      "🎨 **Graphic Design with Canva Track:** You will learn brand color palettes, Instagram carousel templates, typography hierarchy, and SVG logo design. Canva skills are in high demand for social media micro-gigs paying ₹4,000–₹8,000/mo!",
      "✨ Design clients love quick, eye-catching social posts! Our Canva track teaches you how to deliver client-ready visual assets directly from your laptop or phone."
    ]);
  }

  if (text.includes('marketing') || text.includes('digital marketing') || text.includes('ads')) {
    return pickUnique('marketing_track', [
      "📈 **Digital Marketing Track:** Master ad targeting, social media growth, Click-Through Rate (CTR), and Customer Acquisition Cost (CAC). You'll create mock launch campaigns that serve as portfolio proof!",
      "🚀 Digital Marketing micro-gigs on HerEarn offer stipends ranging from ₹5,000 to ₹12,000/mo for managing brand social channels."
    ]);
  }

  if (text.includes('writing') || text.includes('seo') || text.includes('content')) {
    return pickUnique('writing_track', [
      "✍️ **SEO Content Writing Track:** Learn how to write engaging blog articles, product descriptions, and web copy that rank on Google. You'll master keyword research, catchy headlines, and E-E-A-T guidelines!",
      "📝 Content writing is one of the most flexible work-from-home skills. You can write anytime during the day and earn per article or monthly retainer."
    ]);
  }

  if (text.includes('shopify') || text.includes('ecommerce') || text.includes('store')) {
    return pickUnique('shopify_track', [
      "🛍️ **Shopify E-Commerce Track:** Learn store theme setup, inventory upload, checkout optimization, and order handling. E-commerce brands regularly hire remote assistants to manage their product catalogs!",
      "📦 Managing a Shopify store can easily be done part-time from home with stipends up to ₹10,000/mo."
    ]);
  }

  // 6. GIGS, OPPORTUNITIES & APPLYING
  if (text.includes('gig') || text.includes('job') || text.includes('opportunity') || text.includes('work') || text.includes('apply') || text.includes('hire') || text.includes('client')) {
    return pickUnique('gigs', [
      "💼 **Applying for Client Projects:** HerEarn's Opportunities section lists verified remote projects from real clients. Each listing shows how well your current skills match the requirements.\n\nTo apply, you will:\n1. Write a short cover proposal explaining your interest.\n2. Attach one or two projects from your portfolio.\n3. Complete a 6-question skill assessment. Scoring 60% or above confirms your eligibility.",
      "🎯 **To improve your chances of being hired:**\n- Publish at least one or two completed portfolio projects before applying.\n- Read the project requirements carefully and highlight your matching skills.\n- Take your time on the eligibility assessment — aiming for 80% or above makes you stand out.",
      "🛡️ Every project on HerEarn is fully remote. Client payments are secured in Escrow before work begins, so you are guaranteed to receive your stipend once the work is delivered and approved."
    ]);
  }

  // 7. QUIZZES & ELIGIBILITY
  if (text.includes('quiz') || text.includes('assessment') || text.includes('score') || text.includes('eligibility') || text.includes('pass')) {
    return pickUnique('quizzes', [
      "📝 **Eligibility Assessment:** When you apply for a client project, you will complete a 6-question skill assessment divided into three levels:\n- 2 straightforward questions\n- 2 intermediate questions\n- 2 advanced questions\n\nScoring 60% or above verifies your practical ability and confirms your application to the client.",
      "💡 If you do not pass on your first attempt, do not worry. You can revisit the relevant course lessons at any time and re-take the assessment to improve your score.",
      "🎯 The assessment ensures that clients select candidates based on demonstrated skill rather than academic qualifications or years of experience."
    ]);
  }

  // 8. ESCROW, PAYMENTS & EARNINGS
  if (text.includes('escrow') || text.includes('pay') || text.includes('stipend') || text.includes('money') || text.includes('earn') || text.includes('salary') || text.includes('withdraw') || text.includes('fraud') || text.includes('safe')) {
    return pickUnique('payments', [
      "🛡️ **100% Escrow Payout Protection:** Client partners deposit the full stipend amount into HerEarn's secure Escrow before you begin work. Once you submit the deliverable and the client approves, funds are immediately credited to you — zero risk of non-payment or ghosting!",
      "💰 **Guaranteed Stipends:** Gigs pay between ₹3,500 and ₹12,000/mo depending on project scope. Escrow guarantees your hard work is respected and compensated promptly.",
      "🔒 **Safe & Transparent:** You never have to chase clients for payment. Our platform holds the funds safely and releases them upon milestone delivery."
    ]);
  }

  // 9. PORTFOLIO & PROOF OF WORK
  if (text.includes('portfolio') || text.includes('project') || text.includes('showcase') || text.includes('upload') || text.includes('proof')) {
    return pickUnique('portfolio', [
      "🎨 **Your Portfolio:** Your portfolio is where you publish the sample work you create during your courses — design mockups, blog articles, Canva graphics, or store screenshots. It shows clients exactly what you are capable of.",
      "🌟 When you apply for a client project, your portfolio is automatically shared with the employer so they can review your work before making a decision.",
      "📁 You can add titles, descriptions, and links to each portfolio item to give clients the full context of what you have built."
    ]);
  }

  // 10. CAREER BREAKS, WOMEN EMPOWERMENT & HOMEMAKERS
  if (text.includes('career break') || text.includes('gap') || text.includes('marriage') || text.includes('motherhood') || text.includes('restart') || text.includes('housewife') || text.includes('homemaker') || text.includes('mom')) {
    return pickUnique('career_break', [
      "🌸 **Career Gaps Don't Matter Here:** Taking time off for family, maternity, or marriage is completely normal! HerEarn evaluates you on your current **Proof-of-Work Portfolio** and quiz score, not gaps on paper.",
      "💪 Over 70% of learners on HerEarn are women restarting their professional journey after years of career break. You can start with simple micro-gigs to rebuild your confidence!",
      "💖 You already manage complex households and families — learning digital tools like Canva or SEO is well within your capability! We are here to support you every step of the way."
    ]);
  }

  // 11. CONFIDENCE, BEGINNERS & NO EXPERIENCE
  if (text.includes('beginner') || text.includes('no experience') || text.includes('scared') || text.includes('afraid') || text.includes('can i') || text.includes('difficult') || text.includes('hard') || text.includes('fail')) {
    return pickUnique('confidence', [
      "✨ **No prior experience is needed.** HerEarn's courses are designed specifically for beginners. Each lesson is short, practical, and comes with templates so you can follow along without any technical background.",
      "🤗 **You do not need to know everything before you begin.** Start with one course that interests you, complete the first few lessons, and build from there. Many learners find their confidence grows quickly once they see their first finished project.",
      "💪 It is completely natural to feel uncertain at the start. The important thing is simply to begin — one small step at a time. HerEarn is here to support you throughout the entire journey."
    ]);
  }

  // 12. REMOTE WORK & TIME FLEXIBILITY
  if (text.includes('remote') || text.includes('home') || text.includes('flexible') || text.includes('time') || text.includes('hours') || text.includes('phone') || text.includes('mobile')) {
    return pickUnique('remote', [
      "🏠 **100% Work-From-Home:** All micro-gigs on HerEarn are remote. Whether you have 2 hours in the afternoon or quiet time in the evening, you work on your own schedule without commuting.",
      "📱 **Work From Laptop or Mobile:** Many Canva designs, content drafts, and social media tasks can be initiated directly from a smartphone or tablet!",
      "🌿 Freedom to balance family priorities while building your own independent income stream."
    ]);
  }

  // 13. DASHBOARD & PROFILE
  if (text.includes('dashboard') || text.includes('profile') || text.includes('status') || text.includes('badge')) {
    return pickUnique('dashboard', [
      "📊 **Your Dashboard** is your personal progress hub. It shows your enrolled courses, lessons completed, portfolio items, and the current status of any project applications — whether pending, shortlisted, or approved.",
      "🖥️ From your dashboard you can quickly jump to any course, add a new portfolio project, or check the latest updates on your client applications — all in one place."
    ]);
  }

  // 14. WRONG ANSWER DURING AN ACTIVE GAME ROUND
  if (session.gameRound && session.gameRound > 0) {
    return pickUnique('wrong_answer', [
      "That is not quite right, but do not worry! Think it through and try again — reply with A, B, or C. You can do this! 💪",
      "Not quite! Take another look at the options and give it another go. Type A, B, or C when you are ready. 🎯",
      "Good try, but that is not the correct answer this time. Have another attempt — reply with A, B, or C! 😊"
    ]);
  }

  // 15. GENERAL CATCH-ALL FOR UNRECOGNISED MESSAGES
  return pickUnique('catch_all', [
    "Thank you for your message! HerEarn is here to help you build practical digital skills and connect with verified remote work opportunities. Feel free to ask about our courses, how payments work, or how to get started. You can also type 'play a game' if you would like a fun challenge!",
    "I appreciate you reaching out! If you have a question about HerEarn — whether it is about learning, applying for projects, or earning safely from home — I am happy to help. What would you like to know more about?",
    "Happy to help! HerEarn supports women across India in building digital skills and achieving financial independence from home. Please ask me anything about the courses, client projects, payment protection, or your career journey."
  ]);
}

export default router;
