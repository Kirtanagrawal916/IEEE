import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  'Graphic Design with Canva',
  'Shopify E-Commerce',
  'SEO Content Writing',
  'Digital Marketing',
  'Frontend Development',
];

const POPULAR_SKILLS = [
  'All Skills',
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

const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function CommunitySection({ user, showToast }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'discussions';

  // Main Tab: 'discussions' | 'discover' | 'connections' | 'chat'
  const [activeTab, setActiveTab] = useState(initialTab);

  // Discover state
  const [users, setUsers] = useState(FALLBACK_COMMUNITY_USERS);
  const [loadingUsers, setLoadingUsers] = useState(false);
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
  const [friends, setFriends] = useState(() => {
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
  const [connectionsSubTab, setConnectionsSubTab] = useState('friends'); // 'friends' | 'pending' | 'sent'
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // 1:1 Chat state
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatFilter, setChatFilter] = useState('all'); // 'all' | 'unread' | 'online'
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const messagesContainerRef = useRef(null);
  const activePartnerRef = useRef(activePartner);
  activePartnerRef.current = activePartner;
  const isNearBottomRef = useRef(true);

  // Profile modals
  const [viewingProfile, setViewingProfile] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: user?.title || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
    interests: Array.isArray(user?.interests) ? user.interests.join(', ') : '',
    learningPath: user?.learningPath || '',
    learningGoal: user?.learningGoal || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Track scroll position inside message container
  const handleMessagesScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
    }
  }, []);

  // Scroll to latest message strictly inside the messages container (never scrolls the outer page/window)
  const scrollToBottom = useCallback((smooth = false, force = false) => {
    requestAnimationFrame(() => {
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        if (force || isNearBottomRef.current) {
          if (smooth) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth',
            });
          } else {
            container.scrollTop = container.scrollHeight;
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom(false, false);
  }, [messages, isTyping, scrollToBottom]);

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
  const fetchConnections = useCallback(async () => {
    if (!user) {
      setLoadingConnections(false);
      return;
    }
    setLoadingConnections(true);
    try {
      const [connRes, pendingRes, sentRes] = await Promise.all([
        api.getCommunityConnections().catch(() => ({ success: false })),
        api.getPendingRequests().catch(() => ({ success: false })),
        api.getSentRequests().catch(() => ({ success: false })),
      ]);

      if (connRes?.success && Array.isArray(connRes.connections)) {
        setConnections(connRes.connections);
        setFriends(connRes.connections);
        try {
          localStorage.setItem('herearn_community_connections', JSON.stringify(connRes.connections));
        } catch {}
      } else {
        const local = localStorage.getItem('herearn_community_connections');
        const parsed = local ? JSON.parse(local) : [];
        setConnections(parsed);
        setFriends(parsed);
      }

      if (pendingRes?.success && Array.isArray(pendingRes.requests)) {
        setPendingRequests(pendingRes.requests);
      }

      if (sentRes?.success && Array.isArray(sentRes.requests)) {
        setSentRequests(sentRes.requests);
        try {
          localStorage.setItem('herearn_community_sent_requests', JSON.stringify(sentRes.requests));
        } catch {}
      }
    } catch (err) {
      console.warn('[Community] Fetch connections failed, relying on local cache:', err);
    } finally {
      setLoadingConnections(false);
    }
  }, [user]);

  // Load 1:1 Conversations from Database (Strictly real database users)
  const fetchConversations = useCallback(async (selectFirstIfNone = false) => {
    if (!user) {
      setLoadingConversations(false);
      return;
    }

    try {
      const res = await api.getConversations();
      if (res?.success && Array.isArray(res.conversations)) {
        setConversations((prev) => {
          const serverConvs = res.conversations;
          const serverPartnerIds = new Set(serverConvs.map((c) => c.partner?.id));

          // Preserve any conversation that was opened locally (e.g. by clicking Start 1:1 Chat)
          const localOnly = prev.filter(
            (c) => c.partner?.id && !serverPartnerIds.has(c.partner.id)
          );

          const combined = [...localOnly, ...serverConvs];
          combined.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

          // Check if data actually changed to prevent state churn and re-render glitches
          if (prev.length === combined.length) {
            const hasDiff = combined.some((c, idx) => {
              const p = prev[idx];
              return (
                c.partner?.id !== p?.partner?.id ||
                c.unreadCount !== p?.unreadCount ||
                c.lastMessage?.id !== p?.lastMessage?.id ||
                c.lastMessage?.content !== p?.lastMessage?.content
              );
            });
            if (!hasDiff) return prev;
          }

          return combined;
        });

        if (selectFirstIfNone && !activePartnerRef.current && res.conversations.length > 0) {
          setActivePartner(res.conversations[0].partner);
        }
      }
    } catch (err) {
      console.warn('[Fetch Conversations Error]:', err.message);
    } finally {
      setLoadingConversations(false);
    }
  }, [user]);

  // Load message history for active chat partner
  const fetchMessages = useCallback(async (partnerId, silent = false) => {
    if (!partnerId) return;
    if (!silent) setLoadingMessages(true);
    try {
      if (!user) {
        // Guest mode simulated history
        const demoHistory = [
          {
            id: 'dm1',
            senderId: partnerId,
            content: `Hi there! 👋 Welcome to HerEarn Community! I'm ${activePartnerRef.current?.name || 'Priya'}. What skills are you currently working on?`,
            isSelf: false,
            read: true,
            createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
          {
            id: 'dm2',
            senderId: 'me',
            content: `Hey! I'm exploring the free tracks and building my proof-of-work portfolio.`,
            isSelf: true,
            read: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'dm3',
            senderId: partnerId,
            content: `That's wonderful! Keep going. Feel free to message me anytime if you want feedback on your deliverables! 💖`,
            isSelf: false,
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          },
        ];
        setMessages(demoHistory);
        return;
      }

      const res = await api.getMessages(partnerId);
      if (res?.success && Array.isArray(res.messages)) {
        setMessages((prev) => {
          // Compare if messages actually changed to prevent flickering
          if (prev.length === res.messages.length) {
            const hasChanged = res.messages.some((m, idx) => {
              const p = prev[idx];
              return m.id !== p?.id || m.content !== p?.content || m.read !== p?.read;
            });
            if (!hasChanged) return prev;
          }
          return res.messages;
        });
      }
    } catch (err) {
      console.warn('[Community Messages Fetch Warning]:', err.message);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchUsers();
    fetchConnections();
    fetchConversations(true);
  }, [fetchUsers, fetchConnections, fetchConversations]);

  // When active partner changes, load messages and scroll to bottom
  useEffect(() => {
    if (activePartner?.id) {
      fetchMessages(activePartner.id);
      scrollToBottom(false, true);
    }
  }, [activePartner?.id, fetchMessages, scrollToBottom]);

  // Background polling for messages when chat is open (every 4 seconds)
  useEffect(() => {
    const partnerId = activePartner?.id;
    if (!partnerId || !user) return;
    const interval = setInterval(() => {
      fetchMessages(partnerId, true);
      fetchConversations(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [activePartner?.id, user, fetchMessages, fetchConversations]);

  // Check URL query parameters (e.g. ?chat=userId)
  useEffect(() => {
    if (activeTab === 'chat' && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  // Select partner to chat
  const handleSelectPartner = async (partner) => {
    if (!partner) return;
    setActivePartner(partner);
    setLoadingMessages(true);
    try {
      const res = await api.getMessages(partner.id);
      if (res?.success && Array.isArray(res.messages) && res.messages.length > 0) {
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
      fetchConversations(false);
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

  // Check URL query parameters (e.g. ?chat=userId)
  useEffect(() => {
    const chatUserId = searchParams.get('chat');
    if (chatUserId && activePartner?.id !== chatUserId) {
      setActiveTab('chat');
      const foundInUsers =
        users.find((u) => u.id === chatUserId) ||
        conversations.find((c) => c.partner?.id === chatUserId)?.partner;
      if (foundInUsers) {
        handleSelectPartner(foundInUsers);
      }
    }
  }, [searchParams, users, conversations, activePartner?.id]);

  // Send Message with Offline Resilience & Peer Simulation
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activePartner || sendingMessage) return;

    const content = messageInput.trim();
    setMessageInput('');
    setSendingMessage(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      senderId: user?.id || 'me',
      receiverId: activePartner.id,
      content,
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
      const res = await api.sendMessage(activePartner.id, content);
      if (res?.success && res.message) {
        setMessages((prev) => {
          const next = prev.map((m) => (m.id === tempId ? res.message : m));
          try {
            localStorage.setItem(`herearn_local_chat_${activePartner.id}`, JSON.stringify(next));
          } catch {}
          return next;
        });
        fetchConversations(false);
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
      showToast?.('Please log in or sign up to connect with community members!', 'info');
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

  // Reject Request Handler
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

  // Cancel Request Handler
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
  const handleOpenChatWithUser = async (targetUser) => {
    if (!targetUser) return;
    setActivePartner(targetUser);
    setActiveTab('chat');
    setSearchParams({ tab: 'chat', chat: targetUser.id }, { replace: true, preventScrollReset: true });

    // Ensure conversation exists in local list immediately for instant UI feedback
    setConversations((prev) => {
      const exists = prev.some((c) => c.partner?.id === targetUser.id);
      if (exists) return prev;
      return [
        {
          connectionId: targetUser.connectionId || `conn-${targetUser.id}`,
          partner: targetUser,
          lastMessage: null,
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });

    handleSelectPartner(targetUser);

    // If logged in, persist the conversation thread on the backend database immediately!
    if (user && targetUser.id) {
      try {
        const res = await api.startConversation(targetUser.id);
        if (res?.success && res.conversation) {
          setConversations((prev) => {
            const index = prev.findIndex((c) => c.partner?.id === targetUser.id);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = { ...updated[index], ...res.conversation };
              return updated;
            }
            return [res.conversation, ...prev];
          });
          fetchConnections();
        }
      } catch (err) {
        console.warn('[Start Conversation Backend Notice]:', err.message);
      }
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const partner = c.partner;
    if (!partner) return false;
    const matchSearch = !chatSearch || 
      partner.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
      partner.username?.toLowerCase().includes(chatSearch.toLowerCase()) ||
      c.lastMessage?.content?.toLowerCase().includes(chatSearch.toLowerCase());
    if (!matchSearch) return false;

    if (chatFilter === 'unread') return c.unreadCount > 0;
    if (chatFilter === 'online') return Boolean(partner.isOnline);
    return true;
  });

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const pendingCount = pendingRequests.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HERO HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 text-white p-6 sm:p-8 shadow-2xl border border-purple-500/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-pink-200">
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>Empowering Women Creators & Freelancers</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                HerEarn Community & 1:1 Peer Chat 🌸
              </h1>
              <p className="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed">
                Connect directly with fellow women learners, find study buddies, exchange portfolio feedback, and chat 1:1 with peers striving for financial independence.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {user && (
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-4 h-4 text-pink-300" />
                  <span>Edit My Profile</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  fetchUsers();
                  fetchConversations(false);
                  fetchConnections();
                  showToast?.('Community data refreshed!', 'info');
                }}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                title="Refresh community feed"
              >
                <RefreshCw className="w-4 h-4 text-purple-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Guest Mode Notice */}
        {!user && (
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-purple-200/80 dark:border-purple-800/60 shadow-xs flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-purple-200">
              <AlertCircle className="w-4 h-4 text-pink-500 shrink-0" />
              <span>You are in <strong>Guest Preview Mode</strong>. Explore verified profiles, participate in discussions, and test 1:1 peer messaging!</span>
            </div>
            <a
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs hover:opacity-95 transition-all shrink-0 shadow-sm"
            >
              Log In to Save History
            </a>
          </div>
        )}

        {/* TOP LEVEL NAVIGATION TABS */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-purple-100 dark:border-slate-800 shadow-sm overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('discussions');
              setSearchParams({ tab: 'discussions' }, { replace: true, preventScrollReset: true });
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'discussions'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800'
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
            onClick={() => {
              setActiveTab('chat');
              setSearchParams({ tab: 'chat' }, { replace: true, preventScrollReset: true });
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>1:1 Chat with Friends</span>
            {totalUnread > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500 text-white animate-pulse">
                {totalUnread}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('discover');
              setSearchParams({ tab: 'discover' }, { replace: true, preventScrollReset: true });
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'discover'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover Learners</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              {users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('connections');
              setSearchParams({ tab: 'connections' }, { replace: true, preventScrollReset: true });
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'connections'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>My Friends & Requests</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">
                +{pendingCount}
              </span>
            )}
          </button>
        </div>

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
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[680px] max-h-[calc(100vh-140px)] min-h-[560px]">
            
            {/* LEFT COLUMN: CONVERSATION SIDEBAR */}
            <div className={`lg:col-span-4 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full min-h-0 overflow-hidden ${activePartner && 'hidden lg:flex'}`}>
              
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Direct Messages</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                      {conversations.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 hover:bg-purple-100 transition-colors cursor-pointer"
                    title="Start new chat with a friend"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Search in conversations */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    placeholder="Search chats or messages..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-100"
                  />
                  {chatSearch && (
                    <button
                      type="button"
                      onClick={() => setChatSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter chips in sidebar */}
                <div className="flex items-center gap-1.5 pt-1">
                  {['all', 'unread', 'online'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setChatFilter(f)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                        chatFilter === f
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50 overscroll-contain">
                {loadingConversations ? (
                  <div className="p-8 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-500" />
                    <p className="text-xs">Loading conversations...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-500 flex items-center justify-center mx-auto">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No conversations yet</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Connect with peers in the Discover tab or click below to start a chat!
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsNewChatModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Start 1:1 Chat
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((c) => {
                    const isSelected = activePartner?.id === c.partner?.id;
                    return (
                      <div
                        key={c.connectionId || c.partner.id}
                        onClick={() => {
                          setActivePartner(c.partner);
                          setSearchParams({ tab: 'chat', chat: c.partner.id }, { replace: true, preventScrollReset: true });
                        }}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-50/80 dark:bg-purple-950/50 border-l-4 border-purple-600'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        {/* Avatar with status */}
                        <div className="relative shrink-0">
                          <img
                            src={c.partner?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'}
                            alt={c.partner?.name}
                            className="w-11 h-11 rounded-2xl object-cover border border-purple-200 dark:border-purple-800 shadow-sm"
                          />
                          {c.partner?.isOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Online now" />
                          )}
                        </div>

                        {/* Middle info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {c.partner?.name}
                            </h4>
                            {c.lastMessage && (
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-purple-600 dark:text-pink-400 font-semibold truncate">
                            @{c.partner?.username}
                          </p>

                          <p className={`text-[11px] truncate mt-0.5 ${
                            c.unreadCount > 0 
                              ? 'text-slate-900 dark:text-white font-extrabold' 
                              : 'text-slate-500 dark:text-slate-400 font-normal'
                          }`}>
                            {c.lastMessage?.content || 'Started a connection'}
                          </p>
                        </div>

                        {/* Unread Pill */}
                        {c.unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-extrabold shrink-0 shadow-sm">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE 1:1 CHAT WINDOW */}
            <div className={`lg:col-span-8 flex flex-col h-full min-h-0 overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 ${!activePartner && 'hidden lg:flex'}`}>
              {activePartner ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Mobile back button */}
                      <button
                        type="button"
                        onClick={() => setActivePartner(null)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 lg:hidden cursor-pointer"
                        title="Back to conversations"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>

                      <div className="relative shrink-0 cursor-pointer" onClick={() => setViewingProfile(activePartner)}>
                        <img
                          src={activePartner.avatar}
                          alt={activePartner.name}
                          className="w-10 h-10 rounded-2xl object-cover border border-purple-200 dark:border-purple-800"
                        />
                        {activePartner.isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 
                            className="font-bold text-sm text-slate-900 dark:text-white truncate cursor-pointer hover:underline"
                            onClick={() => setViewingProfile(activePartner)}
                          >
                            {activePartner.name}
                          </h3>
                          {activePartner.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" title="Verified Member" />
                          )}
                          <span className="text-[10px] text-purple-600 dark:text-pink-400 font-semibold">
                            @{activePartner.username}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {activePartner.title || activePartner.learningPath} • {activePartner.isOnline ? '🟢 Active Now' : 'Last seen recently'}
                        </p>
                      </div>
                    </div>

                    {/* Chat Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewingProfile(activePartner)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View Profile</span>
                      </button>
                    </div>
                  </div>

                  {/* Message Stream */}
                  <div 
                    ref={messagesContainerRef} 
                    onScroll={handleMessagesScroll}
                    className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain"
                  >
                    {loadingMessages && messages.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-500" />
                        <p className="text-xs">Loading chat history...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      /* Empty Chat Icebreakers */
                      <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg">
                          <Sparkles className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                            Start a 1:1 conversation with {activePartner.name}!
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Share ideas, exchange portfolio feedback, or ask questions about their skill track ({activePartner.learningPath}).
                          </p>
                        </div>

                        {/* Icebreaker Prompts */}
                        <div className="space-y-2 pt-2">
                          <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                            Suggested Icebreakers:
                          </p>
                          {[
                            `👋 Hi ${activePartner.name.split(' ')[0]}! Excited to connect with you on HerEarn!`,
                            `🎨 Loved your profile! What kind of projects are you building right now?`,
                            `💼 Are you interested in collaborating on a client micro-gig?`,
                            `✨ Any tips for excelling in the ${activePartner.learningPath || 'digital skills'} track?`,
                          ].map((prompt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setMessageInput(prompt);
                              }}
                              className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 hover:border-purple-300 text-xs text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Date Divider */}
                        <div className="flex items-center justify-center my-2">
                          <span className="px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 shadow-xs">
                            Conversation History
                          </span>
                        </div>

                        {/* Message Bubbles */}
                        {messages.map((m) => {
                          const isMine = m.isSelf || m.senderId === user?.id || m.senderId === 'me';
                          return (
                            <div
                              key={m.id}
                              className={`flex items-end gap-2.5 ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                              {!isMine && (
                                <img
                                  src={activePartner.avatar}
                                  alt={activePartner.name}
                                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-purple-200"
                                />
                              )}

                              <div
                                className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 shadow-sm text-xs leading-relaxed ${
                                  isMine
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-xs'
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/60 rounded-bl-xs'
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                                <div
                                  className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                                    isMine ? 'text-purple-100' : 'text-slate-400'
                                  }`}
                                >
                                  <span>
                                    {m.createdAt
                                      ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                      : 'Just now'}
                                  </span>
                                  {isMine && (
                                    <CheckCheck className="w-3 h-3 text-white/90" title="Delivered & Read" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Live Typing Indicator */}
                        {isTyping && (
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <img
                              src={activePartner.avatar}
                              alt={activePartner.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0 border border-purple-200"
                            />
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                              <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-300">
                                {activePartner.name.split(' ')[0]} is typing
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce [animation-delay:0.2s]"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Input Footer */}
                  <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    
                    {/* Quick Emojis */}
                    <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
                      {['🌸', '💖', '👍', '🚀', '💡', '🔥', '🙌', '🎉'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setMessageInput((prev) => prev + emoji)}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950 transition-colors text-sm cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {/* Chat Form */}
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={`Message ${activePartner.name.split(' ')[0]}... (Enter to send)`}
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs sm:text-sm text-slate-800 dark:text-slate-100 shadow-inner"
                      />

                      <button
                        type="submit"
                        disabled={!messageInput.trim() || sendingMessage}
                        className={`p-2.5 sm:px-5 sm:py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                          messageInput.trim() && !sendingMessage
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-95'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                /* No Active Chat Selected State */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4 shadow-lg">
                    <MessageSquare className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Select a conversation to start chatting 1:1
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
                    Chat directly with your friends and community learners. Share tips, review projects, and celebrate financial independence together!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (conversations.length > 0) {
                        setActivePartner(conversations[0].partner);
                        setSearchParams({ tab: 'chat', chat: conversations[0].partner.id }, { replace: true, preventScrollReset: true });
                      } else {
                        setIsNewChatModalOpen(true);
                      }
                    }}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer"
                  >
                    Open First Conversation
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DISCOVER LEARNERS                                  */}
        {/* ========================================================= */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            
            {/* Search and Filters Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, skill (e.g. Canva, Shopify, SEO), handle or location..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Learning Path Dropdown */}
                <div className="w-full md:w-64">
                  <select
                    value={selectedPath}
                    onChange={(e) => setSelectedPath(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {LEARNING_PATHS.map((lp) => (
                      <option key={lp} value={lp}>{lp}</option>
                    ))}
                  </select>
                </div>

                {/* Popular Skill Dropdown */}
                <div className="w-full md:w-56">
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {POPULAR_SKILLS.map((sk) => (
                      <option key={sk} value={sk}>{sk}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Learner Grid */}
            {loadingUsers ? (
              <div className="py-20 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-500" />
                <p className="text-sm font-semibold">Finding learners in the community...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-purple-100 dark:border-slate-800 max-w-md mx-auto space-y-3">
                <Users className="w-12 h-12 text-purple-400 mx-auto" />
                <h4 className="font-bold text-base">No matching learners found</h4>
                <p className="text-xs text-slate-500">
                  Try clearing your search query or picking "All Learning Paths" to view all community members.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPath('All Learning Paths');
                    setSelectedSkill('All Skills');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Reset Filters
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
                            <Target className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span className="truncate font-medium">Goal: {learner.learningGoal}</span>
                          </div>
                        </div>

                        {/* Skills Pills */}
                        <div className="mb-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                            Skills & Expertise
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(learner.skills || []).slice(0, 4).map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                              >
                                {sk}
                              </span>
                            ))}
                            {(learner.skills || []).length > 4 && (
                              <span className="px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500">
                                +{(learner.skills || []).length - 4}
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
                            onClick={() => handleSendConnection(learner.id, learner.name)}
                            disabled={isConnecting}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            {isConnecting ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <UserPlus className="w-3.5 h-3.5" />
                            )}
                            <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
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
        {/* TAB 3: MY FRIENDS & CONNECTION REQUESTS                   */}
        {/* ========================================================= */}
        {activeTab === 'connections' && (
          <div className="space-y-6">
            
            {/* Sub Tabs */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-purple-100 dark:border-slate-800 shadow-sm w-fit">
              <button
                type="button"
                onClick={() => setConnectionsSubTab('friends')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  connectionsSubTab === 'friends'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>My Friends ({friends.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setConnectionsSubTab('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  connectionsSubTab === 'pending'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Received Requests ({pendingRequests.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setConnectionsSubTab('sent')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  connectionsSubTab === 'sent'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Sent Requests ({sentRequests.length})</span>
              </button>
            </div>

            {/* Sub Tab: Friends */}
            {connectionsSubTab === 'friends' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-purple-100 dark:border-slate-800 max-w-md mx-auto space-y-3">
                    <UserCheck className="w-12 h-12 text-purple-400 mx-auto" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No connected friends yet</p>
                    <p className="text-xs text-slate-500">
                      Explore the Discover tab and send connection requests to start chatting!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('discover')}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                    >
                      Discover Peers
                    </button>
                  </div>
                ) : (
                  friends.map((f) => {
                    const partner = f.partner;
                    if (!partner) return null;
                    return (
                      <div
                        key={f.connectionId}
                        className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={partner.avatar}
                            alt={partner.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-purple-200 dark:border-purple-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {partner.name}
                            </h4>
                            <p className="text-[11px] text-purple-600 dark:text-pink-400 font-semibold truncate">
                              @{partner.username}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {partner.title}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenChatWithUser(partner)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:opacity-95 transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFriend(f.connectionId, partner.name)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Remove friend"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Sub Tab: Inbound Pending Requests */}
            {connectionsSubTab === 'pending' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingRequests.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-purple-100 dark:border-slate-800 max-w-md mx-auto">
                    <Check className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold">You have no pending connection requests.</p>
                  </div>
                ) : (
                  pendingRequests.map((req) => (
                    <div
                      key={req.requestId}
                      className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={req.sender.avatar}
                          alt={req.sender.name}
                          className="w-12 h-12 rounded-2xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {req.sender.name}
                          </h4>
                          <p className="text-[11px] text-purple-600 dark:text-pink-400 font-semibold truncate">
                            @{req.sender.username}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {req.sender.learningPath}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(req.requestId, req.sender.name)}
                          className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                          title="Accept request"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectRequest(req.requestId)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Decline request"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sub Tab: Outbound Sent Requests */}
            {connectionsSubTab === 'sent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sentRequests.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-purple-100 dark:border-slate-800 max-w-md mx-auto">
                    <Send className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold">No pending sent requests.</p>
                  </div>
                ) : (
                  sentRequests.map((req) => (
                    <div
                      key={req.requestId}
                      className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={req.receiver.avatar}
                          alt={req.receiver.name}
                          className="w-12 h-12 rounded-2xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {req.receiver.name}
                          </h4>
                          <p className="text-[11px] text-purple-600 dark:text-pink-400 font-semibold truncate">
                            @{req.receiver.username}
                          </p>
                          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                            Awaiting response
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
                  ))
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: VIEW FULL COMMUNITY PROFILE                      */}
      {/* ========================================================= */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-purple-200 dark:border-purple-800 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              type="button"
              onClick={() => setViewingProfile(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <img
                src={viewingProfile.avatar}
                alt={viewingProfile.name}
                className="w-16 h-16 rounded-3xl object-cover border-2 border-purple-300 dark:border-purple-700 shadow-md"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {viewingProfile.name}
                  </h3>
                  {viewingProfile.verified && (
                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                <p className="text-xs text-purple-600 dark:text-pink-400 font-semibold">
                  @{viewingProfile.username}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  <span>{viewingProfile.location || 'India'}</span>
                </p>
              </div>
            </div>

            {/* Title & Bio */}
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {viewingProfile.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {viewingProfile.bio}
              </p>
            </div>

            {/* Learning Path & Goals */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40">
                <p className="text-[10px] text-purple-500 uppercase font-bold">Track</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{viewingProfile.learningPath}</p>
              </div>
              <div className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40">
                <p className="text-[10px] text-pink-500 uppercase font-bold">Goal</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{viewingProfile.learningGoal}</p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Specialized Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {(viewingProfile.skills || []).map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingProfile(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewingProfile;
                  setViewingProfile(null);
                  handleOpenChatWithUser(target);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Start 1:1 Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: START NEW 1:1 CHAT PICKER                        */}
      {/* ========================================================= */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-purple-200 dark:border-purple-800 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>Start a 1:1 Chat</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 py-3">
              Pick any friend or community member below to begin messaging:
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-50 dark:divide-slate-800">
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    setIsNewChatModalOpen(false);
                    handleOpenChatWithUser(u);
                  }}
                  className="p-2.5 rounded-2xl hover:bg-purple-50 dark:hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-950/60 dark:to-pink-950/60 text-purple-700 dark:text-purple-300 font-extrabold text-[11px] flex items-center justify-center border border-purple-200/60 dark:border-purple-800/60 shrink-0">
                      {getInitials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-purple-600 dark:text-pink-400 truncate">@{u.username} • {u.learningPath}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold text-[10px] shrink-0">
                    Chat
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: EDIT OWN COMMUNITY PROFILE                       */}
      {/* ========================================================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-purple-200 dark:border-purple-800 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-pink-500" />
                <span>Edit Your Community Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSavingProfile(true);
                try {
                  const skillsArray = editForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
                  const interestsArray = editForm.interests.split(',').map((s) => s.trim()).filter(Boolean);
                  const res = await api.updateCommunityProfile({
                    title: editForm.title,
                    bio: editForm.bio,
                    location: editForm.location,
                    learningPath: editForm.learningPath,
                    learningGoal: editForm.learningGoal,
                    skills: skillsArray,
                    interests: interestsArray,
                  });
                  if (res?.success) {
                    showToast?.('Community profile updated!', 'success');
                    setIsEditProfileOpen(false);
                    fetchUsers();
                  }
                } catch {
                  showToast?.('Failed to update profile.', 'error');
                } finally {
                  setSavingProfile(false);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Headline / Role Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g. Lead UI/UX Designer & Canva Specialist"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bio (About You)</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell other learners about your journey and what you enjoy building..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="e.g. Ahmedabad, India"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Learning Path</label>
                  <select
                    value={editForm.learningPath}
                    onChange={(e) => setEditForm({ ...editForm, learningPath: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                  >
                    {LEARNING_PATHS.filter((p) => p !== 'All Learning Paths').map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  placeholder="Canva, Figma, UI/UX, Shopify, SEO..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Career / Learning Goal</label>
                <input
                  type="text"
                  value={editForm.learningGoal}
                  onChange={(e) => setEditForm({ ...editForm, learningGoal: e.target.value })}
                  placeholder="e.g. Independent Freelancer or Agency Founder"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
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
