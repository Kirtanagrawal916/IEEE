import express from 'express';
import { prisma } from '../config/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/wallet/balance - Fetch user's current wallet balance and earnings
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        walletBalance: true,
        totalEarned: true,
        earnings: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      walletBalance: user.walletBalance || 0,
      totalEarned: user.totalEarned || 0,
      earnings: user.earnings || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch wallet balance', error: error.message });
  }
});

// GET /api/wallet/history - Fetch user's withdrawal transaction history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = withdrawals.map((w) => {
      let details = {};
      try {
        details = JSON.parse(w.payoutDetails || '{}');
      } catch {
        details = {};
      }

      return {
        id: w.id,
        amount: w.amount,
        method: w.method,
        txnId: w.txnId,
        status: w.status,
        createdAt: w.createdAt,
        destination: w.method === 'UPI' 
          ? (details.upiId || 'UPI ID') 
          : (details.accountNumber ? `A/C ending in ${String(details.accountNumber).slice(-4)} (${details.bankName || 'Bank'})` : 'Bank Transfer'),
        details,
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      withdrawals: formatted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawal history', error: error.message });
  }
});

// POST /api/wallet/withdraw - Execute instant withdrawal, deduct balance & create ledger entry
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount, method = 'UPI', payoutDetails = {} } = req.body;
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid withdrawal amount greater than zero' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, walletBalance: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentBalance = user.walletBalance || 0;
    if (currentBalance < numAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds. Your available balance is ₹${currentBalance.toLocaleString()} but requested ₹${numAmount.toLocaleString()}.`,
      });
    }

    const normalizedMethod = String(method).toUpperCase() === 'BANK' ? 'BANK' : 'UPI';
    const txnId = `PAYOUT-HE-${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;

    // Execute atomic balance deduction and ledger record creation
    const [updatedUser, withdrawalRecord] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          walletBalance: { decrement: numAmount },
        },
        select: { id: true, walletBalance: true, totalEarned: true },
      }),
      prisma.withdrawal.create({
        data: {
          userId: user.id,
          amount: numAmount,
          method: normalizedMethod,
          payoutDetails: JSON.stringify(payoutDetails),
          txnId,
          status: 'COMPLETED',
        },
      }),
      prisma.auditLog.create({
        data: {
          action: 'WALLET_WITHDRAWAL',
          detail: `User ${user.email} withdrew ₹${numAmount.toLocaleString()} via ${normalizedMethod}. Ref: ${txnId}`,
          type: 'escrow',
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: `Instant payout of ₹${numAmount.toLocaleString()} processed successfully via ${normalizedMethod}.`,
      transaction: {
        id: withdrawalRecord.id,
        txnId: withdrawalRecord.txnId,
        amount: withdrawalRecord.amount,
        method: withdrawalRecord.method,
        status: withdrawalRecord.status,
        createdAt: withdrawalRecord.createdAt,
      },
      newBalance: updatedUser.walletBalance,
    });
  } catch (error) {
    console.error('[Wallet Withdraw Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to process withdrawal', error: error.message });
  }
});

export default router;
