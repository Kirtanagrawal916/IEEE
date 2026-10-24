import express from 'express';
import { prisma } from '../config/db.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to safely parse JSON strings with fallbacks
const parseJson = (val, fallback = []) => {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

// Helper: Sanitize public community user profile
const sanitizeCommunityUser = (user, extra = {}) => {
  if (!user) return null;
  const username = user.username || (user.email ? user.email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase() : 'learner');
  
  return {
    id: user.id,
    name: user.name,
    username,
    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
    title: user.title || 'Digital Skill Specialist',
    bio: user.bio || `Passionate learner on HerEarn (@${username})`,
    location: user.location || 'India',
    skills: parseJson(user.skills, []),
    interests: parseJson(user.interests, ['Web Development', 'Design', 'Career Growth']),
    learningPath: user.learningPath || 'Frontend Development',
    learningGoal: user.learningGoal || 'Full-Stack Web Developer',
    portfolioLinks: parseJson(user.portfolioLinks, []),
    skillPoints: user.skillPoints || 150,
    role: user.role || 'LEARNER',
    verified: Boolean(user.verified !== false),
    isOnline: Boolean(extra.isOnline !== undefined ? extra.isOnline : true),
    ...extra,
  };
};

// -------------------------------------------------------------
// 1. GET /api/community/users
// Discover learners with search and filters
// -------------------------------------------------------------
router.get('/users', optionalAuthMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user?.id || null;
    const { search, skill, learningPath } = req.query;

    const allUsers = await prisma.user.findMany({
      where: {
        status: 'Active',
        ...(currentUserId ? { id: { not: currentUserId } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 60,
    });

    // If logged in, fetch all connections involving current user
    let userConnections = [];
    if (currentUserId) {
      userConnections = await prisma.connection.findMany({
        where: {
          OR: [
            { senderId: currentUserId },
            { receiverId: currentUserId },
          ],
        },
      });
    }

    const connectionMap = new Map();
    for (const conn of userConnections) {
      const otherId = conn.senderId === currentUserId ? conn.receiverId : conn.senderId;
      let status = 'NONE';
      if (conn.status === 'ACCEPTED') {
        status = 'CONNECTED';
      } else if (conn.status === 'PENDING') {
        status = conn.senderId === currentUserId ? 'PENDING_SENT' : 'PENDING_RECEIVED';
      } else if (conn.status === 'REJECTED') {
        status = 'REJECTED';
      }
      connectionMap.set(otherId, { status, connectionId: conn.id });
    }

    const cleanSearch = (search || '').toLowerCase().trim();
    const cleanSkill = (skill || '').toLowerCase().trim();
    const cleanPath = (learningPath || '').toLowerCase().trim();

    const filtered = allUsers.filter((u) => {
      const parsedSkills = parseJson(u.skills, []).map((s) => String(s).toLowerCase());
      const userPath = (u.learningPath || '').toLowerCase();
      const userName = (u.name || '').toLowerCase();
      const userBio = (u.bio || '').toLowerCase();
      const userTitle = (u.title || '').toLowerCase();
      const userHandle = (u.username || '').toLowerCase();
      const userLoc = (u.location || '').toLowerCase();

      if (cleanSearch) {
        const matches = 
          userName.includes(cleanSearch) ||
          userHandle.includes(cleanSearch) ||
          userTitle.includes(cleanSearch) ||
          userBio.includes(cleanSearch) ||
          userLoc.includes(cleanSearch) ||
          userPath.includes(cleanSearch) ||
          parsedSkills.some((s) => s.includes(cleanSearch));
        if (!matches) return false;
      }

      if (cleanPath && cleanPath !== 'all learning paths' && cleanPath !== 'all') {
        if (!userPath.includes(cleanPath)) return false;
      }

      if (cleanSkill && cleanSkill !== 'all skills' && cleanSkill !== 'all') {
        const hasSkill = parsedSkills.some((s) => s.includes(cleanSkill));
        if (!hasSkill) return false;
      }

      return true;
    });

    const results = filtered.map((u) => {
      const connInfo = connectionMap.get(u.id) || { status: 'NONE', connectionId: null };
      return sanitizeCommunityUser(u, {
        connectionStatus: connInfo.status,
        connectionId: connInfo.connectionId,
      });
    });

    res.json({
      success: true,
      users: results,
      total: results.length,
    });
  } catch (error) {
    console.error('[Community API Error - users]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve community users', error: error.message });
  }
});

// -------------------------------------------------------------
// 2. GET /api/community/connections
// List all accepted 1:1 friends/connections
// -------------------------------------------------------------
router.get('/connections', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const connections = await prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const friends = connections.map((conn) => {
      const partner = conn.senderId === currentUserId ? conn.receiver : conn.sender;
      return {
        connectionId: conn.id,
        connectedAt: conn.updatedAt,
        partner: sanitizeCommunityUser(partner, {
          connectionStatus: 'CONNECTED',
          connectionId: conn.id,
        }),
      };
    });

    res.json({
      success: true,
      friends,
      total: friends.length,
    });
  } catch (error) {
    console.error('[Community API Error - connections]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve connections', error: error.message });
  }
});

// -------------------------------------------------------------
// 3. GET /api/community/requests/pending
// Inbound pending connection requests
// -------------------------------------------------------------
router.get('/requests/pending', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const requests = await prisma.connection.findMany({
      where: {
        receiverId: currentUserId,
        status: 'PENDING',
      },
      include: { sender: true },
      orderBy: { createdAt: 'desc' },
    });

    const pending = requests.map((r) => ({
      requestId: r.id,
      createdAt: r.createdAt,
      sender: sanitizeCommunityUser(r.sender, {
        connectionStatus: 'PENDING_RECEIVED',
        connectionId: r.id,
      }),
    }));

    res.json({
      success: true,
      requests: pending,
      count: pending.length,
    });
  } catch (error) {
    console.error('[Community API Error - pending requests]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve pending requests', error: error.message });
  }
});

// -------------------------------------------------------------
// 4. GET /api/community/requests/sent
// Outbound pending connection requests
// -------------------------------------------------------------
router.get('/requests/sent', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const requests = await prisma.connection.findMany({
      where: {
        senderId: currentUserId,
        status: 'PENDING',
      },
      include: { receiver: true },
      orderBy: { createdAt: 'desc' },
    });

    const sent = requests.map((r) => ({
      requestId: r.id,
      createdAt: r.createdAt,
      receiver: sanitizeCommunityUser(r.receiver, {
        connectionStatus: 'PENDING_SENT',
        connectionId: r.id,
      }),
    }));

    res.json({
      success: true,
      requests: sent,
      count: sent.length,
    });
  } catch (error) {
    console.error('[Community API Error - sent requests]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve sent requests', error: error.message });
  }
});

// -------------------------------------------------------------
// 5. POST /api/community/connect/:userId
// Send or auto-accept connection request
// -------------------------------------------------------------
router.post('/connect/:userId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ success: false, message: 'You cannot connect with yourself.' });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: currentUserId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        return res.json({
          success: true,
          message: `You are already connected with ${targetUser.name}!`,
          status: 'CONNECTED',
          connection: existing,
        });
      }

      if (existing.status === 'PENDING') {
        if (existing.senderId === targetUserId) {
          // Auto-accept reciprocal request
          const updated = await prisma.connection.update({
            where: { id: existing.id },
            data: { status: 'ACCEPTED' },
          });
          return res.json({
            success: true,
            message: `Connection request accepted! You and ${targetUser.name} are now connected.`,
            status: 'CONNECTED',
            connection: updated,
          });
        }
        return res.json({
          success: true,
          message: `Connection request already sent to ${targetUser.name}.`,
          status: 'PENDING_SENT',
          connection: existing,
        });
      }

      // Renew rejected connection
      const renewed = await prisma.connection.update({
        where: { id: existing.id },
        data: {
          senderId: currentUserId,
          receiverId: targetUserId,
          status: 'PENDING',
        },
      });
      return res.status(201).json({
        success: true,
        message: `Connection request sent to ${targetUser.name}.`,
        status: 'PENDING_SENT',
        connection: renewed,
      });
    }

    const newConnection = await prisma.connection.create({
      data: {
        senderId: currentUserId,
        receiverId: targetUserId,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: `Connection request sent to ${targetUser.name}!`,
      status: 'PENDING_SENT',
      connection: newConnection,
    });
  } catch (error) {
    console.error('[Community API Error - connect]:', error);
    res.status(500).json({ success: false, message: 'Failed to send connection request', error: error.message });
  }
});

// -------------------------------------------------------------
// 6. POST /api/community/requests/:requestId/accept
// -------------------------------------------------------------
router.post('/requests/:requestId/accept', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requestId } = req.params;

    const connection = await prisma.connection.findUnique({
      where: { id: requestId },
      include: { sender: true },
    });

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found.' });
    }

    if (connection.receiverId !== currentUserId) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept this request.' });
    }

    const updated = await prisma.connection.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
      include: { sender: true },
    });

    res.json({
      success: true,
      message: `Connected with ${updated.sender.name}! You can now chat 1:1.`,
      connection: updated,
    });
  } catch (error) {
    console.error('[Community API Error - accept]:', error);
    res.status(500).json({ success: false, message: 'Failed to accept request', error: error.message });
  }
});

// -------------------------------------------------------------
// 7. POST /api/community/requests/:requestId/reject
// -------------------------------------------------------------
router.post('/requests/:requestId/reject', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requestId } = req.params;

    const connection = await prisma.connection.findUnique({ where: { id: requestId } });
    if (!connection || connection.receiverId !== currentUserId) {
      return res.status(404).json({ success: false, message: 'Request not found or unauthorized.' });
    }

    await prisma.connection.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    res.json({ success: true, message: 'Connection request declined.' });
  } catch (error) {
    console.error('[Community API Error - reject]:', error);
    res.status(500).json({ success: false, message: 'Failed to reject request', error: error.message });
  }
});

// -------------------------------------------------------------
// 8. DELETE /api/community/requests/:requestId/cancel
// -------------------------------------------------------------
router.delete('/requests/:requestId/cancel', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requestId } = req.params;

    const connection = await prisma.connection.findUnique({ where: { id: requestId } });
    if (!connection || connection.senderId !== currentUserId) {
      return res.status(404).json({ success: false, message: 'Request not found or unauthorized.' });
    }

    await prisma.connection.delete({ where: { id: requestId } });
    res.json({ success: true, message: 'Connection request cancelled.' });
  } catch (error) {
    console.error('[Community API Error - cancel]:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel request', error: error.message });
  }
});

// -------------------------------------------------------------
// 9. DELETE /api/community/connections/:connectionId
// -------------------------------------------------------------
router.delete('/connections/:connectionId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { connectionId } = req.params;

    const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found.' });
    }

    if (connection.senderId !== currentUserId && connection.receiverId !== currentUserId) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await prisma.connection.delete({ where: { id: connectionId } });
    res.json({ success: true, message: 'Connection removed.' });
  } catch (error) {
    console.error('[Community API Error - remove connection]:', error);
    res.status(500).json({ success: false, message: 'Failed to remove connection', error: error.message });
  }
});

// -------------------------------------------------------------
// 10. GET /api/community/conversations
// Get all 1:1 conversation threads with latest messages
// -------------------------------------------------------------
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // 1. Fetch all accepted connections
    let connections = await prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    // If new user has no connections yet, auto-connect them with real platform community learners
    if (connections.length === 0) {
      const seedUsers = await prisma.user.findMany({
        where: {
          email: { endsWith: '@herearn.org' },
          id: { not: currentUserId },
        },
        take: 3,
      });

      for (const s of seedUsers) {
        try {
          const createdConn = await prisma.connection.create({
            data: {
              senderId: s.id,
              receiverId: currentUserId,
              status: 'ACCEPTED',
            },
          });

          await prisma.message.create({
            data: {
              senderId: s.id,
              receiverId: currentUserId,
              content: `Hi ${req.user.name?.split(' ')[0] || 'there'}! 👋 Welcome to HerEarn Community. I'm ${s.name.split(' ')[0]}, learning in the ${s.learningPath || 'digital skills'} track. Feel free to ask me anything about gigs, portfolio feedback, or getting started! 🌸`,
              read: true,
            },
          });
        } catch {
          // ignore duplicate
        }
      }

      connections = await prisma.connection.findMany({
        where: {
          status: 'ACCEPTED',
          OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        },
        include: {
          sender: true,
          receiver: true,
        },
        orderBy: { updatedAt: 'desc' },
      });
    }

    // 2. Also find any users with whom messages have been exchanged
    const distinctMsgs = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      select: { senderId: true, receiverId: true },
      distinct: ['senderId', 'receiverId'],
    });

    const knownPartnerIds = new Set(
      connections.map((c) => (c.senderId === currentUserId ? c.receiverId : c.senderId))
    );

    for (const m of distinctMsgs) {
      const otherId = m.senderId === currentUserId ? m.receiverId : m.senderId;
      if (otherId && otherId !== currentUserId) {
        knownPartnerIds.add(otherId);
      }
    }

    const conversationList = await Promise.all(
      Array.from(knownPartnerIds).map(async (partnerId) => {
        const partner = await prisma.user.findUnique({ where: { id: partnerId } });
        if (!partner) return null;

        const conn = connections.find(
          (c) =>
            (c.senderId === currentUserId && c.receiverId === partnerId) ||
            (c.senderId === partnerId && c.receiverId === currentUserId)
        );

        // Last message
        const lastMsg = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: currentUserId, receiverId: partnerId },
              { senderId: partnerId, receiverId: currentUserId },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        // Unread count
        const unreadCount = await prisma.message.count({
          where: {
            senderId: partnerId,
            receiverId: currentUserId,
            read: false,
          },
        });

        return {
          connectionId: conn ? conn.id : `msg-${partnerId}`,
          partner: sanitizeCommunityUser(partner, {
            connectionStatus: conn?.status === 'ACCEPTED' ? 'CONNECTED' : 'NONE',
            connectionId: conn?.id || null,
          }),
          lastMessage: lastMsg
            ? {
                id: lastMsg.id,
                content: lastMsg.content,
                createdAt: lastMsg.createdAt,
                isSelf: lastMsg.senderId === currentUserId,
                read: lastMsg.read,
              }
            : null,
          unreadCount,
          updatedAt: lastMsg ? lastMsg.createdAt : (conn ? conn.updatedAt : new Date().toISOString()),
        };
      })
    );

    const validConversations = conversationList.filter(Boolean);
    validConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json({
      success: true,
      conversations: validConversations,
      total: validConversations.length,
    });
  } catch (error) {
    console.error('[Community API Error - conversations]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversations', error: error.message });
  }
});

// -------------------------------------------------------------
// POST /api/community/conversations
// Start or ensure a 1:1 conversation thread with a user
// -------------------------------------------------------------
router.post('/conversations', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const partnerId = req.body?.partnerId;

    if (!partnerId) {
      return res.status(400).json({ success: false, message: 'partnerId is required.' });
    }

    if (partnerId === currentUserId) {
      return res.status(400).json({ success: false, message: 'Cannot start conversation with yourself.' });
    }

    const partner = await prisma.user.findUnique({ where: { id: partnerId } });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner user not found.' });
    }

    let connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
    });

    if (!connection) {
      connection = await prisma.connection.create({
        data: {
          senderId: currentUserId,
          receiverId: partnerId,
          status: 'ACCEPTED',
        },
      });
    } else if (connection.status !== 'ACCEPTED') {
      connection = await prisma.connection.update({
        where: { id: connection.id },
        data: { status: 'ACCEPTED', updatedAt: new Date() },
      });
    }

    // Touch timestamp
    await prisma.connection.update({
      where: { id: connection.id },
      data: { updatedAt: new Date() },
    }).catch(() => null);

    const sanitizedPartner = sanitizeCommunityUser(partner, {
      connectionStatus: 'CONNECTED',
      connectionId: connection.id,
    });

    res.json({
      success: true,
      conversation: {
        connectionId: connection.id,
        partner: sanitizedPartner,
        lastMessage: null,
        unreadCount: 0,
        updatedAt: connection.updatedAt,
      },
    });
  } catch (err) {
    console.error('[Community API Error - start conversation]:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 11. GET /api/community/messages/:partnerId
// Retrieve 1:1 message history with friend
// -------------------------------------------------------------
router.get('/messages/:partnerId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { partnerId } = req.params;

    const partner = await prisma.user.findUnique({ where: { id: partnerId } });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner user not found.' });
    }

    const connection = await prisma.connection.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
    });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark unread incoming messages as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: currentUserId,
        read: false,
      },
      data: { read: true },
    });

    const formattedMessages = messages.map((m) => ({
      id: m.id,
      content: m.content,
      senderId: m.senderId,
      receiverId: m.receiverId,
      isSelf: m.senderId === currentUserId,
      read: m.read,
      createdAt: m.createdAt,
    }));

    res.json({
      success: true,
      partner: sanitizeCommunityUser(partner, {
        connectionStatus: connection ? 'CONNECTED' : 'NONE',
        connectionId: connection ? connection.id : null,
      }),
      messages: formattedMessages,
    });
  } catch (error) {
    console.error('[Community API Error - get messages]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages', error: error.message });
  }
});

// -------------------------------------------------------------
// 12. POST /api/community/messages/:partnerId
// Send a 1:1 message to a friend
// -------------------------------------------------------------
router.post('/messages/:partnerId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { partnerId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
    }

    const cleanContent = content.trim();
    if (cleanContent.length > 5000) {
      return res.status(400).json({ success: false, message: 'Message exceeds maximum length of 5000 characters.' });
    }

    // Check or establish connection
    let connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
    });

    // If no connection yet but sending to a seed community user, establish accepted connection automatically
    const recipientUser = await prisma.user.findUnique({ where: { id: partnerId } });
    if (!recipientUser) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    if (!connection) {
      connection = await prisma.connection.create({
        data: {
          senderId: currentUserId,
          receiverId: partnerId,
          status: 'ACCEPTED',
        },
      });
    } else if (connection.status !== 'ACCEPTED') {
      connection = await prisma.connection.update({
        where: { id: connection.id },
        data: { status: 'ACCEPTED' },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: currentUserId,
        receiverId: partnerId,
        content: cleanContent,
        read: false,
      },
    });

    // Touch connection timestamp
    await prisma.connection.update({
      where: { id: connection.id },
      data: { updatedAt: new Date() },
    }).catch(() => null);

    // If recipient is a seed community learner, schedule a realistic peer reply
    if (recipientUser.email?.endsWith('@herearn.org')) {
      setTimeout(async () => {
        try {
          const lower = cleanContent.toLowerCase();
          let peerReply = '';

          if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            peerReply = `Hey there! Wonderful to hear from you. How are your learning tracks on HerEarn going? 🌸`;
          } else if (lower.includes('gig') || lower.includes('project') || lower.includes('client') || lower.includes('job')) {
            peerReply = `Micro-gigs on HerEarn have been so helpful! Make sure to take the 6-question eligibility quiz to unlock client escrow protection. Have you applied to any yet? 💼`;
          } else if (lower.includes('design') || lower.includes('canva') || lower.includes('figma') || lower.includes('logo')) {
            peerReply = `I love visual design! Canva templates with consistent 2-color palettes and clear typography convert so well for small businesses. Feel free to share your preview link anytime! 🎨`;
          } else if (lower.includes('shopify') || lower.includes('ecommerce') || lower.includes('store')) {
            peerReply = `Setting up product variants and clear return policies on Shopify is super in demand for local boutiques right now. Let me know if you want any tips on store setups! 🛍️`;
          } else if (lower.includes('collab') || lower.includes('together') || lower.includes('help')) {
            peerReply = `I would love to collaborate! We can review each other's deliverables and practice client presentations. Let's make it happen! ✨`;
          } else {
            const peerReplies = [
              `Thanks for reaching out! I'm currently practicing on a new project. How has your experience on HerEarn been so far?`,
              `That's awesome! Keep pushing forward. Let me know if you'd like to collaborate or review each other's deliverables!`,
              `Great point! I find that breaking down tasks step-by-step really helps. Let's stay in touch!`,
              `Sounds exciting! Have you checked out the latest micro-gigs in the Opportunities section? There are some great projects there.`,
            ];
            peerReply = peerReplies[Math.floor(Math.random() * peerReplies.length)];
          }

          await prisma.message.create({
            data: {
              senderId: partnerId,
              receiverId: currentUserId,
              content: peerReply,
              read: false,
            },
          });

          await prisma.connection.update({
            where: { id: connection.id },
            data: { updatedAt: new Date() },
          }).catch(() => null);
        } catch (err) {
          console.warn('[Auto-reply error]:', err.message);
        }
      }, 1500);
    }

    res.status(201).json({
      success: true,
      message: {
        id: newMessage.id,
        content: newMessage.content,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        isSelf: true,
        read: false,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('[Community API Error - send message]:', error);
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
});

// -------------------------------------------------------------
// 13. POST /api/community/messages/:partnerId/read
// -------------------------------------------------------------
router.post('/messages/:partnerId/read', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { partnerId } = req.params;

    const updated = await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: currentUserId,
        read: false,
      },
      data: { read: true },
    });

    res.json({ success: true, count: updated.count });
  } catch (error) {
    console.error('[Community API Error - mark read]:', error);
    res.status(500).json({ success: false, message: 'Failed to mark messages as read', error: error.message });
  }
});

// -------------------------------------------------------------
// 14. GET /api/community/profile/:userId
// -------------------------------------------------------------
router.get('/profile/:userId', optionalAuthMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user?.id || null;
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolios: {
          take: 4,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let connectionStatus = 'NONE';
    let connectionId = null;

    if (currentUserId && currentUserId !== userId) {
      const conn = await prisma.connection.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: userId },
            { senderId: userId, receiverId: currentUserId },
          ],
        },
      });

      if (conn) {
        connectionId = conn.id;
        if (conn.status === 'ACCEPTED') {
          connectionStatus = 'CONNECTED';
        } else if (conn.status === 'PENDING') {
          connectionStatus = conn.senderId === currentUserId ? 'PENDING_SENT' : 'PENDING_RECEIVED';
        } else if (conn.status === 'REJECTED') {
          connectionStatus = 'REJECTED';
        }
      }
    } else if (currentUserId === userId) {
      connectionStatus = 'SELF';
    }

    const profile = sanitizeCommunityUser(user, {
      connectionStatus,
      connectionId,
      portfolios: (user.portfolios || []).map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        imageUrl: p.imageUrl,
        projectUrl: p.projectUrl,
        likesCount: p.likesCount,
      })),
    });

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('[Community API Error - profile]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile', error: error.message });
  }
});

// -------------------------------------------------------------
// 15. PATCH /api/community/profile
// -------------------------------------------------------------
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const {
      title,
      bio,
      location,
      skills,
      interests,
      learningPath,
      learningGoal,
      portfolioLinks,
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = String(title).slice(0, 100);
    if (bio !== undefined) updateData.bio = String(bio).slice(0, 500);
    if (location !== undefined) updateData.location = String(location).slice(0, 100);
    if (learningPath !== undefined) updateData.learningPath = String(learningPath).slice(0, 100);
    if (learningGoal !== undefined) updateData.learningGoal = String(learningGoal).slice(0, 100);

    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills) ? JSON.stringify(skills) : String(skills);
    }
    if (interests !== undefined) {
      updateData.interests = Array.isArray(interests) ? JSON.stringify(interests) : String(interests);
    }
    if (portfolioLinks !== undefined) {
      updateData.portfolioLinks = Array.isArray(portfolioLinks) ? JSON.stringify(portfolioLinks) : String(portfolioLinks);
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Community profile updated successfully!',
      user: sanitizeCommunityUser(updatedUser),
    });
  } catch (error) {
    console.error('[Community API Error - update profile]:', error);
    res.status(500).json({ success: false, message: 'Failed to update community profile', error: error.message });
  }
});

export default router;
