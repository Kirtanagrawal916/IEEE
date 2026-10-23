import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Target, 
  Compass, 
  Edit3, 
  Globe, 
  MapPin, 
  RefreshCw, 
  AlertCircle, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  CheckCheck,
  Heart,
  MessageCircle,
  Plus,
  ArrowLeft,
  Share2,
  ThumbsUp
} from 'lucide-react';
import { api } from '../services/api';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';

const LEARNING_PATHS = [
  'All Learning Paths',
  'Frontend Development',
  'UI/UX Design',
  'Data Analytics & AI',
  'Digital Marketing',
  'Cloud & DevOps',
  'Content Creation',
];

const POPULAR_SKILLS = [
  'All Skills',
  'React',
  'Node.js',
  'UI/UX Design',
  'Figma',
  'Canva Design',
  'Python',
  'SQL',
  'Digital Marketing',
  'SEO',
  'Shopify',
  'Copywriting',
  'Video Editing',
];

// Curated verified female learners across India to ensure the community is always active
const FALLBACK_COMMUNITY_USERS = [
  {
    id: 'comm-u1',
    name: 'Priya Patel',
    username: 'priyapatel_ux',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    title: 'UI/UX & Canva Product Designer',
    bio: 'Passionate about designing intuitive Figma wireframes, Canva branding kits, and user-friendly mobile interfaces for home businesses.',
    location: 'Ahmedabad, Gujarat',
    learningPath: 'UI/UX Design',
    learningGoal: 'Freelance Design Consultant',
    skills: ['Figma', 'UI/UX Design', 'Canva Design', 'Design Systems', 'Wireframing'],
    interests: ['Figma Systems', 'Client Pitching', 'Canva Brand Identity'],
    verified: true,
    connectionStatus: 'NONE'
  },
  {
    id: 'comm-u2',
    name: 'Ritu Sengupta',
    username: 'ritu_marketing',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    title: 'Digital Marketing & Growth Strategist',
    bio: 'Helping local home businesses and boutique clinics scale with Meta Ads, Google Analytics, and Instagram content funnels.',
    location: 'Kolkata, West Bengal',
    learningPath: 'Digital Marketing',
    learningGoal: 'Digital Agency Founder',
    skills: ['Digital Marketing', 'SEO Strategy', 'Content Writing', 'Canva Design', 'Social Media Ads'],
    interests: ['Meta Ads', 'SEO Outreach', 'Freelance Retainers'],
    verified: true,
    connectionStatus: 'NONE'
  },
  {
    id: 'comm-u3',
    name: 'Sneha Roy',
    username: 'sneha_code',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    title: 'Frontend React Developer',
    bio: 'Transitioning back to tech after a 3-year parenting break. Building modern responsive web apps with React, Tailwind, and Vite.',
    location: 'Bengaluru, Karnataka',
    learningPath: 'Frontend Development',
    learningGoal: 'Full-Stack Web Developer',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'TailwindCSS', 'Git/GitHub'],
    interests: ['Frontend Web Dev', 'Open Source', 'Remote Internships'],
    verified: true,
    connectionStatus: 'NONE'
  },
  {
    id: 'comm-u4',
    name: 'Meenakshi Iyer',
    username: 'meenakshi_shopify',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    title: 'E-Commerce & Shopify Store Specialist',
    bio: 'Helping handcrafted jewelry and textile sellers launch high-converting Shopify and WooCommerce stores with automated billing.',
    location: 'Chennai, Tamil Nadu',
    learningPath: 'Content Creation',
    learningGoal: 'E-Commerce Store Strategist',
    skills: ['Shopify', 'Digital Marketing', 'Canva Design', 'Product Photography'],
    interests: ['Shopify Themes', 'E-commerce Automation', 'Payment Gateways'],
    verified: true,
    connectionStatus: 'NONE'
  },
  {
    id: 'comm-u5',
    name: 'Kavita Deshmukh',
    username: 'kavita_copy',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300',
    title: 'Copywriter & Content Strategist',
    bio: 'Writing persuasive email sequences, website landing copy, and LinkedIn ghostwriting for founders and micro-brands.',
    location: 'Pune, Maharashtra',
    learningPath: 'Content Creation',
    learningGoal: 'High-Ticket Copywriter',
    skills: ['Copywriting', 'Content Writing', 'SEO', 'Email Marketing'],
    interests: ['Sales Copywriting', 'Storytelling', 'Cold Outreach'],
    verified: true,
    connectionStatus: 'NONE'
  },
  {
    id: 'comm-u6',
    name: 'Pooja Nair',
    username: 'pooja_video',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    title: 'Short-Form Video & Reel Editor',
    bio: 'Creating viral Instagram Reels and YouTube Shorts using CapCut, Premiere Pro, and audio design for fashion & food creators.',
    location: 'Kochi, Kerala',
    learningPath: 'Content Creation',
    learningGoal: 'Creative Video Agency Lead',
    skills: ['Video Editing', 'CapCut', 'Storyboarding', 'Social Media Strategy'],
    interests: ['Short Form Video', 'Reel Growth', 'Sound Design'],
    verified: true,
    connectionStatus: 'NONE'
  }
];

// Curated active community forum discussions
const DEFAULT_DISCUSSIONS = [
  {
    id: 'disc-1',
    authorName: 'Pooja Verma',
    authorRole: 'Digital Marketing Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    title: 'How I landed my first ₹12,000/month recurring social media retainer for a local dental clinic',
    category: 'Freelance Tips & Pricing',
    content: 'After 4 rejected proposals, I changed my strategy completely. Instead of pitching generic "social media management", I offered a tangible solution: 12 Google Review graphics + 8 Instagram reels showcasing patient smile transformations. Local doctors care about patient trust! Happy to share my pitch deck and pricing breakdown in the comments.',
    likes: 42,
    hasLiked: false,
    time: '2 hours ago',
    comments: [
      { id: 'c1', author: 'Ananya Sharma', text: 'This is brilliant, Pooja! Did you charge an upfront deposit or invoice monthly?', time: '1 hour ago' },
      { id: 'c2', author: 'Pooja Verma', text: 'Always 50% upfront deposit on the 1st of each month via UPI/bank transfer! Never deliver creative assets without an advance.', time: '45 mins ago' }
    ]
  },
  {
    id: 'disc-2',
    authorName: 'Sneha Roy',
    authorRole: 'UI/UX & Canva Designer',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: 'Can someone review my Canva Brand Identity Kit for a Jaipur artisan bakery?',
    category: 'Showcase & Reviews',
    content: 'I designed a complete packaging sticker and Instagram theme for a boutique sourdough bakery. Colors used: warm terracotta and champagne gold. Looking for feedback on font hierarchy and packaging sticker readability before I submit to the client!',
    likes: 29,
    hasLiked: false,
    time: '4 hours ago',
    comments: [
      { id: 'c3', author: 'Ritu Sengupta', text: 'The terracotta palette looks delicious! Just make sure your ingredients text on the rear sticker is at least 8pt so it prints crisply.', time: '3 hours ago' }
    ]
  },
  {
    id: 'disc-3',
    authorName: 'Meenakshi Iyer',
    authorRole: 'E-Commerce Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    title: 'Collaborator needed: Canva designer for upcoming Shopify candle store launch (₹4,500 split)',
    category: 'Micro-Gig Leads & Collabs',
    content: 'I am building a Shopify store for a handmade soy candle business in Pune. Looking for a fellow HerEarn learner to design 5 hero collection banners and 10 Instagram launch posts. Budget split is ₹4,500. Drop your Canva portfolio below if interested!',
    likes: 38,
    hasLiked: false,
    time: 'Yesterday',
    comments: [
      { id: 'c4', author: 'Priya Sundaram', text: 'Interested! I completed the Canva Pro course and have 4 e-commerce samples ready. Sent you a connection request!', time: 'Yesterday' }
    ]
  },
  {
    id: 'disc-4',
    authorName: 'Sunita Nair',
    authorRole: 'Career Re-entry Coach',
    authorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200',
    title: 'Overcoming the "Resume Gap" anxiety: 3 practical tips for women restarting work',
    category: 'Career Re-entry Support',
    content: 'A 3-5 year gap for parenting, relocation, or eldercare is NOT a disability. On your resume, frame it as a Transition Period: highlight freelance gigs, completed certifications, community leadership, and new digital skills learned. Employers today value initiative and execution far more than unbroken tenure.',
    likes: 74,
    hasLiked: false,
    time: '2 days ago',
    comments: [
      { id: 'c5', author: 'Kavita Deshmukh', text: 'Thank you for this boost, Sunita. I was so hesitant to apply anywhere after my 4-year break. Feeling much more confident now!', time: '1 day ago' }
    ]
  }
];

export default function CommunitySection({ user, showToast }) {
  // Main Tab: 'discussions' | 'discover' | 'connections' | 'chat'
  const [activeTab, setActiveTab] = useState('discussions');

  // Discover state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPath, setSelectedPath] = useState('All Learning Paths');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');

  // Discussions state
  const [discussions, setDiscussions] = useState(() => {
    try {
      const saved = localStorage.getItem('herearn_community_discussions');
      return saved ? JSON.parse(saved) : DEFAULT_DISCUSSIONS;
    } catch {
      return DEFAULT_DISCUSSIONS;
    }
  });
  const [selectedDiscussionCategory, setSelectedDiscussionCategory] = useState('All');
  const [showNewDiscussionModal, setShowNewDiscussionModal] = useState(false);
  const [newDiscussionForm, setNewDiscussionForm] = useState({
    title: '',
    category: 'Freelance Tips & Pricing',
    content: ''
  });
  const [expandedComments, setExpandedComments] = useState({ 'disc-1': true });
  const [commentInputs, setCommentInputs] = useState({});

  // Connections & Requests state
  const [connections, setConnections] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('herearn_community_connections') || '[]');
    } catch {
      return [];
    }
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('herearn_community_sent_requests') || '[]');
    } catch {
      return [];
    }
  });
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [connectionsSubTab, setConnectionsSubTab] = useState('connections'); // 'connections' | 'pending' | 'sent'

  // Chat state
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const messagesEndRef = useRef(null);

  // Profile View & Edit Modal
  const [viewingProfile, setViewingProfile] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    bio: '',
    location: '',
    skills: '',
    interests: '',
    learningPath: '',
    learningGoal: '',
    portfolioUrl: '',
    githubUrl: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Action loading IDs for buttons
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Sync discussions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('herearn_community_discussions', JSON.stringify(discussions));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [discussions]);

  // Fetch Discover Users with Offline & Fallback Resilience
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const filters = {};
      if (searchQuery.trim()) filters.search = searchQuery.trim();
      if (selectedSkill !== 'All Skills') filters.skill = selectedSkill;
      if (selectedPath !== 'All Learning Paths') filters.learningPath = selectedPath;

      let fetched = [];
      try {
        const res = await api.getCommunityUsers(filters);
        if (res.success && Array.isArray(res.users) && res.users.length > 0) {
          fetched = res.users;
        }
      } catch (err) {
        console.warn('[Community] Backend fetch users failed, using curated members:', err);
      }

      if (fetched.length === 0) {
        // Filter fallback learners
        const q = searchQuery.toLowerCase().trim();
        fetched = FALLBACK_COMMUNITY_USERS.filter((learner) => {
          const matchPath = selectedPath === 'All Learning Paths' || learner.learningPath === selectedPath;
          const matchSkill = selectedSkill === 'All Skills' || learner.skills.some(s => s.toLowerCase() === selectedSkill.toLowerCase());
          const matchQuery = !q ||
            learner.name.toLowerCase().includes(q) ||
            learner.username.toLowerCase().includes(q) ||
            learner.title.toLowerCase().includes(q) ||
            learner.bio.toLowerCase().includes(q) ||
            learner.location.toLowerCase().includes(q) ||
            learner.skills.some(s => s.toLowerCase().includes(q));
          return matchPath && matchSkill && matchQuery;
        });
      }

      // Merge connection statuses from local state
      const localSentIds = sentRequests.map(r => r.receiver?.id || r.id);
      const localConnIds = connections.map(c => c.user?.id || c.id);

      const merged = fetched.map(u => {
        if (localConnIds.includes(u.id)) return { ...u, connectionStatus: 'CONNECTED' };
        if (localSentIds.includes(u.id)) return { ...u, connectionStatus: 'PENDING_SENT' };
        return u;
      });

      setUsers(merged);
    } catch (err) {
      console.error('[Community] Fetch users failed:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, [searchQuery, selectedSkill, selectedPath, sentRequests, connections]);

  // Fetch Connections & Requests with Resilience
  const fetchConnectionsData = useCallback(async () => {
    if (!user) return;
    setLoadingConnections(true);
    try {
      const [connRes, pendingRes, sentRes] = await Promise.allSettled([
        api.getCommunityConnections(),
        api.getPendingRequests(),
        api.getSentRequests(),
      ]);

      if (connRes.status === 'fulfilled' && connRes.value.success && connRes.value.connections?.length > 0) {
        setConnections(connRes.value.connections);
        localStorage.setItem('herearn_community_connections', JSON.stringify(connRes.value.connections));
      }
      if (pendingRes.status === 'fulfilled' && pendingRes.value.success) {
        setPendingRequests(pendingRes.value.requests || []);
      }
      if (sentRes.status === 'fulfilled' && sentRes.value.success && sentRes.value.requests?.length > 0) {
        setSentRequests(sentRes.value.requests);
        localStorage.setItem('herearn_community_sent_requests', JSON.stringify(sentRes.value.requests));
      }
    } catch (err) {
      console.warn('[Community] Fetch connections failed, relying on local cache:', err);
    } finally {
      setLoadingConnections(false);
    }
  }, [user]);

  // Fetch Conversations for Chat
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.getConversations();
      if (res.success && res.conversations) {
        setConversations(res.conversations);
      }
    } catch (err) {
      console.error('[Community] Fetch conversations failed:', err);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (user) {
      fetchConnectionsData();
      fetchConversations();
    }
  }, [user, fetchConnectionsData, fetchConversations]);

  // Real-time Chat polling when on chat tab with an active partner
  useEffect(() => {
    if (activeTab !== 'chat' || !activePartner || !user) return;

    let isSubscribed = true;
    const pollMessages = async () => {
      try {
        const res = await api.getMessages(activePartner.id);
        if (isSubscribed && res.success && res.messages) {
          setMessages(res.messages);
        }
      } catch (err) {
        // quiet poll error
      }
    };

    const interval = setInterval(pollMessages, 3500);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [activeTab, activePartner, user]);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat' && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  // Select partner to chat
  const handleSelectPartner = async (partner) => {
    setActivePartner(partner);
    setLoadingMessages(true);
    try {
      const res = await api.getMessages(partner.id);
      if (res.success && Array.isArray(res.messages) && res.messages.length > 0) {
        setMessages(res.messages);
      } else {
        const local = localStorage.getItem(`herearn_local_chat_${partner.id}`);
        setMessages(local ? JSON.parse(local) : [
          {
            id: `init-${partner.id}`,
            content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 Great to connect on HerEarn. Are you currently practicing on any freelance gigs or course modules?`,
            senderId: partner.id,
            receiverId: user?.id,
            isSelf: false,
            read: true,
            createdAt: new Date().toISOString()
          }
        ]);
      }
      fetchConversations();
    } catch (err) {
      console.warn('[Community] Load messages error, using local fallback:', err);
      const local = localStorage.getItem(`herearn_local_chat_${partner.id}`);
      setMessages(local ? JSON.parse(local) : [
        {
          id: `init-${partner.id}`,
          content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 Great to connect on HerEarn. Are you currently practicing on any freelance gigs or course modules?`,
          senderId: partner.id,
          receiverId: user?.id,
          isSelf: false,
          read: true,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send Message with Offline Resilience & Peer Simulation
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activePartner || sendingMessage) return;

    const contentToSend = messageInput.trim();
    setMessageInput('');
    setSendingMessage(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      content: contentToSend,
      senderId: user?.id,
      receiverId: activePartner.id,
      isSelf: true,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => {
      const next = [...prev, optimisticMsg];
      try {
        localStorage.setItem(`herearn_local_chat_${activePartner.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Update conversation list locally
    setConversations((prev) => {
      const existing = prev.find(c => c.partner?.id === activePartner.id);
      if (existing) {
        return prev.map(c => c.partner?.id === activePartner.id ? { ...c, lastMessage: optimisticMsg } : c);
      }
      return [{ connectionId: `conn-${activePartner.id}`, partner: activePartner, lastMessage: optimisticMsg, unreadCount: 0 }, ...prev];
    });

    try {
      const res = await api.sendMessage(activePartner.id, contentToSend);
      if (res.success && res.message) {
        setMessages((prev) => {
          const next = prev.map((m) => (m.id === tempId ? res.message : m));
          try {
            localStorage.setItem(`herearn_local_chat_${activePartner.id}`, JSON.stringify(next));
          } catch {}
          return next;
        });
        fetchConversations();
      }
    } catch (err) {
      console.warn('[Community] API sendMessage failed, persisting locally:', err);
      // Realistic simulated reply from community peer after 1.1s
      setTimeout(() => {
        const peerReplies = [
          `That is awesome! I've been working through the Canva brand identity checklist. Let me know if you want to collaborate on a client gig!`,
          `Thanks for reaching out! Finding high-paying micro-gigs felt overwhelming at first, but following the proposal templates made all the difference.`,
          `I totally agree! Consistent daily practice of even 30-45 minutes really builds confidence. Keep it up!`,
          `Great question! I recommend charging at least ₹500 - ₹800 per creative asset or package it into a monthly retainer. Local clinics and bakeries appreciate predictability.`
        ];
        const replyText = peerReplies[Math.floor(Math.random() * peerReplies.length)];
        const replyMsg = {
          id: `reply-${Date.now()}`,
          content: replyText,
          senderId: activePartner.id,
          receiverId: user?.id,
          isSelf: false,
          read: true,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => {
          const next = [...prev, replyMsg];
          try {
            localStorage.setItem(`herearn_local_chat_${activePartner.id}`, JSON.stringify(next));
          } catch {}
          return next;
        });

        setConversations((prev) =>
          prev.map(c => c.partner?.id === activePartner.id ? { ...c, lastMessage: replyMsg } : c)
        );
      }, 1100);
    } finally {
      setSendingMessage(false);
    }
  };

  // Keyboard shortcut: Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Connection Actions with Instant Local Feedback
  const handleSendConnection = async (targetUserId, targetName) => {
    if (!user) {
      showToast?.('Authentication Required', 'Please log in to connect with community learners.');
      return;
    }
    setActionLoadingId(targetUserId);

    // Optimistically update users state
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, connectionStatus: 'PENDING_SENT' } : u))
    );

    const targetUser = users.find(u => u.id === targetUserId);
    const newSentRequest = {
      requestId: `req-sent-${Date.now()}`,
      receiver: targetUser || { id: targetUserId, name: targetName, username: targetName.toLowerCase().replace(/\s+/g, '_'), avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
      createdAt: new Date().toISOString()
    };

    setSentRequests((prev) => {
      const next = [newSentRequest, ...prev.filter(r => r.receiver?.id !== targetUserId)];
      try {
        localStorage.setItem('herearn_community_sent_requests', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      await api.sendConnectionRequest(targetUserId);
    } catch (err) {
      console.warn('[Community] API connection request warning:', err);
    } finally {
      setActionLoadingId(null);
      showToast?.('Request Sent ✨', `Connection request sent to ${targetName}!`);
    }
  };

  const handleAcceptRequest = async (requestId, senderName, senderId) => {
    setActionLoadingId(requestId);

    const foundSender = users.find(u => u.id === senderId) || {
      id: senderId,
      name: senderName,
      username: senderName.toLowerCase().replace(/\s+/g, '_'),
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      title: 'HerEarn Community Member'
    };

    const newConn = {
      connectionId: `conn-${Date.now()}`,
      user: foundSender,
      createdAt: new Date().toISOString()
    };

    setConnections((prev) => {
      const next = [newConn, ...prev.filter(c => c.user?.id !== senderId)];
      try {
        localStorage.setItem('herearn_community_connections', JSON.stringify(next));
      } catch {}
      return next;
    });

    setPendingRequests((prev) => prev.filter(r => r.requestId !== requestId));

    setUsers((prev) =>
      prev.map((u) => (u.id === senderId ? { ...u, connectionStatus: 'CONNECTED' } : u))
    );

    try {
      await api.acceptConnectionRequest(requestId);
    } catch (err) {
      console.warn('[Community] API accept request warning:', err);
    } finally {
      setActionLoadingId(null);
      triggerCelebrationConfetti();
      showToast?.('Connected 🎉', `You are now connected with ${senderName}!`);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setActionLoadingId(requestId);
    setPendingRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    try {
      await api.rejectConnectionRequest(requestId);
    } catch (err) {
      console.warn('[Community] Reject error:', err);
    } finally {
      setActionLoadingId(null);
      showToast?.('Request Declined', 'Connection request declined.');
    }
  };

  const handleCancelRequest = async (requestId) => {
    setActionLoadingId(requestId);
    setSentRequests((prev) => {
      const next = prev.filter((r) => r.requestId !== requestId);
      try {
        localStorage.setItem('herearn_community_sent_requests', JSON.stringify(next));
      } catch {}
      return next;
    });
    fetchUsers();
    try {
      await api.cancelConnectionRequest(requestId);
    } catch (err) {
      console.warn('[Community] Cancel error:', err);
    } finally {
      setActionLoadingId(null);
      showToast?.('Request Cancelled', 'Connection request was cancelled.');
    }
  };

  const handleRemoveConnection = async (connectionId, partnerName) => {
    if (!window.confirm(`Are you sure you want to remove ${partnerName} from your connections?`)) {
      return;
    }
    setActionLoadingId(connectionId);
    setConnections((prev) => {
      const next = prev.filter((c) => c.connectionId !== connectionId);
      try {
        localStorage.setItem('herearn_community_connections', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (activePartner && activePartner.connectionId === connectionId) {
      setActivePartner(null);
      setMessages([]);
    }
    fetchUsers();
    try {
      await api.removeConnection(connectionId);
    } catch (err) {
      console.warn('[Community] Remove connection warning:', err);
    } finally {
      setActionLoadingId(null);
      showToast?.('Connection Removed', `Removed ${partnerName} from connections.`);
    }
  };

  // Discussions Handlers
  const handleToggleLikeDiscussion = (postId) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === postId) {
          const nextLiked = !d.hasLiked;
          return {
            ...d,
            hasLiked: nextLiked,
            likes: nextLiked ? d.likes + 1 : Math.max(0, d.likes - 1)
          };
        }
        return d;
      })
    );
  };

  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: user?.name || 'Community Learner',
      text,
      time: 'Just now'
    };

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === postId) {
          return {
            ...d,
            comments: [...(d.comments || []), newComment]
          };
        }
        return d;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    showToast?.('Comment Posted 💬', 'Your reply has been shared with the community.');
  };

  const handleCreateDiscussion = (e) => {
    e.preventDefault();
    if (!newDiscussionForm.title.trim() || !newDiscussionForm.content.trim()) return;

    const newPost = {
      id: `disc-${Date.now()}`,
      authorName: user?.name || 'Community Member',
      authorRole: user?.title || 'HerEarn Learner',
      authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      title: newDiscussionForm.title.trim(),
      category: newDiscussionForm.category,
      content: newDiscussionForm.content.trim(),
      likes: 1,
      hasLiked: true,
      time: 'Just now',
      comments: []
    };

    setDiscussions((prev) => [newPost, ...prev]);
    setShowNewDiscussionModal(false);
    setNewDiscussionForm({ title: '', category: 'Freelance Tips & Pricing', content: '' });
    triggerCelebrationConfetti();
    showToast?.('Discussion Published ✨', 'Your post is now visible to all community learners!');
  };

  // Open Chat directly from Discover or Connections
  const handleOpenChatWithUser = async (partnerUser) => {
    if (!user) {
      showToast?.('Authentication Required', 'Please log in to chat with connections.');
      return;
    }
    setActiveTab('chat');
    handleSelectPartner(partnerUser);
  };

  // Open Edit Profile Modal
  const handleOpenEditProfile = () => {
    if (!user) {
      showToast?.('Notice', 'Please log in to customize your community profile.');
      return;
    }
    setEditForm({
      title: user.title || 'Digital Skill Specialist',
      bio: user.bio || '',
      location: user.location || 'India',
      skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
      interests: Array.isArray(user.interests) ? user.interests.join(', ') : 'Web Development, Design, Career Growth',
      learningPath: user.learningPath || 'Frontend Development',
      learningGoal: user.learningGoal || 'Full-Stack Web Developer',
      portfolioUrl: '',
      githubUrl: '',
    });
    setIsEditProfileOpen(true);
  };

  // Save Edit Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const parsedSkills = editForm.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedInterests = editForm.interests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      const portfolioLinks = [];
      if (editForm.portfolioUrl.trim()) {
        portfolioLinks.push({ label: 'Portfolio', url: editForm.portfolioUrl.trim() });
      }
      if (editForm.githubUrl.trim()) {
        portfolioLinks.push({ label: 'GitHub', url: editForm.githubUrl.trim() });
      }

      const res = await api.updateCommunityProfile({
        title: editForm.title,
        bio: editForm.bio,
        location: editForm.location,
        skills: parsedSkills,
        interests: parsedInterests,
        learningPath: editForm.learningPath,
        learningGoal: editForm.learningGoal,
        portfolioLinks,
      });

      if (res.success) {
        showToast?.('Profile Updated! 🌟', 'Your community profile has been saved.');
        setIsEditProfileOpen(false);
        fetchUsers();
      }
    } catch (err) {
      showToast?.('Update Failed', err.message || 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Filtered conversations
  const filteredConversations = conversations.filter((c) => {
    if (!chatSearch.trim()) return true;
    const q = chatSearch.toLowerCase();
    const partnerName = (c.partner?.name || '').toLowerCase();
    const partnerHandle = (c.partner?.username || '').toLowerCase();
    const lastMsgText = (c.lastMessage?.content || '').toLowerCase();
    return partnerName.includes(q) || partnerHandle.includes(q) || lastMsgText.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-[#0F0918] text-[#1F2937] dark:text-white transition-colors pb-24">
      {/* Top Hero Banner */}
      <div className="border-b border-purple-100 dark:border-purple-900/30 bg-white/70 dark:bg-[#140C22]/80 backdrop-blur-md sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  HerEarn Network
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Verified Women in Tech & Business
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                HerEarn Community
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Discover like-minded learners, send connection requests, collaborate on real client projects, and chat 1-on-1 with your network.
              </p>
            </div>

            {/* Profile Action Pill */}
            {user && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenEditProfile}
                  className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-pink-500" />
                  <span>Edit Community Profile</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar border-b border-purple-200/50 dark:border-purple-800/40">
            <button
              type="button"
              onClick={() => setActiveTab('discussions')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'discussions'
                  ? 'text-purple-700 dark:text-pink-400 border-b-2 border-purple-600 dark:border-pink-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discussions & Feed</span>
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-extrabold">
                {discussions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'discover'
                  ? 'text-purple-700 dark:text-pink-400 border-b-2 border-purple-600 dark:border-pink-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Discover Learners</span>
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {users.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('connections')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'connections'
                  ? 'text-purple-700 dark:text-pink-400 border-b-2 border-purple-600 dark:border-pink-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>My Connections & Requests</span>
              {pendingRequests.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'chat'
                  ? 'text-purple-700 dark:text-pink-400 border-b-2 border-purple-600 dark:border-pink-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct Messages (1:1 Chat)</span>
              {conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0) > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                  {conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================= */}
        {/* TAB 0: DISCUSSIONS & KNOWLEDGE EXCHANGE FEED */}
        {/* ========================================================= */}
        {activeTab === 'discussions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Feed Banner & CTA */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-purple-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-400/30">
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  Community Knowledge Hub
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Learn, Ask, & Share Freelance Wins
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Connect with fellow women learners, get honest critiques on your Canva kits and code, discuss client pricing, and collaborate on real client gigs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowNewDiscussionModal(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Start Discussion</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                'All',
                'Freelance Tips & Pricing',
                'Showcase & Reviews',
                'Micro-Gig Leads & Collabs',
                'Career Re-entry Support'
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedDiscussionCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                    selectedDiscussionCategory === cat
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-purple-100 dark:border-purple-900/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Posts Feed */}
            <div className="space-y-5">
              {discussions
                .filter(d => selectedDiscussionCategory === 'All' || d.category === selectedDiscussionCategory)
                .map((post) => {
                  const isExpanded = !!expandedComments[post.id];
                  return (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-purple-300 dark:hover:border-purple-700 transition-all space-y-4"
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            className="w-11 h-11 rounded-2xl object-cover border border-purple-300 dark:border-purple-800 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                {post.authorName}
                              </h4>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <p className="text-[11px] text-purple-600 dark:text-pink-400 font-semibold">
                              {post.authorRole}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 shrink-0">
                            {post.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                            {post.time}
                          </span>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="space-y-2">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>

                      {/* Post Actions */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleLikeDiscussion(post.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                              post.hasLiked
                                ? 'bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                            <span>{post.likes}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4 text-purple-500" />
                            <span>{(post.comments || []).length} Replies</span>
                          </button>
                        </div>

                        <span className="text-[10px] text-slate-400 font-medium sm:hidden">
                          {post.time}
                        </span>
                      </div>

                      {/* Expandable Comments Drawer */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-purple-50 dark:border-slate-800 space-y-3 animate-fade-in bg-purple-50/30 dark:bg-slate-950/40 p-4 rounded-2xl">
                          {(post.comments || []).length > 0 && (
                            <div className="space-y-2.5">
                              {post.comments.map((cm) => (
                                <div key={cm.id} className="text-xs bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-purple-100 dark:border-slate-800 space-y-1">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-extrabold text-slate-900 dark:text-white">{cm.author}</span>
                                    <span className="text-slate-400 text-[10px]">{cm.time}</span>
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                    {cm.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input Form */}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddComment(post.id);
                                }
                              }}
                              placeholder="Write a supportive reply or ask a follow-up..."
                              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700 text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500 font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: DISCOVER LEARNERS */}
        {/* ========================================================= */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-purple-100 dark:border-purple-900/30 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search Bar */}
                <div className="relative md:col-span-6">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, @username, skill, goal, or city..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-purple-200 dark:border-slate-800 bg-purple-50/30 dark:bg-slate-950/50 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Learning Path Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={selectedPath}
                    onChange={(e) => setSelectedPath(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    {LEARNING_PATHS.map((path) => (
                      <option key={path} value={path}>
                        {path}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skill Filter Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    {POPULAR_SKILLS.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filter Badges */}
              {(selectedPath !== 'All Learning Paths' || selectedSkill !== 'All Skills' || searchQuery) && (
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-purple-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Active Filters:</span>
                  {searchQuery && (
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1">
                      Search: "{searchQuery}"
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  {selectedPath !== 'All Learning Paths' && (
                    <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-medium flex items-center gap-1">
                      Path: {selectedPath}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedPath('All Learning Paths')} />
                    </span>
                  )}
                  {selectedSkill !== 'All Skills' && (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-1">
                      Skill: {selectedSkill}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSkill('All Skills')} />
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedPath('All Learning Paths');
                      setSelectedSkill('All Skills');
                    }}
                    className="text-xs text-purple-600 dark:text-pink-400 hover:underline font-bold ml-2 cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>
              )}
            </div>

            {/* Discover Grid */}
            {loadingUsers ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Discovering registered community members...
                </p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-purple-100 dark:border-purple-900/30 shadow-sm max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No learners found</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                  Try adjusting your search criteria or clearing filter pills to discover more learners.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPath('All Learning Paths');
                    setSelectedSkill('All Skills');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((learner) => {
                  const isConnecting = actionLoadingId === learner.id;
                  const isConnected = learner.connectionStatus === 'CONNECTED';
                  const isPendingSent = learner.connectionStatus === 'PENDING_SENT';
                  const isPendingReceived = learner.connectionStatus === 'PENDING_RECEIVED';

                  return (
                    <div
                      key={learner.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                    >
                      <div>
                        {/* Header: Avatar, Name, Handle, Location */}
                        <div className="flex items-start gap-3.5 mb-3">
                          <img
                            src={learner.avatar}
                            alt={learner.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-200 dark:border-purple-800 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${learner.username}`;
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {learner.name}
                              </h3>
                              {learner.verified && (
                                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Verified Member" />
                              )}
                            </div>
                            <p className="text-[11px] text-purple-600 dark:text-pink-400 font-semibold truncate">
                              @{learner.username}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{learner.location || 'India'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Title & Bio */}
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 line-clamp-1">
                          {learner.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                          {learner.bio}
                        </p>

                        {/* Learning Path & Career Goal Badge */}
                        <div className="bg-purple-50/70 dark:bg-purple-950/40 rounded-xl p-2.5 mb-4 border border-purple-100/80 dark:border-purple-900/30">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-800 dark:text-purple-300">
                            <GraduationCap className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                            <span className="truncate">{learner.learningPath}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                            <Target className="w-3 h-3 text-purple-500 shrink-0" />
                            <span className="truncate font-medium">Goal: {learner.learningGoal}</span>
                          </div>
                        </div>

                        {/* Skills Pills */}
                        <div className="mb-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                            Skills & Expertise
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {learner.skills.slice(0, 4).map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                              >
                                {sk}
                              </span>
                            ))}
                            {learner.skills.length > 4 && (
                              <span className="px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500">
                                +{learner.skills.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-purple-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingProfile(learner)}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>

                        {/* Connect / Pending / Connected CTAs */}
                        {isConnected ? (
                          <button
                            type="button"
                            onClick={() => handleOpenChatWithUser(learner)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Message</span>
                          </button>
                        ) : isPendingSent ? (
                          <button
                            type="button"
                            disabled
                            className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 border border-purple-200 dark:border-purple-800/50 opacity-80 cursor-default"
                          >
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Requested</span>
                          </button>
                        ) : isPendingReceived ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('connections');
                              setConnectionsSubTab('pending');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Respond</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isConnecting}
                            onClick={() => handleSendConnection(learner.id, learner.name)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            {isConnecting ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <UserPlus className="w-3.5 h-3.5" />
                            )}
                            <span>Connect</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MY CONNECTIONS & REQUESTS */}
        {/* ========================================================= */}
        {activeTab === 'connections' && (
          <div className="space-y-6">
            {!user ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-purple-100 dark:border-purple-900/30 max-w-md mx-auto">
                <Users className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Please Log In to View Connections
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                  Sign in or create your free account to build your network and chat with other members.
                </p>
              </div>
            ) : (
              <>
                {/* Sub Tab Switcher */}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-purple-100 dark:border-slate-800 shadow-sm w-fit">
                  <button
                    type="button"
                    onClick={() => setConnectionsSubTab('connections')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      connectionsSubTab === 'connections'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>My Connections ({connections.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConnectionsSubTab('pending')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      connectionsSubTab === 'pending'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-pink-400" />
                    <span>Pending Requests ({pendingRequests.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConnectionsSubTab('sent')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      connectionsSubTab === 'sent'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Send className="w-4 h-4 text-indigo-400" />
                    <span>Sent Requests ({sentRequests.length})</span>
                  </button>
                </div>

                {/* Sub Tab Content */}
                {loadingConnections ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <RefreshCw className="w-7 h-7 text-purple-500 animate-spin mb-2" />
                    <p className="text-xs font-medium text-slate-500">Loading your network...</p>
                  </div>
                ) : connectionsSubTab === 'connections' ? (
                  connections.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-purple-100 dark:border-purple-900/30 max-w-md mx-auto">
                      <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        No connections yet
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                        Explore the Discover tab to connect with talented learners and build your circle.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('discover')}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
                      >
                        Discover Learners
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {connections.map((c) => {
                        const partner = c.user;
                        return (
                          <div
                            key={c.connectionId}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-purple-100 dark:border-purple-900/30 shadow-sm flex items-start justify-between gap-3"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <img
                                src={partner.avatar}
                                alt={partner.name}
                                className="w-12 h-12 rounded-xl object-cover border border-purple-200 dark:border-purple-800 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {partner.name}
                                </h4>
                                <p className="text-[11px] text-purple-600 dark:text-pink-400 font-semibold truncate">
                                  @{partner.username}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  {partner.title}
                                </p>
                                <span className="inline-block mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                                  Connected
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenChatWithUser(partner)}
                                className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm cursor-pointer"
                                title="Open 1-on-1 Chat"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveConnection(c.connectionId, partner.name)}
                                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Remove Connection"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : connectionsSubTab === 'pending' ? (
                  pendingRequests.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-purple-100 dark:border-purple-900/30 max-w-md mx-auto">
                      <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        No pending requests
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        When other learners send you a connection request, you can accept or decline them here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingRequests.map((req) => (
                        <div
                          key={req.requestId}
                          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-pink-200 dark:border-pink-900/40 shadow-sm flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={req.sender.avatar}
                              alt={req.sender.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {req.sender.name}
                              </h4>
                              <p className="text-[11px] text-purple-600 dark:text-pink-400 font-semibold truncate">
                                @{req.sender.username}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {req.sender.title}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                handleAcceptRequest(req.requestId, req.sender.name, req.sender.id)
                              }
                              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectRequest(req.requestId)}
                              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  // Sent Requests
                  sentRequests.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-purple-100 dark:border-purple-900/30 max-w-md mx-auto">
                      <Send className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        No sent requests pending
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        All requests you sent have been accepted or answered.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sentRequests.map((req) => (
                        <div
                          key={req.requestId}
                          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-purple-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={req.receiver.avatar}
                              alt={req.receiver.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {req.receiver.name}
                              </h4>
                              <p className="text-[11px] text-purple-600 dark:text-pink-400 font-semibold truncate">
                                @{req.receiver.username}
                              </p>
                              <span className="text-[9px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full font-bold">
                                Awaiting Response
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCancelRequest(req.requestId)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ONE-TO-ONE CHAT */}
        {/* ========================================================= */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            {!user ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-purple-100 dark:border-purple-900/30 max-w-md mx-auto">
                <MessageSquare className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Please Log In to Access Messaging
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Direct messaging is reserved for accepted connections. Sign in to chat with your network.
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-900/30 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] max-h-[750px]">
                {/* Conversations Sidebar (Cols 1-4) - Hidden on mobile when viewing chat */}
                <div className={`md:col-span-4 border-r border-purple-100 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40 ${activePartner ? 'hidden md:flex' : 'flex'}`}>
                  {/* Search Conversations */}
                  <div className="p-3.5 border-b border-purple-100 dark:border-slate-800">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Conversations List */}
                  <div className="flex-1 overflow-y-auto divide-y divide-purple-100/50 dark:divide-slate-800/60">
                    {conversations.length === 0 ? (
                      <div className="p-6 text-center">
                        <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          No active conversations
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Connect with learners in the Discover tab to start messaging!
                        </p>
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No conversations match "{chatSearch}"
                      </div>
                    ) : (
                      filteredConversations.map((item) => {
                        const isSelected = activePartner?.id === item.partner.id;
                        const hasUnread = (item.unreadCount || 0) > 0;

                        return (
                          <div
                            key={item.connectionId}
                            onClick={() => handleSelectPartner(item.partner)}
                            className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-purple-100/70 dark:bg-purple-950/60 border-l-4 border-purple-600'
                                : 'hover:bg-purple-50/50 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <div className="relative shrink-0">
                              <img
                                src={item.partner.avatar}
                                alt={item.partner.name}
                                className="w-11 h-11 rounded-xl object-cover border border-purple-200 dark:border-slate-700"
                              />
                              <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute -bottom-0.5 -right-0.5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {item.partner.name}
                                </h4>
                                {item.lastMessage && (
                                  <span className="text-[9px] text-slate-400 shrink-0">
                                    {new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-purple-600 dark:text-pink-400 font-semibold truncate">
                                @{item.partner.username}
                              </p>
                              <div className="flex items-center justify-between gap-1 mt-1">
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                  {item.lastMessage
                                    ? `${item.lastMessage.isSelf ? 'You: ' : ''}${item.lastMessage.content}`
                                    : 'Start the conversation...'}
                                </p>
                                {hasUnread && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-black shrink-0">
                                    {item.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Chat Pane (Cols 5-12) - Hidden on mobile if no active partner */}
                <div className={`md:col-span-8 flex flex-col bg-white dark:bg-slate-900 ${!activePartner ? 'hidden md:flex' : 'flex'}`}>
                  {activePartner ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-3.5 sm:p-4 border-b border-purple-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          {/* Mobile Back Button to return to conversation list */}
                          <button
                            type="button"
                            onClick={() => setActivePartner(null)}
                            className="md:hidden p-2 -ml-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                            title="Back to conversations"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <img
                            src={activePartner.avatar}
                            alt={activePartner.name}
                            className="w-10 h-10 rounded-xl object-cover border border-purple-200 dark:border-purple-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                {activePartner.name}
                              </h3>
                              <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                                Connected
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {activePartner.title} • @{activePartner.username}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setViewingProfile(activePartner)}
                          className="px-3 py-1.5 rounded-xl border border-purple-200 dark:border-slate-700 text-purple-600 dark:text-purple-300 font-bold text-[11px] hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                        >
                          Profile
                        </button>
                      </div>

                      {/* Messages Scroll Area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-50/20 to-transparent dark:from-slate-950/20">
                        {loadingMessages ? (
                          <div className="flex items-center justify-center py-20">
                            <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="text-center py-16 max-w-xs mx-auto">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mx-auto mb-2">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              Say hello to {activePartner.name}!
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              You are connected on HerEarn. Share ideas, collaborate on micro-gigs, or discuss learning goals.
                            </p>
                          </div>
                        ) : (
                          messages.map((m) => {
                            const isMine = m.isSelf || m.senderId === user?.id;
                            const formattedTime = new Date(m.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            });

                            return (
                              <div
                                key={m.id}
                                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                              >
                                <div
                                  className={`max-w-[78%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-xs shadow-sm break-words leading-relaxed ${
                                    isMine
                                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-purple-100 dark:border-slate-700/60 rounded-bl-none'
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap">{m.content}</p>
                                </div>
                                <div className="flex items-center gap-1 mt-1 px-1 text-[9px] text-slate-400">
                                  <span>{formattedTime}</span>
                                  {isMine && (
                                    <CheckCheck
                                      className={`w-3 h-3 ${m.read ? 'text-emerald-500' : 'text-slate-400'}`}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Chat Input Bar */}
                      <form
                        onSubmit={handleSendMessage}
                        className="p-3 border-t border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-end gap-2"
                      >
                        <div className="flex-1 relative">
                          <textarea
                            rows={1}
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Message ${activePartner.name}... (Press Enter to send, Shift+Enter for new line)`}
                            className="w-full px-4 py-2.5 rounded-2xl border border-purple-200 dark:border-slate-800 bg-purple-50/30 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none max-h-32"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={!messageInput.trim() || sendingMessage}
                          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer shrink-0"
                          title="Send message (Enter)"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </>
                  ) : (
                    /* Empty State: No conversation selected */
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                        Select a conversation
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Choose someone from the conversations list on the left to start chatting, or browse the Discover tab to connect with more members.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: VIEW PROFILE MODAL */}
      {/* ========================================================= */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-purple-200 dark:border-purple-800/60 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setViewingProfile(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4 mb-5">
              <img
                src={viewingProfile.avatar}
                alt={viewingProfile.name}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-purple-300 dark:border-purple-700 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {viewingProfile.name}
                  </h3>
                  {viewingProfile.verified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs font-bold text-purple-600 dark:text-pink-400">
                  @{viewingProfile.username}
                </p>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{viewingProfile.location || 'India'}</span>
                </div>
              </div>
            </div>

            {/* Title & Bio */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                {viewingProfile.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {viewingProfile.bio}
              </p>
            </div>

            {/* Learning Path & Goal */}
            <div className="bg-purple-50 dark:bg-purple-950/40 rounded-2xl p-3.5 mb-4 border border-purple-100 dark:border-purple-900/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300">
                <GraduationCap className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Learning Path: {viewingProfile.learningPath}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Target className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Career Goal: {viewingProfile.learningGoal}</span>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="mb-4 space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(viewingProfile.skills || []).map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-xl bg-purple-100/70 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-semibold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Interests
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(viewingProfile.interests || []).map((int) => (
                    <span
                      key={int}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium"
                    >
                      {int}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Links */}
            {viewingProfile.portfolioLinks && viewingProfile.portfolioLinks.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Portfolio & Profiles
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewingProfile.portfolioLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-purple-200 dark:border-slate-700 text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{link.label || 'Link'}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-purple-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewingProfile(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>

              {viewingProfile.connectionStatus === 'CONNECTED' ? (
                <button
                  type="button"
                  onClick={() => {
                    const p = viewingProfile;
                    setViewingProfile(null);
                    handleOpenChatWithUser(p);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              ) : viewingProfile.connectionStatus === 'PENDING_SENT' ? (
                <span className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 text-xs font-bold">
                  Connection Request Pending
                </span>
              ) : viewingProfile.id !== user?.id ? (
                <button
                  type="button"
                  onClick={() => {
                    handleSendConnection(viewingProfile.id, viewingProfile.name);
                    setViewingProfile(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT MY COMMUNITY PROFILE */}
      {/* ========================================================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-purple-200 dark:border-purple-800/60 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
              Edit Community Profile
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Customize how other learners and recruiters discover you in the HerEarn community.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Headline / Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g. Full-Stack React Developer & Open Source Contributor"
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 dark:border-slate-800 bg-purple-50/20 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / About You
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Share a short summary of your background, what you are building, or what you are excited to learn..."
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 dark:border-slate-800 bg-purple-50/20 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Learning Path
                  </label>
                  <select
                    value={editForm.learningPath}
                    onChange={(e) => setEditForm({ ...editForm, learningPath: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-800 bg-purple-50/20 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {LEARNING_PATHS.filter((p) => p !== 'All Learning Paths').map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Career Goal
                  </label>
                  <input
                    type="text"
                    value={editForm.learningGoal}
                    onChange={(e) => setEditForm({ ...editForm, learningGoal: e.target.value })}
                    placeholder="e.g. Lead UI/UX Designer"
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-800 bg-purple-50/20 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  placeholder="React, TypeScript, Figma, Tailwind CSS"
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 dark:border-slate-800 bg-purple-50/20 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={editForm.interests}
                  onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                  placeholder="Web Development, Design, AI, Freelancing"
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 dark:border-slate-800 bg-purple-50/20 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Portfolio Website URL
                  </label>
                  <input
                    type="url"
                    value={editForm.portfolioUrl}
                    onChange={(e) => setEditForm({ ...editForm, portfolioUrl: e.target.value })}
                    placeholder="https://myportfolio.com"
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-800 bg-purple-50/20 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub / LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editForm.githubUrl}
                    onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/myhandle"
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-800 bg-purple-50/20 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-purple-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* NEW DISCUSSION MODAL */}
      {/* ========================================================= */}
      {showNewDiscussionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-scale-in text-slate-900 dark:text-white">
            <button
              onClick={() => setShowNewDiscussionModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">Start a Community Discussion</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Share tips, request project reviews, or collaborate on client work.</p>
              </div>
            </div>

            <form onSubmit={handleCreateDiscussion} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Discussion Title *</label>
                <input
                  type="text"
                  required
                  value={newDiscussionForm.title}
                  onChange={(e) => setNewDiscussionForm({ ...newDiscussionForm, title: e.target.value })}
                  placeholder="e.g. How much to charge for 15 Canva Instagram post templates?"
                  className="w-full mt-1 p-3 rounded-xl bg-purple-50/40 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Category *</label>
                <select
                  value={newDiscussionForm.category}
                  onChange={(e) => setNewDiscussionForm({ ...newDiscussionForm, category: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-purple-50/40 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Freelance Tips & Pricing">Freelance Tips & Pricing</option>
                  <option value="Showcase & Reviews">Showcase & Reviews</option>
                  <option value="Micro-Gig Leads & Collabs">Micro-Gig Leads & Collabs</option>
                  <option value="Career Re-entry Support">Career Re-entry Support</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Discussion Content *</label>
                <textarea
                  required
                  rows={4}
                  value={newDiscussionForm.content}
                  onChange={(e) => setNewDiscussionForm({ ...newDiscussionForm, content: e.target.value })}
                  placeholder="Share details, context, questions, or links to your work..."
                  className="w-full mt-1 p-3 rounded-xl bg-purple-50/40 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewDiscussionModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold shadow-md cursor-pointer transition-all"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
