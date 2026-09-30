import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

/**
 * @route   POST /api/chat
 * @desc    AI Assistant Chatbot endpoint with interactive learning games
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

    const systemPrompt = `You are "Earn Assistant", a warm, empathetic, intelligent, and highly empowering AI companion on HerEarn — a skill-to-income platform dedicated to empowering women across India to achieve financial independence.`;

    let botReply = '';

    if (process.env.ANTHROPIC_API_KEY && 
        process.env.ANTHROPIC_API_KEY !== 'your_key_here' && 
        !process.env.ANTHROPIC_API_KEY.includes('dummy')) {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: systemPrompt,
          messages: history,
        });

        if (response.content && response.content[0] && response.content[0].text) {
          botReply = response.content[0].text;
        }
      } catch (apiErr) {
        console.warn('[Claude API Fallback]:', apiErr.message);
      }
    }

    if (!botReply) {
      botReply = generateDynamicAIReply(message, sessionData);
    }

    history.push({ role: 'assistant', content: botReply });

    if (history.length > 20) {
      sessionData.history = history.slice(-20);
    }

    res.json({ reply: botReply });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI service temporary issue, please try again.' });
  }
});

function generateDynamicAIReply(message, session) {
  const text = message.toLowerCase().trim();

  const pickUnique = (key, options) => {
    let pool = options.filter(opt => !session.sentResponseHashes.has(opt));
    if (pool.length === 0) {
      session.sentResponseHashes.clear();
      pool = options;
    }
    const selected = pool[Math.floor(Math.random() * pool.length)];
    session.sentResponseHashes.add(selected);
    return selected;
  };

  if (text.includes('game') || text.includes('play') || text.includes('riddle') || text.includes('trivia') || text.includes('quiz')) {
    session.gameRound = (session.gameRound || 0) + 1;
    const round = session.gameRound;

    if (round === 1) {
      return "🎮 **Game On! Round 1: Skill Trivia Challenge**\n\n*Question:* Which digital metric measures how many people click on an advertisement out of total viewers?\n\nA) ROAS (Return On Ad Spend)\nB) CTR (Click-Through Rate)\nC) CAC (Customer Acquisition Cost)\n\n*Reply with A, B, or C to score points!*";
    }
    if (round === 2) {
      return "🎮 **Round 2: Graphic Design Riddle!**\n\n*Riddle:* I use mathematical equations instead of pixels, so I never get blurry even on giant billboards. What image format am I?\n\nA) JPEG\nB) SVG\nC) PNG\n\n*What is your answer?*";
    }
    if (round === 3) {
      return "🎮 **Round 3: Women in Tech History!**\n\n*Question:* Who wrote the world's very first computer algorithm in 1843 for Charles Babbage's mechanical computer?\n\nA) Ada Lovelace\nB) Grace Hopper\nC) Katherine Johnson\n\n*Guess A, B, or C!*";
    }
    session.gameRound = 0;
    return "🎉 **Game Summary:** You scored **" + (session.gameScore || 30) + " Points**! You're a true HerEarn Champion. Type 'play a game' anytime to start a fresh round!";
  }

  if (text.includes('course') || text.includes('learn') || text.includes('track')) {
    return pickUnique('courses', [
      "📚 **HerEarn Skill Tracks (/learn):** We offer 4 market-relevant tracks:\n1. Digital Marketing\n2. Graphic Design with Canva\n3. Shopify E-Commerce\n4. SEO Content Writing!",
      "🎓 **Master In-Demand Skills:** Go to the 'Learn' tab (/learn) to access free courses with bite-sized lessons!",
    ]);
  }

  if (text.includes('gig') || text.includes('opportunity') || text.includes('apply')) {
    return pickUnique('gigs', [
      "💼 **Opportunities Board (/opportunities):** Browse active client gigs! Click 'Apply' to complete a quiz and attach your portfolio.",
      "🚀 **Applying for Gigs:** Pick a micro-gig matching your profile and submit your proposal note with portfolio proof.",
    ]);
  }

  if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
    return pickUnique('greetings', [
      "Namaste! 👋 I'm Earn Assistant. How can I help you learn skills, build a portfolio, or find flexible remote gigs today?",
      "Hello! 🌸 Welcome to HerEarn! Ask me any question about our courses or career tips!",
    ]);
  }

  return pickUnique('fallback', [
    `HerEarn is designed to guide you step-by-step! Learn market-relevant skills in 'Learn', publish practical projects in 'Portfolio', and apply for 100% Escrow-protected remote micro-gigs in 'Opportunities'.`,
  ]);
}

export default router;
