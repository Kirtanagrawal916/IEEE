import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Gamepad2, 
  Briefcase, 
  BookOpen, 
  IndianRupee,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

const getFormattedTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Parses a subset of markdown into React elements.
 * Handles: **bold**, *italic*, and /route-path tokens.
 */
function formatMessageText(text) {
  // Split on bold (**...**), italic (*...*), or route paths (/word)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\/[a-z]+(?:-[a-z]+)*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-extrabold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-purple-200">{part.slice(1, -1)}</em>;
    }
    if (/^\/[a-z]+/.test(part)) {
      return (
        <span
          key={i}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-md bg-purple-700/50 border border-purple-500/40 text-purple-200 font-mono text-[10px] font-semibold"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Generate or retrieve persistent Session ID
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('chatSessionId');
    if (saved) return saved;
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `session-${Date.now()}-${Math.random()}`;
    localStorage.setItem('chatSessionId', newId);
    return newId;
  });

  // Initial messages state with warm welcome greeting and quick reply chips
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hi! 👋 I'm Earn Assistant. Ask me anything about HerEarn, careers, or just say 'play a game' if you want some fun! 🎮",
      timestamp: 'Just now',
      showChips: true
    }
  ]);

  const messagesEndRef = useRef(null);

  const quickReplyChips = [
    { text: "How do I find gigs?", icon: Briefcase },
    { text: "What courses are available?", icon: BookOpen },
    { text: "Career restart for women", icon: Sparkles },
    { text: "Play a game with me", icon: Gamepad2 }
  ];

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Handle Opening / Closing Chat Window
  const toggleChatOpen = () => {
    if (!isOpen) {
      setUnreadCount(0); // clear unread badge when opened
    }
    setIsOpen(!isOpen);
  };

  // Send Message logic
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userTime = getFormattedTime();
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.slice(0, 500),
      timestamp: userTime
    };

    // Add user message to UI immediately & set typing state
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // API call to backend /api/chat
      const res = await api.sendChatMessage(text, sessionId);
      const botTime = getFormattedTime();

      const botReplyText = res.reply || res.botReply || "I am always here to help you learn skills and build your career on HerEarn!";

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: botTime
      };

      setMessages(prev => [...prev, botMsg]);

      // If window is closed when bot responds, increment unread count badge
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }

    } catch (err) {
      console.warn('[ChatBot] API connection notice, using local dynamic responder:', err.message);
      const botTime = getFormattedTime();
      const dynamicLocalText = getClientFallbackReply(text);
      const fallbackMsg = {
        id: `bot-local-${Date.now()}`,
        sender: 'bot',
        text: dynamicLocalText,
        timestamp: botTime
      };
      setMessages(prev => [...prev, fallbackMsg]);
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const getClientFallbackReply = (userInput) => {
    const lower = userInput.toLowerCase().trim();

    // 1. FAREWELLS / GOODBYE
    if (/\b(bye|goodbye|good night|goodnight|see you|take care|cya|ttyl|quit|exit|stop)\b/.test(lower)) {
      return "Goodbye! 🌟 It was lovely chatting with you. Keep building your skills and confidence on HerEarn — your next opportunity is waiting. Have a wonderful day ahead! 🌸";
    }

    // 2. GRATITUDE / THANKS
    if (lower.includes('thank') || lower.includes('thx') || lower.includes('appreciate')) {
      return "You're most welcome! 💖 Remember, every small step you take towards learning creates financial freedom. Let me know if you need anything else!";
    }

    // 3. GREETINGS
    if (/^(hi|hello|hey|namaste|good morning|good evening|good afternoon)\b/.test(lower)) {
      return "Namaste! 👋 I'm **Earn Assistant**, your companion on HerEarn! I can help you choose free courses, guide you on client gigs, or play a fun riddle game. What would you like to explore today?";
    }

    // 4. GAME & RIDDLES
    if (lower.includes('game') || lower.includes('play') || lower.includes('riddle') || lower.includes('trivia') || lower.includes('quiz')) {
      return "🎮 **Skill Riddle Challenge!**\n\n*Question:* I use mathematical vectors instead of pixels, so brand logos stay ultra-sharp on both mobile screens and huge billboards. What format am I?\n\nA) JPEG\nB) SVG\nC) PNG\n\n*Reply with A, B, or C!*";
    }

    // 5. GAME ANSWER CHECKING
    if (lower === 'b' || lower.includes('svg') || lower.includes('vector')) {
      return "🎉 **Spot on! B) SVG (Scalable Vector Graphics) is correct!** (+10 Pts 🌟)\n\nUnlike JPEGs or PNGs which get pixelated when scaled up, SVGs use math formulas so brand logos never lose quality. Ready for another challenge? Type **'play'**!";
    }
    if (lower === 'a' || lower.includes('jpeg') || lower.includes('jpg')) {
      return "❌ **Not quite! A) JPEG is made of fixed pixels**, which means it gets blurry and pixelated when blown up on billboards. Try again! Reply with **B** or **C**! 🎯";
    }
    if (lower === 'c' || lower.includes('png')) {
      return "❌ **Close, but not quite! C) PNG is pixel-based (raster)**. While PNG supports transparent backgrounds, it still becomes blurry when stretched to huge sizes. The vector format is **B) SVG**! Good effort! Type **'play'** for the next riddle! 🌟";
    }

    // 6. COURSES & TRACKS
    if (lower.includes('course') || lower.includes('learn') || lower.includes('track') || lower.includes('class') || lower.includes('subject')) {
      return "📚 **HerEarn Free Skill Tracks (/learn):**\n1. 🎨 **Graphic Design with Canva:** Visual branding, social graphics, SVG logos\n2. 📈 **Digital Marketing:** Ad campaigns, CTR, CAC & social growth\n3. 🛍️ **Shopify E-Commerce:** Store management, product listings, order fulfillment\n4. ✍️ **SEO Content Writing:** Copywriting, keyword strategy, and blog articles\n\nAll courses are self-paced, 100% free, and include project templates for your portfolio!";
    }

    // 7. GIGS & OPPORTUNITIES
    if (lower.includes('gig') || lower.includes('opportunity') || lower.includes('apply') || lower.includes('job') || lower.includes('work') || lower.includes('client')) {
      return "💼 **Opportunities Board (/opportunities):** Browse verified remote micro-gigs from clients! Each opportunity shows your live 🎯 **Skill Match %**. To apply, submit a short proposal, link your portfolio projects, and take the 6-question eligibility quiz!";
    }

    // 8. ESCROW & PAYMENTS
    if (lower.includes('escrow') || lower.includes('pay') || lower.includes('stipend') || lower.includes('money') || lower.includes('salary') || lower.includes('withdraw') || lower.includes('safe') || lower.includes('fraud')) {
      return "🛡️ **100% Escrow Protection:** Client partners deposit stipend funds (₹3,500 – ₹12,000/mo) into HerEarn's secure Escrow before you begin work. Once you deliver the project and it's approved, payment is released immediately — zero risk of non-payment or fraud!";
    }

    // 9. CAREER BREAKS & HOMEMAKERS
    if (lower.includes('career break') || lower.includes('gap') || lower.includes('restart') || lower.includes('marriage') || lower.includes('motherhood') || lower.includes('homemaker') || lower.includes('housewife')) {
      return "🌸 **Career Restart Empowered:** Resume gaps don't define you here! HerEarn evaluates you on your **Proof-of-Work Portfolio** and quiz score, not past gaps. Over 70% of our learners are women restarting their professional journey after motherhood or caretaking. You've got this! 💪";
    }

    // 10. PORTFOLIO
    if (lower.includes('portfolio') || lower.includes('project') || lower.includes('proof')) {
      return "🎨 **Portfolio Builder (/portfolio):** Showcase your skills with real projects! Upload your Canva designs, blog samples, or store setups. Clients review your portfolio directly when deciding who to hire.";
    }

    // 11. HOW ARE YOU
    if (lower.includes('how are you')) {
      return "I'm doing great, thank you for asking! 😊 I'm excited to help you explore skills, build your portfolio, and find remote gigs. How can I assist you right now?";
    }

    // 12. NATURAL INTELLIGENT FALLBACK
    return "💡 I'm here to support your career journey on HerEarn! You can ask me:\n• *'What courses are free?'*\n• *'How does Escrow payment protection work?'*\n• *'How can I restart my career after a break?'*\n• Or type **'play a game'** for a fun riddle!";
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:bottom-6 sm:right-6 z-50 font-sans max-w-[calc(100vw-2rem)]">
      
      {/* 1. Floating Chat Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleChatOpen}
          aria-label="Open Earn Assistant AI Chatbot"
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group animate-pulse"
        >
          <Bot className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* 2. Floating Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[400px] h-[78vh] max-h-[580px] sm:h-[550px] bg-slate-900/95 border border-purple-500/30 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden modal-content-animate origin-bottom-right text-white">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-4 border-b border-purple-500/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md border border-purple-300/40">
                  <Bot className="w-5 h-5" />
                </div>
                {/* Online Indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">Earn Assistant</h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live AI
                  </span>
                </div>
                <p className="text-[11px] text-purple-200 font-medium">
                  Ask me anything or let's play a game!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleChatOpen}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600/40">
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-1 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs shrink-0 shadow-sm">
                      🤖
                    </div>
                  )}

                  <div
                    className={`p-3.5 text-xs font-medium leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl rounded-tr-none'
                        : 'bg-slate-800 text-white rounded-2xl rounded-tl-none border border-slate-700/80'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">
                      {msg.text.split('\n').map((line, lineIdx, arr) => (
                        <React.Fragment key={lineIdx}>
                          {formatMessageText(line)}
                          {lineIdx < arr.length - 1 && '\n'}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>

                <span className="text-[9px] text-slate-400 px-2 font-semibold">
                  {msg.timestamp}
                </span>

                {/* Quick Reply Chips below greeting */}
                {msg.showChips && (
                  <div className="pt-2 grid grid-cols-2 gap-2 w-full animate-fade-in">
                    {quickReplyChips.map((chip, idx) => {
                      const IconComp = chip.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(chip.text)}
                          className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-[11px] font-bold transition-all text-left flex items-center gap-1.5 cursor-pointer hover:border-pink-400 hover:text-white"
                        >
                          <IconComp className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                          <span className="truncate">{chip.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Bouncing 3 Dots Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs shrink-0">
                  🤖
                </div>
                <div className="p-3 bg-slate-800 rounded-2xl rounded-tl-none border border-slate-700/80 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]"></span>
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-purple-500/20 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask a question or type 'play a game'..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                maxLength={500}
                className="flex-1 bg-slate-800 text-white text-xs px-4 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder-slate-400 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shrink-0"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
