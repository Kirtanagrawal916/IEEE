import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting: max 20 requests per IP per minute
const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many chat requests from this IP, please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Store conversation history and last active timestamp per session ID
const sessions = new Map();
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes inactivity timeout

// Inactivity cleanup interval every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of sessions.entries()) {
    if (now - data.lastActive > SESSION_TIMEOUT_MS) {
      sessions.delete(sessionId);
    }
  }
}, 10 * 60 * 1000);

// Initialize Anthropic client (reads ANTHROPIC_API_KEY from process.env)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_for_initialization',
});

// POST /api/chat
router.post('/', chatRateLimiter, async (req, res) => {
  try {
    let { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'message and sessionId required' });
    }

    // Input sanitization
    message = String(message).trim().slice(0, 500);
    if (!message) {
      return res.status(400).json({ error: 'Empty message' });
    }

    // Get or initialize session history
    const now = Date.now();
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, { history: [], lastActive: now });
    }

    const sessionData = sessions.get(sessionId);
    sessionData.lastActive = now;
    const history = sessionData.history;

    // Push user message
    history.push({ role: 'user', content: message });

    // System instructions for Earn Assistant
    const systemPrompt = `You are "Earn Assistant", a helpful, warm, and empowering AI chatbot on HerEarn — a skill-to-income platform dedicated to empowering women across India to learn market-relevant skills, build proof-of-work portfolios, and earn income through flexible micro-gigs and retainer roles.

Your responsibilities:
1. Answer any question the user asks — about HerEarn platform features, digital marketing, Canva design, Shopify e-commerce, content writing, freelancing, career growth, or general knowledge.
2. If the user says anything like "play a game", "let's play", "game", "bored", "quiz", or selects a game chip:
   - Suggest or start fun text-based games such as:
     - Word Guessing Game
     - Riddles & Puzzles
     - Trivia Quiz (about digital careers, India, tech, or women empowerment)
     - 20 Questions
     - Collaborative Story Building (you write one sentence, user writes next)
   - ACTUALLY PLAY the game with them step-by-step, keeping score or progress in the conversation!
3. Be warm, encouraging, and empowering — your tone should uplift women users.
4. Keep responses concise — max 3-4 sentences unless playing an interactive game or explaining something complex.
5. If asked about HerEarn features (courses, portfolio builder, micro-gigs, skill matcher, escrow protection), explain them clearly and accurately.
6. Never break character — you are always Earn Assistant.`;

    let botReply = '';

    // Call Anthropic API if valid API key exists
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_key_here') {
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
        console.warn('[Claude API Error]:', apiErr.message);
      }
    }

    // Intelligent fallback AI response engine if API key is missing or encounters quota limits
    if (!botReply) {
      botReply = generateFallbackReply(message, history);
    }

    // Push assistant reply to session history
    history.push({ role: 'assistant', content: botReply });

    // Trim history to max 20 messages to keep token usage optimal
    if (history.length > 20) {
      sessionData.history = history.slice(-20);
    }

    res.json({ reply: botReply });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'AI service unavailable, please try again' });
  }
});

// Fallback response engine for local execution / dev fallback
function generateFallbackReply(message, history) {
  const lower = message.toLowerCase();

  if (lower.includes('play') || lower.includes('game') || lower.includes('bored') || lower.includes('riddle') || lower.includes('quiz')) {
    return "🎮 Awesome! Let me give you a quick Riddle Trivia challenge!\n\n*Question:* I am a digital file format that can scale infinitely without pixelating or losing quality. What am I?\n\nTake your guess: A) JPEG, B) SVG, or C) PNG!";
  }

  if (lower.includes('b)') || lower.includes('svg') || lower.includes('vector')) {
    return "🎉 Spot on! SVG (Scalable Vector Graphics) is correct (+10 Points)! SVG uses math vector lines so logos stay ultra-sharp at any size. Ready for another riddle or trivia question?";
  }

  if (lower.includes('gig') || lower.includes('opportunity') || lower.includes('apply') || lower.includes('earn')) {
    return "💼 Finding gigs on HerEarn is simple! Go to the 'Opportunities' tab, review live client projects, check your real-time 🎯 Skill Match %, and click 'Apply & Take Skill Assessment Quiz'. Our Escrow Protection ensures guaranteed payouts upon project delivery!";
  }

  if (lower.includes('course') || lower.includes('learn') || lower.includes('track') || lower.includes('skill')) {
    return "📚 We offer 4 market-relevant skill tracks: Digital Marketing, Canva & Graphic Design, Shopify E-Commerce, and SEO Content Writing. Each track includes interactive bite-sized lessons and capstone portfolio projects to showcase to clients!";
  }

  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
    return "Hi there! 👋 I'm Earn Assistant, your HerEarn AI companion. How can I empower your learning or earning journey today? You can also ask me to play a fun game!";
  }

  return `I'm Earn Assistant! 🤖 You asked: "${message}". HerEarn is designed to empower you to learn digital skills, showcase verified portfolio work, and connect with paid micro-gigs. Feel free to ask about our courses, portfolio builder, or type "play a game" to play a quiz!`;
}

export default router;
