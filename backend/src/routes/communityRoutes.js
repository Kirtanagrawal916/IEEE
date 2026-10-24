import express from 'express';
import prisma from '../config/db.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';

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
    ...extra,
  };
};

// -------------------------------------------------------------
// 1. GET /api/community/users
// Discover learners with search and filters (skills, interests, learningPath, goal)
// -------------------------------------------------------------
router.get('/users', optionalAuthMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user?.id || null;
    const { search, skill, interest, learningPath, learningGoal } = req.query;

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

    // Map connection status lookup
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

    // Filter in-memory for flexible multi-field JSON searches
    const cleanSearch = (search || '').toLowerCase().trim();
    const cleanSkill = (skill || '').toLowerCase().trim();
    const cleanInterest = (interest || '').toLowerCase().trim();
    const cleanPath = (learningPath || '').toLowerCase().trim();
    const cleanGoal = (learningGoal || '').toLowerCase().trim();

    const filtered = allUsers.filter((u) => {
      const parsedSkills = parseJson(u.skills, []).map((s) => String(s).toLowerCase());
      const parsedInterests = parseJson(u.interests, []).map((i) => String(i).toLowerCase());
      const userPath = (u.learningPath || '').toLowerCase();
      const userGoal = (u.learningGoal || '').toLowerCase();
      const userName = (u.name || '').toLowerCase();
      const userBio = (u.bio || '').toLowerCase();
      const userTitle = (u.title || '').toLowerCase();
      const userHandle = (u.username || '').toLowerCase();
      const userLoc = (u.location || '').toLowerCase();

      // Search across name, handle, title, bio, location, skills
      if (cleanSearch) {
        const matchesName = userName.includes(cleanSearch);
        const matchesHandle = userHandle.includes(cleanSearch);
        const matchesTitle = userTitle.includes(cleanSearch);
        const matchesBio = userBio.includes(cleanSearch);
        const matchesLoc = userLoc.includes(cleanSearch);
        const matchesPath = userPath.includes(cleanSearch);
        const matchesGoal = userGoal.includes(cleanSearch);
        const matchesSkill = parsedSkills.some((s) => s.includes(cleanSearch));
        const matchesInterest = parsedInterests.some((i) => i.includes(cleanSearch));

        if (!matchesName && !matchesHandle && !matchesTitle && !matchesBio && !matchesLoc && !matchesPath && !matchesGoal && !matchesSkill && !matchesInterest) {
          return false;
        }
      }

      // Filter by skill
      if (cleanSkill && !parsedSkills.some((s) => s.includes(cleanSkill))) {
        return false;
      }

      // Filter by interest
      if (cleanInterest && !parsedInterests.some((i) => i.includes(cleanInterest))) {
        return false;
      }

      // Filter by learning path
      if (cleanPath && !userPath.includes(cleanPath)) {
        return false;
      }

      // Filter by learning goal
      if (cleanGoal && !userGoal.includes(cleanGoal)) {
        return false;
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
      count: results.length,
      users: results,
    });
  } catch (error) {
    console.error('[Community API Error - users]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve community users', error: error.message });
  }
});

// -------------------------------------------------------------
// 2. GET /api/community/connections
// Fetch accepted connections for current user
// -------------------------------------------------------------
router.get('/connections', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const connections = await prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const list = connections.map((c) => {
      const partner = c.senderId === currentUserId ? c.receiver : c.sender;
      return {
        connectionId: c.id,
        connectedAt: c.updatedAt,
        user: sanitizeCommunityUser(partner, {
          connectionStatus: 'CONNECTED',
          connectionId: c.id,
        }),
      };
    });

    res.json({
      success: true,
      count: list.length,
      connections: list,
    });
  } catch (error) {
    console.error('[Community API Error - connections]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve connections', error: error.message });
  }
});

// -------------------------------------------------------------
// 3. GET /api/community/requests/pending
// Fetch incoming connection requests for current user
// -------------------------------------------------------------
router.get('/requests/pending', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const requests = await prisma.connection.findMany({
      where: {
        receiverId: currentUserId,
        status: 'PENDING',
      },
      include: {
        sender: true,
      },
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
      count: pending.length,
      requests: pending,
    });
  } catch (error) {
    console.error('[Community API Error - pending requests]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve pending requests', error: error.message });
  }
});

// -------------------------------------------------------------
// 4. GET /api/community/requests/sent
// Fetch outgoing connection requests sent by current user
// -------------------------------------------------------------
router.get('/requests/sent', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const sent = await prisma.connection.findMany({
      where: {
        senderId: currentUserId,
        status: 'PENDING',
      },
      include: {
        receiver: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const outgoing = sent.map((s) => ({
      requestId: s.id,
      createdAt: s.createdAt,
      receiver: sanitizeCommunityUser(s.receiver, {
        connectionStatus: 'PENDING_SENT',
        connectionId: s.id,
      }),
    }));

    res.json({
      success: true,
      count: outgoing.length,
      requests: outgoing,
    });
  } catch (error) {
    console.error('[Community API Error - sent requests]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve sent requests', error: error.message });
  }
});

// -------------------------------------------------------------
// 5. POST /api/community/connect/:userId
// Send a connection request to another user
// -------------------------------------------------------------
router.post('/connect/:userId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a connection request to yourself.',
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'The requested user could not be found.',
      });
    }

    // Check existing connection
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
        return res.status(400).json({
          success: false,
          message: `You are already connected with ${targetUser.name}.`,
          connectionId: existing.id,
        });
      }

      if (existing.status === 'PENDING') {
        if (existing.senderId === currentUserId) {
          return res.status(400).json({
            success: false,
            message: `Connection request to ${targetUser.name} is already pending.`,
            connectionId: existing.id,
          });
        }
        // If the other user had already sent a request to current user, auto-accept!
        const accepted = await prisma.connection.update({
          where: { id: existing.id },
          data: { status: 'ACCEPTED' },
        });

        return res.json({
          success: true,
          message: `You accepted ${targetUser.name}'s connection request! You are now connected.`,
          status: 'CONNECTED',
          connection: accepted,
        });
      }

      // If rejected earlier, renew request
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

    // Create fresh connection request
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
// Accept an incoming connection request
// -------------------------------------------------------------
router.post('/requests/:requestId/accept', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requestId } = req.params;

    const request = await prisma.connection.findUnique({
      where: { id: requestId },
      include: { sender: true },
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Connection request not found.' });
    }

    if (request.receiverId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this connection request.',
      });
    }

    const updated = await prisma.connection.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });

    res.json({
      success: true,
      message: `You are now connected with ${request.sender.name}!`,
      connection: updated,
    });
  } catch (error) {
    console.error('[Community API Error - accept]:', error);
    res.status(500).json({ success: false, message: 'Failed to accept connection request', error: error.message });
  }
});

// -------------------------------------------------------------
// 7. POST /api/community/requests/:requestId/reject
// Reject an incoming connection request
// -------------------------------------------------------------
router.post('/requests/:requestId/reject', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requestId } = req.params;

    const request = await prisma.connection.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Connection request not found.' });
    }

    if (request.receiverId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this connection request.',
      });
    }

    // Delete or mark as REJECTED
    await prisma.connection.delete({
      where: { id: requestId },
    });

    res.json({
      success: true,
      message: 'Connection request declined.',
    });
  } catch (error) {
    console.error('[Community API Error - reject]:', error);
    res.status(500).json({ success: false, message: 'Failed to reject connection request', error: error.message });
  }
});

// -------------------------------------------------------------
// 8. DELETE /api/community/requests/:requestId/cancel
// Cancel an outgoing connection request
// -------------------------------------------------------------
router.delete('/requests/:requestId/cancel', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { requestId } = req.params;

    const request = await prisma.connection.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Connection request not found.' });
    }

    if (request.senderId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this connection request.',
      });
    }

    await prisma.connection.delete({
      where: { id: requestId },
    });

    res.json({
      success: true,
      message: 'Connection request cancelled.',
    });
  } catch (error) {
    console.error('[Community API Error - cancel]:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel connection request', error: error.message });
  }
});

// -------------------------------------------------------------
// 9. DELETE /api/community/connections/:connectionId
// Remove an existing connection
// -------------------------------------------------------------
router.delete('/connections/:connectionId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { connectionId } = req.params;

    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found.' });
    }

    if (connection.senderId !== currentUserId && connection.receiverId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to remove this connection.',
      });
    }

    await prisma.connection.delete({
      where: { id: connectionId },
    });

    res.json({
      success: true,
      message: 'Connection removed successfully.',
    });
  } catch (error) {
    console.error('[Community API Error - remove connection]:', error);
    res.status(500).json({ success: false, message: 'Failed to remove connection', error: error.message });
  }
});

// -------------------------------------------------------------
// 10. GET /api/community/conversations
// Retrieve conversations list with last message & unread count
// Only accepted connections appear in conversations
// -------------------------------------------------------------
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch accepted connections
    const acceptedConnections = await prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const conversations = [];

    for (const conn of acceptedConnections) {
      const partner = conn.senderId === currentUserId ? conn.receiver : conn.sender;

      // Find latest message between current user and partner
      const lastMsg = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: partner.id },
            { senderId: partner.id, receiverId: currentUserId },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      // Count unread messages sent by partner to current user
      const unreadCount = await prisma.message.count({
        where: {
          senderId: partner.id,
          receiverId: currentUserId,
          read: false,
        },
      });

      conversations.push({
        connectionId: conn.id,
        connectedAt: conn.updatedAt,
        partner: sanitizeCommunityUser(partner, {
          connectionStatus: 'CONNECTED',
          connectionId: conn.id,
        }),
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              content: lastMsg.content,
              senderId: lastMsg.senderId,
              isSelf: lastMsg.senderId === currentUserId,
              read: lastMsg.read,
              createdAt: lastMsg.createdAt,
            }
          : null,
        unreadCount,
      });
    }

    // Sort by latest message time or connection updated time
    conversations.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.connectedAt).getTime();
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.connectedAt).getTime();
      return timeB - timeA;
    });

    res.json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error('[Community API Error - conversations]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversations', error: error.message });
  }
});

// -------------------------------------------------------------
// 11. GET /api/community/messages/:partnerId
// Retrieve message thread between current user and partner
// Strictly enforces accepted connection permission
// -------------------------------------------------------------
router.get('/messages/:partnerId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { partnerId } = req.params;

    // Security check: Must be accepted connection!
    const connection = await prisma.connection.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
    });

    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'Direct messaging is only available between accepted connections. Connect first to start a conversation.',
      });
    }

    const partner = await prisma.user.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark unread messages sent by partner to current user as read
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
        connectionStatus: 'CONNECTED',
        connectionId: connection.id,
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
// Send a message to an accepted connection
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

    // Security check: Must be accepted connections!
    const connection = await prisma.connection.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
    });

    if (!connection) {
      return res.status(403).json({
        success: false,
        message: 'Cannot send message: You can only message accepted connections.',
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

    // Touch connection timestamp so it bubbles to top
    await prisma.connection.update({
      where: { id: connection.id },
      data: { updatedAt: new Date() },
    }).catch(() => null);

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
// Mark messages from partner as read
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

    res.json({
      success: true,
      count: updated.count,
    });
  } catch (error) {
    console.error('[Community API Error - mark read]:', error);
    res.status(500).json({ success: false, message: 'Failed to mark messages as read', error: error.message });
  }
});

// -------------------------------------------------------------
// 14. GET /api/community/profile/:userId
// View community profile with connection status
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
// Edit own community profile
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
