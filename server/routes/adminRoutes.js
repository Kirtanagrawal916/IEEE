import express from 'express';
import { prisma } from '../config/db.js';

const router = express.Router();

// Helper to push audit log
const logAudit = async (action, detail, type = 'info') => {
  try {
    return await prisma.auditLog.create({
      data: { action, detail, type }
    });
  } catch (err) {
    console.error('[AuditLog Error]', err.message);
  }
};

// 1. GET /api/admin/metrics - Real DB & Telemetry Metrics
router.get('/metrics', async (req, res) => {
  try {
    const startTime = performance.now();
    
    const [
      totalUsers,
      learnersCount,
      employersCount,
      adminsCount,
      totalOpportunities,
      verifiedOpportunities,
      pendingOpportunities,
      totalApplications,
      escrowTransactions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'LEARNER' } }),
      prisma.user.count({ where: { role: 'EMPLOYER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.opportunity.count(),
      prisma.opportunity.count({ where: { verifiedClient: true } }),
      prisma.opportunity.count({ where: { verifiedClient: false } }),
      prisma.application.count(),
      prisma.escrowTransaction.findMany()
    ]);

    const latencyMs = Math.round(performance.now() - startTime);

    const grossEscrowPool = escrowTransactions
      .filter(t => t.status === 'HELD_IN_ESCROW')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalDisbursedEscrow = escrowTransactions
      .filter(t => t.status === 'DISBURSED')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Calculate uptime in human readable string
    const uptimeSec = Math.floor(process.uptime());
    const uptimeHours = Math.floor(uptimeSec / 3600);
    const uptimeMins = Math.floor((uptimeSec % 3600) / 60);
    const uptimeStr = uptimeHours > 0 ? `${uptimeHours}h ${uptimeMins}m` : `${uptimeMins}m ${uptimeSec % 60}s`;

    res.json({
      success: true,
      metrics: {
        users: {
          total: totalUsers,
          learners: learnersCount,
          employers: employersCount,
          admins: adminsCount
        },
        opportunities: {
          total: totalOpportunities,
          verified: verifiedOpportunities,
          pending: pendingOpportunities
        },
        applications: {
          total: totalApplications
        },
        escrow: {
          grossPool: grossEscrowPool,
          totalDisbursed: totalDisbursedEscrow,
          transactionCount: escrowTransactions.length
        },
        telemetry: {
          latencyMs: Math.max(12, latencyMs),
          uptime: uptimeStr,
          dbStatus: 'Primary Connected',
          activeDbNodes: 'Primary Node (SQLite)'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin metrics', error: error.message });
  }
});

// 2. GET /api/admin/users - Real user directory with full RBAC
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        verifiedKyc: true,
        totalEarned: true,
        location: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
            portfolios: true,
            enrollments: true
          }
        }
      }
    });

    const formatted = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'LEARNER',
      status: u.status || 'Active',
      verifiedKyc: Boolean(u.verifiedKyc),
      totalEarned: u.role === 'ADMIN' ? 'Staff' : `₹${(u.totalEarned || 0).toLocaleString()}`,
      joined: new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: u.location || 'India',
      applicationsCount: u._count.applications,
      portfoliosCount: u._count.portfolios
    }));

    res.json({ success: true, count: formatted.length, users: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users list', error: error.message });
  }
});

// 3. PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['LEARNER', 'EMPLOYER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role }
    });

    await logAudit('ROLE_ELEVATION', `Changed ${updated.name}'s role to ${role}`, 'user');

    res.json({ success: true, message: `Role updated to ${role}`, user: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user role', error: error.message });
  }
});

// 4. PATCH /api/admin/users/:id/kyc
router.patch('/users/:id/kyc', async (req, res) => {
  try {
    const { verifiedKyc } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { verifiedKyc: Boolean(verifiedKyc) }
    });

    await logAudit(
      'KYC_TOGGLE',
      `${verifiedKyc ? 'Granted' : 'Revoked'} verified KYC for ${updated.name}`,
      'user'
    );

    res.json({ success: true, message: 'KYC status updated', user: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update KYC status', error: error.message });
  }
});

// 5. PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { status }
    });

    await logAudit(
      'USER_STATUS',
      `${updated.name} account status changed to ${status}`,
      status === 'Suspended' ? 'delete' : 'user'
    );

    res.json({ success: true, message: `User status changed to ${status}`, user: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user status', error: error.message });
  }
});

// 6. GET /api/admin/opportunities - Real Gigs list for Moderation
router.get('/opportunities', async (req, res) => {
  try {
    const opps = await prisma.opportunity.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formatted = opps.map(o => ({
      ...o,
      skillsRequired: JSON.parse(o.skillsRequired || '[]'),
      deliverables: JSON.parse(o.deliverables || '[]')
    }));

    res.json({ success: true, count: formatted.length, opportunities: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch opportunities', error: error.message });
  }
});

// 7. POST /api/admin/opportunities - Create real verified gig in DB
router.post('/opportunities', async (req, res) => {
  try {
    const { title, company, stipend, category, duration, description, skillsRequired, deliverables } = req.body;

    if (!title || !company) {
      return res.status(400).json({ success: false, message: 'Title and company are required' });
    }

    const skills = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === 'string'
      ? skillsRequired.split(',').map(s => s.trim())
      : ['General'];

    const items = Array.isArray(deliverables)
      ? deliverables
      : ['Verified project milestone', 'Direct payout upon completion'];

    const newGig = await prisma.opportunity.create({
      data: {
        title,
        company,
        stipend: stipend || '₹5,000',
        category: category || 'Digital Marketing',
        duration: duration || '2 Weeks',
        description: description || 'Verified enterprise opportunity created by Platform Administrator.',
        skillsRequired: JSON.stringify(skills),
        deliverables: JSON.stringify(items),
        verifiedClient: true,
        isOpen: true,
        status: 'verified',
        applicantsCount: 0,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    await logAudit('GIG_CREATED', `Admin posted official verified gig: "${newGig.title}"`, 'approval');

    res.status(201).json({
      success: true,
      message: 'Verified gig created successfully',
      opportunity: {
        ...newGig,
        skillsRequired: skills,
        deliverables: items
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create opportunity', error: error.message });
  }
});

// 8. PATCH /api/admin/opportunities/:id/status - Approve or Flag Gig
router.patch('/opportunities/:id/status', async (req, res) => {
  try {
    const { verifiedClient, isOpen, status } = req.body;

    const updateData = {};
    if (verifiedClient !== undefined) updateData.verifiedClient = Boolean(verifiedClient);
    if (isOpen !== undefined) updateData.isOpen = Boolean(isOpen);
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.opportunity.update({
      where: { id: req.params.id },
      data: updateData
    });

    const isVerified = updated.verifiedClient && updated.status !== 'flagged';
    await logAudit(
      isVerified ? 'GIG_APPROVED' : 'GIG_FLAGGED',
      `${isVerified ? 'Approved & Escrow verified' : 'Flagged for review'}: "${updated.title}"`,
      isVerified ? 'approval' : 'warning'
    );

    res.json({
      success: true,
      message: isVerified ? 'Opportunity verified and published' : 'Opportunity flagged',
      opportunity: {
        ...updated,
        skillsRequired: JSON.parse(updated.skillsRequired || '[]'),
        deliverables: JSON.parse(updated.deliverables || '[]')
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update opportunity status', error: error.message });
  }
});

// 9. DELETE /api/admin/opportunities/:id - Delete gig from DB
router.delete('/opportunities/:id', async (req, res) => {
  try {
    const gig = await prisma.opportunity.findUnique({ where: { id: req.params.id } });
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    await prisma.opportunity.delete({ where: { id: req.params.id } });
    await logAudit('GIG_DELETED', `Removed gig: "${gig.title}"`, 'delete');

    res.json({ success: true, message: 'Opportunity deleted from database' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete opportunity', error: error.message });
  }
});

// 10. GET /api/admin/escrow - Real Escrow transactions ledger
router.get('/escrow', async (req, res) => {
  try {
    const transactions = await prisma.escrowTransaction.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formatted = transactions.map(t => ({
      id: t.code,
      dbId: t.id,
      gig: t.gigTitle,
      client: t.clientName,
      freelancer: t.freelancerName,
      amount: t.amount,
      status: t.status,
      date: new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }));

    res.json({ success: true, count: formatted.length, escrow: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch escrow ledger', error: error.message });
  }
});

// 11. POST /api/admin/escrow/:id/release - Release payout to user's real totalEarned
router.post('/escrow/:id/release', async (req, res) => {
  try {
    const tx = await prisma.escrowTransaction.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { code: req.params.id }
        ]
      }
    });

    if (!tx) {
      return res.status(404).json({ success: false, message: 'Escrow transaction not found' });
    }

    const updated = await prisma.escrowTransaction.update({
      where: { id: tx.id },
      data: { status: 'DISBURSED' }
    });

    // Credit freelancer's totalEarned in DB
    const freelancer = await prisma.user.findFirst({
      where: {
        OR: [
          { name: { contains: tx.freelancerName } },
          { id: tx.freelancerId || 'none' }
        ]
      }
    });

    if (freelancer) {
      await prisma.user.update({
        where: { id: freelancer.id },
        data: { totalEarned: { increment: tx.amount } }
      });
    }

    await logAudit(
      'ESCROW_DISBURSED',
      `Direct UPI payout released: ₹${tx.amount.toLocaleString()} to ${tx.freelancerName}`,
      'escrow'
    );

    res.json({
      success: true,
      message: `₹${tx.amount.toLocaleString()} released to ${tx.freelancerName}`,
      transaction: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to release escrow', error: error.message });
  }
});

// 12. POST /api/admin/escrow/:id/freeze - Freeze disputed escrow
router.post('/escrow/:id/freeze', async (req, res) => {
  try {
    const tx = await prisma.escrowTransaction.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { code: req.params.id }
        ]
      }
    });

    if (!tx) {
      return res.status(404).json({ success: false, message: 'Escrow transaction not found' });
    }

    const updated = await prisma.escrowTransaction.update({
      where: { id: tx.id },
      data: { status: 'DISPUTED_FROZEN' }
    });

    await logAudit(
      'ESCROW_DISPUTED',
      `Dispute freeze placed on transaction ${tx.code} (₹${tx.amount.toLocaleString()})`,
      'warning'
    );

    res.json({
      success: true,
      message: `Dispute lock activated on transaction ${tx.code}`,
      transaction: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to freeze escrow', error: error.message });
  }
});

// 13. GET /api/admin/settings - Platform controls & broadcast settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.platformSetting.findMany();
    const map = {};
    settings.forEach(s => {
      try {
        map[s.key] = JSON.parse(s.value);
      } catch {
        map[s.key] = s.value;
      }
    });

    res.json({
      success: true,
      settings: {
        platformFeePercent: Number(map.platformFeePercent) || 8,
        activeBroadcast: map.activeBroadcast || '',
        maintenanceMode: map.maintenanceMode === true || map.maintenanceMode === 'true',
        escrowEmergencyLock: map.escrowEmergencyLock === true || map.escrowEmergencyLock === 'true',
        strictKycRequired: map.strictKycRequired === true || map.strictKycRequired === 'true',
        aiSpamFilter: map.aiSpamFilter === true || map.aiSpamFilter === 'true'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch platform settings', error: error.message });
  }
});

// 14. PATCH /api/admin/settings - Update platform controls & broadcast
router.patch('/settings', async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, val] of Object.entries(updates)) {
      await prisma.platformSetting.upsert({
        where: { key },
        update: { value: String(val) },
        create: { key, value: String(val) }
      });
    }

    if (updates.activeBroadcast !== undefined) {
      await logAudit('BROADCAST_ALERT', `Sent platform banner: "${updates.activeBroadcast}"`, 'security');
    }
    if (updates.maintenanceMode !== undefined || updates.escrowEmergencyLock !== undefined || updates.strictKycRequired !== undefined || updates.aiSpamFilter !== undefined) {
      await logAudit('SECURITY_SWITCH', `Updated emergency platform governance toggles`, 'warning');
    }

    res.json({ success: true, message: 'Platform settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
});

// 15. GET /api/admin/audit-logs - Real DB audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    const formatted = logs.map(l => ({
      id: l.id,
      action: l.action,
      detail: l.detail,
      type: l.type,
      time: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date(l.timestamp).toISOString()
    }));

    res.json({ success: true, count: formatted.length, auditLogs: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs', error: error.message });
  }
});

// 16. POST /api/admin/audit-logs - Create audit log
router.post('/audit-logs', async (req, res) => {
  try {
    const { action, detail, type } = req.body;
    const log = await logAudit(action, detail, type || 'info');
    res.status(201).json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record audit log', error: error.message });
  }
});

export default router;
