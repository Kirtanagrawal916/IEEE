import express from 'express';
import prisma from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.cookies?.herearn_access_token || null);
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    return authenticateToken(req, res, next);
  } catch {
    req.user = null;
    return next();
  }
};

const parseJson = (val, fallback = []) => {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

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

router.get('/users', optionalAuth, async (req, res) => {
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

    let userConnections = [];
    if (currentUserId) {
      userConnections = await prisma.connection.findMany({
        where: {
          OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        },
      });
    }

    const connectionMap = new Map();
    for (const conn of userConnections) {
      const otherId = conn.senderId === currentUserId ? conn.receiverId : conn.senderId;
      let status = 'NONE';
      if (conn.status === 'ACCEPTED') status = 'CONNECTED';
      else if (conn.status === 'PENDING') status = conn.senderId === currentUserId ? 'PENDING_SENT' : 'PENDING_RECEIVED';
      else if (conn.status === 'REJECTED') status = 'REJECTED';
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

      if (cleanSearch) {
        const matches = userName.includes(cleanSearch) || userHandle.includes(cleanSearch) || userTitle.includes(cleanSearch) || userBio.includes(cleanSearch) || userPath.includes(cleanSearch) || parsedSkills.some((s) => s.includes(cleanSearch));
        if (!matches) return false;
      }

      if (cleanPath && cleanPath !== 'all learning paths' && cleanPath !== 'all') {
        if (!userPath.includes(cleanPath)) return false;
      }

      if (cleanSkill && cleanSkill !== 'all skills' && cleanSkill !== 'all') {
        if (!parsedSkills.some((s) => s.includes(cleanSkill))) return false;
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

    res.json({ success: true, users: results, total: results.length });
  } catch (error) {
    console.error('[Community API Error - users]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve community users', error: error.message });
  }
});

router.get('/connections', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const connections = await prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      include: { sender: true, receiver: true },
      orderBy: { updatedAt: 'desc' },
    });

    const friends = connections.map((conn) => {
      const partner = conn.senderId === currentUserId ? conn.receiver : conn.sender;
      return {
        connectionId: conn.id,
        connectedAt: conn.updatedAt,
        partner: sanitizeCommunityUser(partner, { connectionStatus: 'CONNECTED', connectionId: conn.id }),
      };
    });

    res.json({ success: true, friends, total: friends.length });
  } catch (error) {
    console.error('[Community API Error - connections]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve connections', error: error.message });
  }
});

router.get('/requests/pending', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const requests = await prisma.connection.findMany({
      where: { receiverId: currentUserId, status: 'PENDING' },
      include: { sender: true },
      orderBy: { createdAt: 'desc' },
    });

    const pending = requests.map((r) => ({
      requestId: r.id,
      createdAt: r.createdAt,
      sender: sanitizeCommunityUser(r.sender, { connectionStatus: 'PENDING_RECEIVED', connectionId: r.id }),
    }));

    res.json({ success: true, requests: pending, count: pending.length });
  } catch (error) {
    console.error('[Community API Error - pending requests]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve pending requests', error: error.message });
  }
});

router.get('/requests/sent', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const requests = await prisma.connection.findMany({
      where: { senderId: currentUserId, status: 'PENDING' },
      include: { receiver: true },
      orderBy: { createdAt: 'desc' },
    });

    const sent = requests.map((r) => ({
      requestId: r.id,
      createdAt: r.createdAt,
      receiver: sanitizeCommunityUser(r.receiver, { connectionStatus: 'PENDING_SENT', connectionId: r.id }),
    }));

    res.json({ success: true, requests: sent, count: sent.length });
  } catch (error) {
    console.error('[Community API Error - sent requests]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve sent requests', error: error.message });
  }
});

router.post('/connect/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ success: false, message: 'Cannot connect with yourself.' });
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
        return res.json({ success: true, message: `Already connected with ${targetUser.name}!`, status: 'CONNECTED', connection: existing });
      }
      if (existing.status === 'PENDING' && existing.senderId === targetUserId) {
        const updated = await prisma.connection.update({
          where: { id: existing.id },
          data: { status: 'ACCEPTED' },
        });
        return res.json({ success: true, message: `Connected with ${targetUser.name}!`, status: 'CONNECTED', connection: updated });
      }
      return res.json({ success: true, message: `Request already pending.`, status: 'PENDING_SENT', connection: existing });
    }

    const newConnection = await prisma.connection.create({
      data: { senderId: currentUserId, receiverId: targetUserId, status: 'PENDING' },
    });

    res.status(201).json({ success: true, message: `Connection request sent!`, status: 'PENDING_SENT', connection: newConnection });
  } catch (error) {
    console.error('[Community API Error - connect]:', error);
    res.status(500).json({ success: false, message: 'Failed to send connection request', error: error.message });
  }
});

router.post('/requests/:requestId/accept', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requestId } = req.params;

    const connection = await prisma.connection.findUnique({ where: { id: requestId }, include: { sender: true } });
    if (!connection || connection.receiverId !== currentUserId) {
      return res.status(404).json({ success: false, message: 'Request not found or unauthorized.' });
    }

    const updated = await prisma.connection.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
      include: { sender: true },
    });

    res.json({ success: true, message: `Connected with ${updated.sender.name}!`, connection: updated });
  } catch (error) {
    console.error('[Community API Error - accept]:', error);
    res.status(500).json({ success: false, message: 'Failed to accept request', error: error.message });
  }
});

router.post('/requests/:requestId/reject', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requestId } = req.params;
    const connection = await prisma.connection.findUnique({ where: { id: requestId } });
    if (!connection || connection.receiverId !== currentUserId) {
      return res.status(404).json({ success: false, message: 'Request not found or unauthorized.' });
    }
    await prisma.connection.update({ where: { id: requestId }, data: { status: 'REJECTED' } });
    res.json({ success: true, message: 'Request declined.' });
  } catch (error) {
    console.error('[Community API Error - reject]:', error);
    res.status(500).json({ success: false, message: 'Failed to reject request', error: error.message });
  }
});

router.delete('/requests/:requestId/cancel', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requestId } = req.params;
    const connection = await prisma.connection.findUnique({ where: { id: requestId } });
    if (!connection || connection.senderId !== currentUserId) {
      return res.status(404).json({ success: false, message: 'Request not found or unauthorized.' });
    }
    await prisma.connection.delete({ where: { id: requestId } });
    res.json({ success: true, message: 'Request cancelled.' });
  } catch (error) {
    console.error('[Community API Error - cancel]:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel request', error: error.message });
  }
});

router.delete('/connections/:connectionId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { connectionId } = req.params;
    const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
    if (!connection || (connection.senderId !== currentUserId && connection.receiverId !== currentUserId)) {
      return res.status(404).json({ success: false, message: 'Connection not found or unauthorized.' });
    }
    await prisma.connection.delete({ where: { id: connectionId } });
    res.json({ success: true, message: 'Connection removed.' });
  } catch (error) {
    console.error('[Community API Error - remove connection]:', error);
    res.status(500).json({ success: false, message: 'Failed to remove connection', error: error.message });
  }
});

router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    let connections = await prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      include: { sender: true, receiver: true },
      orderBy: { updatedAt: 'desc' },
    });

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
          await prisma.connection.create({
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
              content: `Hi ${req.user.name?.split(' ')[0] || 'there'}! 👋 Welcome to HerEarn Community. I'm ${s.name.split(' ')[0]}, learning in the ${s.learningPath || 'digital skills'} track. Feel free to ask me anything about gigs or portfolio feedback! 🌸`,
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
        include: { sender: true, receiver: true },
        orderBy: { updatedAt: 'desc' },
      });
    }

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

        const lastMsg = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: currentUserId, receiverId: partner.id },
              { senderId: partner.id, receiverId: currentUserId },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        const unreadCount = await prisma.message.count({
          where: { senderId: partner.id, receiverId: currentUserId, read: false },
        });

        return {
          connectionId: conn ? conn.id : `msg-${partnerId}`,
          partner: sanitizeCommunityUser(partner, {
            connectionStatus: conn?.status === 'ACCEPTED' ? 'CONNECTED' : 'NONE',
            connectionId: conn?.id || null,
          }),
          lastMessage: lastMsg ? {
            id: lastMsg.id,
            content: lastMsg.content,
            createdAt: lastMsg.createdAt,
            isSelf: lastMsg.senderId === currentUserId,
            read: lastMsg.read,
          } : null,
          unreadCount,
          updatedAt: lastMsg ? lastMsg.createdAt : (conn ? conn.updatedAt : new Date().toISOString()),
        };
      })
    );

    const validConversations = conversationList.filter(Boolean);
    validConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.json({ success: true, conversations: validConversations, total: validConversations.length });
  } catch (error) {
    console.error('[Community API Error - conversations]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversations', error: error.message });
  }
});

router.post('/conversations', authenticateToken, async (req, res) => {
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
  } catch (error) {
    console.error('[Community API Error - conversations]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversations', error: error.message });
  }
});

router.get('/messages/:partnerId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { partnerId } = req.params;

    const partner = await prisma.user.findUnique({ where: { id: partnerId } });
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found.' });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    await prisma.message.updateMany({
      where: { senderId: partnerId, receiverId: currentUserId, read: false },
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
      partner: sanitizeCommunityUser(partner),
      messages: formattedMessages,
    });
  } catch (error) {
    console.error('[Community API Error - messages]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages', error: error.message });
  }
});

router.post('/messages/:partnerId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { partnerId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content cannot be empty.' });
    }

    const cleanContent = content.trim();

    const recipientUser = await prisma.user.findUnique({ where: { id: partnerId } });
    if (!recipientUser) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
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
        data: { senderId: currentUserId, receiverId: partnerId, status: 'ACCEPTED' },
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

    await prisma.connection.update({
      where: { id: connection.id },
      data: { updatedAt: new Date() },
    }).catch(() => null);

    // Auto-reply for seed users
    if (recipientUser.email?.endsWith('@herearn.org')) {
      setTimeout(async () => {
        try {
          const peerReplies = [
            `Thanks for reaching out! How has your experience on HerEarn been so far? 🌸`,
            `That's awesome! Let me know if you want feedback on your deliverables or portfolio! ✨`,
            `Great point! I find that breaking down tasks step-by-step really helps. Let's stay in touch!`,
          ];
          const chosen = peerReplies[Math.floor(Math.random() * peerReplies.length)];
          await prisma.message.create({
            data: {
              senderId: partnerId,
              receiverId: currentUserId,
              content: chosen,
              read: false,
            },
          });
          await prisma.connection.update({
            where: { id: connection.id },
            data: { updatedAt: new Date() },
          }).catch(() => null);
        } catch (e) {
          console.warn('[Auto reply warning]:', e.message);
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

router.post('/messages/:partnerId/read', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { partnerId } = req.params;
    const updated = await prisma.message.updateMany({
      where: { senderId: partnerId, receiverId: currentUserId, read: false },
      data: { read: true },
    });
    res.json({ success: true, count: updated.count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark read', error: error.message });
  }
});

router.get('/profile/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { portfolios: { take: 4, orderBy: { createdAt: 'desc' } } },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, profile: sanitizeCommunityUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get profile', error: error.message });
  }
});

export default router;
