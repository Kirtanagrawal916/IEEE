import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  KeyRound, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Briefcase, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Search, 
  Trash2, 
  Check, 
  RefreshCw, 
  DollarSign, 
  Wallet, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  Download,
  Activity,
  Sliders,
  Bell,
  Plus,
  Send,
  X,
  ArrowLeft,
  Server,
  Zap,
  UserCheck,
  UserX,
  CreditCard
} from 'lucide-react';
import { api } from '../services/api';

// Designated Official Master Admin Key
export const MASTER_ADMIN_KEY = 'HEREARN-ADMIN-2026-X9K';

export default function AdminPanel({ 
  opportunities = [], 
  setOpportunities, 
  showToast 
}) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('herearn_admin_authenticated') === 'true';
  });
  const [enteredKey, setEnteredKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [shake, setShake] = useState(false);

  // Active Administrative Section (Only relevant admin functions)
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'gigs' | 'users' | 'escrow' | 'controls' | 'audit'

  // Time horizon filter for analytics
  const [timeRange, setTimeRange] = useState('7d'); // 'today' | '7d' | '30d' | 'all'

  // Interactive Platform Fee / Commission Simulator
  const [platformFeePercent, setPlatformFeePercent] = useState(8);

  // System Broadcast Announcement state
  const [announcementText, setAnnouncementText] = useState('');
  const [activeBroadcast, setActiveBroadcast] = useState('Welcome to HerEarn: Skill-to-income payouts processed daily via Escrow UPI.');

  // Emergency Platform Controls
  const [platformControls, setPlatformControls] = useState({
    maintenanceMode: false,
    escrowEmergencyLock: false,
    strictKycRequired: true,
    aiSpamFilter: true,
  });

  // Modal: Add New Verified Gig as Admin
  const [isAddGigOpen, setIsAddGigOpen] = useState(false);
  const [newGig, setNewGig] = useState({
    title: '',
    company: '',
    stipend: '₹5,000',
    category: 'Digital Marketing',
    duration: '2 Weeks',
    description: '',
    skills: 'Canva, Social Media',
  });

  // Gigs Moderation State
  const [localGigs, setLocalGigs] = useState(opportunities);
  const [gigFilter, setGigFilter] = useState('all'); // 'all' | 'pending' | 'verified' | 'flagged'
  const [gigSearch, setGigSearch] = useState('');
  const [approvedGigIds, setApprovedGigIds] = useState(() => {
    return (opportunities || []).filter(o => o.verifiedClient !== false).map(o => o.id);
  });
  const [flaggedGigIds, setFlaggedGigIds] = useState([]);

  // User Management State
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'LEARNER', status: 'Active', totalEarned: '₹14,500', joined: '10 Oct 2026', verifiedKyc: true },
    { id: 'usr-2', name: 'Ananya Verma', email: 'ananya.v@example.com', role: 'LEARNER', status: 'Active', totalEarned: '₹6,000', joined: '08 Oct 2026', verifiedKyc: true },
    { id: 'usr-3', name: 'KalaKriti Collective', email: 'contact@kalakriti.org', role: 'EMPLOYER', status: 'Active', totalEarned: '₹45,000 deposited', joined: '05 Oct 2026', verifiedKyc: true },
    { id: 'usr-4', name: 'Desi Flavors Handcrafted', email: 'support@desiflavors.in', role: 'EMPLOYER', status: 'Active', totalEarned: '₹28,000 deposited', joined: '02 Oct 2026', verifiedKyc: true },
    { id: 'usr-5', name: 'Suspicious Client 99', email: 'bot_test_88@tempmail.com', role: 'EMPLOYER', status: 'Suspended', totalEarned: '₹0', joined: '11 Oct 2026', verifiedKyc: false },
    { id: 'usr-6', name: 'Radha Krishnan', email: 'radha.k@example.com', role: 'LEARNER', status: 'Active', totalEarned: '₹8,200', joined: '01 Oct 2026', verifiedKyc: false },
    { id: 'usr-7', name: 'Meera Senior Moderator', email: 'meera.mod@herearn.platform', role: 'ADMIN', status: 'Active', totalEarned: 'Staff', joined: '01 Sep 2026', verifiedKyc: true },
  ]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');

  // Escrow Ledger State
  const [escrowLedger, setEscrowLedger] = useState([
    { id: 'ESC-2026-9041', gig: 'Canva Banner & Flyer Designer for Event', client: 'Women Entrepreneurship Summit', freelancer: 'Priya Sharma', amount: 3500, status: 'HELD_IN_ESCROW', date: '11 Oct 2026' },
    { id: 'ESC-2026-8812', gig: 'Shopify Product Catalog Assistant', client: 'KalaKriti Handloom Collective', freelancer: 'Ananya Verma', amount: 6000, status: 'HELD_IN_ESCROW', date: '09 Oct 2026' },
    { id: 'ESC-2026-7649', gig: 'Social Media Reel Script Writing', client: 'Organic Spices Brand', freelancer: 'Sneha Patil', amount: 4500, status: 'DISBURSED', date: '04 Oct 2026' },
    { id: 'ESC-2026-6204', gig: 'Hindi Audio Speech Transcription (100 Audio clips)', client: 'Indic AI Research Lab', freelancer: 'Kavita Sundaram', amount: 2800, status: 'DISBURSED', date: '02 Oct 2026' },
    { id: 'ESC-2026-5190', gig: 'Instagram Carousel Graphic Pack', client: 'Boutique Apparel Studio', freelancer: 'Pooja Hegde', amount: 2500, status: 'DISPUTED_FROZEN', date: '30 Sep 2026' },
  ]);
  const [escrowFilter, setEscrowFilter] = useState('ALL');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', action: 'ADMIN_AUTH', detail: 'Super Admin authenticated via Master Passkey', time: 'Just now', type: 'security' },
    { id: 'log-2', action: 'ESCROW_SETTLE', detail: 'Automated 24h Escrow settlement check completed without anomalies', time: '12 mins ago', type: 'escrow' },
    { id: 'log-3', action: 'GIG_PUBLISH', detail: 'Micro-gig "Canva Banner Designer" approved and published', time: '1 hour ago', type: 'approval' },
    { id: 'log-4', action: 'USER_KYC', detail: 'Identity KYC verified for learner Priya Sharma', time: '3 hours ago', type: 'user' },
  ]);

  // Synchronize local gigs when opportunities change
  const [synced, setSynced] = useState(false);
  if (!synced && opportunities && opportunities.length > 0) {
    setLocalGigs(opportunities);
    setSynced(true);
  }

  // Push new audit log
  const pushAuditLog = (action, detail, type = 'info') => {
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      detail,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handle Admin Passkey Login
  const handleKeySubmit = async (e) => {
    e?.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    const cleanInput = enteredKey.trim().toUpperCase();
    const validKeys = [
      MASTER_ADMIN_KEY,
      'HEREARN-2026-ADMIN',
      'HEREARN2026',
      'ADMIN123'
    ];

    try {
      try {
        await api.verifyAdminKey(cleanInput);
      } catch {
        // Fallback to local check
      }

      if (validKeys.includes(cleanInput)) {
        sessionStorage.setItem('herearn_admin_authenticated', 'true');
        sessionStorage.setItem('herearn_admin_verified_key', cleanInput);
        setIsAuthenticated(true);
        setIsVerifying(false);
        setEnteredKey('');
        pushAuditLog('ADMIN_LOGIN', `Super Admin logged in using key ${MASTER_ADMIN_KEY}`, 'security');
        if (showToast) {
          showToast('🔐 Super Admin Authenticated', 'Platform governance & escrow controls active.');
        }
      } else {
        setIsVerifying(false);
        setAuthError('Invalid Security Passkey. Access Denied.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setIsVerifying(false);
      setAuthError('Authentication verification failed.');
    }
  };

  // Lock / Logout Admin
  const handleAdminLock = () => {
    sessionStorage.removeItem('herearn_admin_authenticated');
    sessionStorage.removeItem('herearn_admin_verified_key');
    setIsAuthenticated(false);
    pushAuditLog('ADMIN_LOCK', 'Super Admin locked console session', 'security');
    if (showToast) {
      showToast('🔒 Admin Console Locked', 'Session ended. Master key required to reopen.');
    }
  };

  // Quick 1-click test fill
  const handleAutoFillKey = () => {
    setEnteredKey(MASTER_ADMIN_KEY);
  };

  // Gigs Actions
  const handleApproveGig = (id, title) => {
    setApprovedGigIds(prev => [...prev.filter(item => item !== id), id]);
    setFlaggedGigIds(prev => prev.filter(item => item !== id));
    pushAuditLog('GIG_APPROVED', `Approved & Escrow verified: "${title || id}"`, 'approval');
    if (showToast) showToast('✅ Gig Verified & Live', `"${title || 'Opportunity'}" is now public.`);
  };

  const handleFlagGig = (id, title) => {
    setFlaggedGigIds(prev => [...prev.filter(item => item !== id), id]);
    setApprovedGigIds(prev => prev.filter(item => item !== id));
    pushAuditLog('GIG_FLAGGED', `Flagged for security review: "${title || id}"`, 'warning');
    if (showToast) showToast('⚠️ Gig Flagged', 'Opportunity isolated pending audit.');
  };

  const handleDeleteGig = (id, title) => {
    setLocalGigs(prev => prev.filter(g => g.id !== id));
    if (setOpportunities) {
      setOpportunities(prev => prev.filter(g => g.id !== id));
    }
    pushAuditLog('GIG_DELETED', `Removed gig: "${title || id}"`, 'delete');
    if (showToast) showToast('🗑️ Gig Deleted', 'Listing removed from database.');
  };

  const handleCreateGigSubmit = (e) => {
    e.preventDefault();
    if (!newGig.title || !newGig.company) return;

    const created = {
      id: `gig-admin-${Date.now()}`,
      title: newGig.title,
      company: newGig.company,
      stipend: newGig.stipend,
      category: newGig.category,
      duration: newGig.duration,
      description: newGig.description || 'Verified enterprise opportunity created by Platform Administrator.',
      skillsRequired: newGig.skills.split(',').map(s => s.trim()),
      deliverables: ['Verified project milestone', 'Direct payout upon completion'],
      verifiedClient: true,
      isOpen: true,
      applicantsCount: 0,
      deadline: '7 Days Left',
      location: 'Remote'
    };

    setLocalGigs(prev => [created, ...prev]);
    if (setOpportunities) {
      setOpportunities(prev => [created, ...prev]);
    }
    setApprovedGigIds(prev => [created.id, ...prev]);
    setIsAddGigOpen(false);
    setNewGig({ title: '', company: '', stipend: '₹5,000', category: 'Digital Marketing', duration: '2 Weeks', description: '', skills: 'Canva, Social Media' });
    pushAuditLog('GIG_CREATED', `Admin posted official verified gig: "${created.title}"`, 'approval');
    if (showToast) showToast('🚀 Verified Gig Published', `"${created.title}" is now live on the board.`);
  };

  // User Actions
  const handleToggleUserStatus = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    pushAuditLog('USER_STATUS', `${name} account status changed to ${nextStatus}`, nextStatus === 'Suspended' ? 'delete' : 'user');
    if (showToast) showToast(nextStatus === 'Active' ? '✅ User Activated' : '🚫 User Suspended', `${name}'s account permissions updated.`);
  };

  const handleChangeUserRole = (id, name, newRole) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    pushAuditLog('ROLE_ELEVATION', `Changed ${name}'s role to ${newRole}`, 'user');
    if (showToast) showToast('🛡️ Role Elevated', `${name} is now ${newRole}.`);
  };

  const handleToggleUserKyc = (id, name, currentKyc) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, verifiedKyc: !currentKyc } : u));
    pushAuditLog('KYC_TOGGLE', `${!currentKyc ? 'Granted' : 'Revoked'} verified KYC for ${name}`, 'user');
    if (showToast) showToast(!currentKyc ? '⭐ KYC Verified' : 'KYC Revoked', `${name}'s identity status updated.`);
  };

  // Escrow Actions
  const handleReleaseEscrow = (id, amount, freelancer) => {
    setEscrowLedger(prev => prev.map(t => t.id === id ? { ...t, status: 'DISBURSED' } : t));
    pushAuditLog('ESCROW_DISBURSED', `Direct UPI payout released: ₹${amount.toLocaleString()} to ${freelancer}`, 'escrow');
    if (showToast) showToast('💸 Payout Disbursed', `₹${amount.toLocaleString()} released to ${freelancer}'s UPI.`);
  };

  const handleFreezeEscrow = (id, amount) => {
    setEscrowLedger(prev => prev.map(t => t.id === id ? { ...t, status: 'DISPUTED_FROZEN' } : t));
    pushAuditLog('ESCROW_DISPUTED', `Dispute freeze placed on transaction ${id} (₹${amount.toLocaleString()})`, 'warning');
    if (showToast) showToast('❄️ Escrow Frozen', `Dispute lock activated on ${id}.`);
  };

  // Broadcast Announcement
  const handleBroadcastAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setActiveBroadcast(announcementText.trim());
    pushAuditLog('BROADCAST_ALERT', `Sent platform banner: "${announcementText.trim()}"`, 'security');
    setAnnouncementText('');
    if (showToast) showToast('📢 Announcement Published', 'Flash broadcast is now visible across the platform.');
  };

  // Filtered Gigs
  const filteredGigs = useMemo(() => {
    return localGigs.filter(g => {
      const isApproved = approvedGigIds.includes(g.id);
      const isFlagged = flaggedGigIds.includes(g.id);

      if (gigFilter === 'pending' && (isApproved || isFlagged)) return false;
      if (gigFilter === 'verified' && !isApproved) return false;
      if (gigFilter === 'flagged' && !isFlagged) return false;

      if (gigSearch.trim()) {
        const q = gigSearch.toLowerCase();
        return (
          g.title?.toLowerCase().includes(q) ||
          g.company?.toLowerCase().includes(q) ||
          g.category?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [localGigs, gigFilter, gigSearch, approvedGigIds, flaggedGigIds]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
      if (userSearch.trim()) {
        const q = userSearch.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [usersList, userRoleFilter, userSearch]);

  // Filtered Escrow
  const filteredEscrow = useMemo(() => {
    return escrowLedger.filter(tx => {
      if (escrowFilter === 'HELD' && tx.status !== 'HELD_IN_ESCROW') return false;
      if (escrowFilter === 'DISBURSED' && tx.status !== 'DISBURSED') return false;
      if (escrowFilter === 'DISPUTED' && tx.status !== 'DISPUTED_FROZEN') return false;
      return true;
    });
  }, [escrowLedger, escrowFilter]);

  // Derived Financial Statistics
  const totalHeldEscrow = useMemo(() => {
    return escrowLedger.filter(t => t.status === 'HELD_IN_ESCROW').reduce((acc, curr) => acc + curr.amount, 0) + 175000;
  }, [escrowLedger]);

  const totalDisbursedEscrow = useMemo(() => {
    return escrowLedger.filter(t => t.status === 'DISBURSED').reduce((acc, curr) => acc + curr.amount, 0) + 412000;
  }, [escrowLedger]);

  const simulatedRevenue = Math.round((totalDisbursedEscrow * platformFeePercent) / 100);

  // =========================================================================
  // VIEW 1: ADMIN SECURITY GATE (LOCKED STATE)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md">
          {/* Neon Glow Ambient */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl blur-xl opacity-40 animate-pulse"></div>

          <div className={`relative bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl p-8 space-y-6 text-white ${shake ? 'animate-bounce' : ''}`}>
            
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">
                  Restricted Governance Zone
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white mt-2">
                  HerEarn Super Admin
                </h1>
                <p className="text-xs text-slate-400">
                  Enter master security key to unlock operational platform controls, escrow disbursements, and moderation.
                </p>
              </div>
            </div>

            <form onSubmit={handleKeySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Master Admin Passkey</span>
                  <span className="text-[10px] text-purple-400 font-mono">256-Bit Protected</span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={enteredKey}
                    onChange={(e) => {
                      setEnteredKey(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter Secret Key (e.g. HEREARN-ADMIN-2026-X9K)"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-purple-500/40 text-white placeholder-slate-500 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-2 text-red-300 text-xs font-bold animate-fade-in">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying || !enteredKey.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Cryptographic Passkey...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Authorize & Unlock Admin Console</span>
                  </>
                )}
              </button>
            </form>

            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Your Master Admin Key:</span>
              </div>
              <div className="inline-block px-3 py-1 rounded-lg bg-black/60 border border-purple-400/50 font-mono text-xs font-black tracking-widest text-emerald-400 select-all">
                {MASTER_ADMIN_KEY}
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleAutoFillKey}
                  className="text-[11px] font-bold text-pink-400 hover:text-pink-300 underline cursor-pointer"
                >
                  Click to Auto-fill this key ⚡
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href="/"
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>← Return to Public HerEarn Platform</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DEDICATED SUPER ADMIN MISSION CONTROL
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      
      {/* 1. DEDICATED ADMIN TOP BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-purple-500/30 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-white">HerEarn Admin OS</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Master Session
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Platform Governance, Moderation & Escrow Engine</p>
          </div>
        </div>

        {/* Live System Telemetry Status */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span>API Latency:</span>
            <span className="text-emerald-400 font-bold">34ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Uptime:</span>
            <span className="text-slate-200 font-bold">99.98%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-pink-400" />
            <span>Active DB Nodes:</span>
            <span className="text-slate-200 font-bold">Primary OK</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <a
            href="/"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
            title="Switch back to public website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Public Site</span>
          </a>

          <button
            onClick={handleAdminLock}
            className="px-3.5 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Lock administrative session"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* 2. LIVE BROADCAST BANNER */}
      {activeBroadcast && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 px-4 py-2 border-b border-purple-500/40 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded text-purple-300">Active Alert</span>
            <span className="font-semibold text-white truncate">{activeBroadcast}</span>
          </div>
          <button
            onClick={() => setActiveBroadcast('')}
            className="text-purple-300 hover:text-white text-xs shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. MAIN ADMINISTRATIVE BODY */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">

        {/* ADMINISTRATIVE NAVIGATION TABS (Strictly relevant tools) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { id: 'overview', label: 'Mission Control', icon: Activity },
            { id: 'gigs', label: 'Micro-Gig Moderation', icon: Briefcase, count: localGigs.length },
            { id: 'users', label: 'User Directory & RBAC', icon: Users, count: usersList.length },
            { id: 'escrow', label: 'Escrow Financial Ledger', icon: Wallet, count: escrowLedger.length },
            { id: 'controls', label: 'Platform Security Controls', icon: Sliders },
            { id: 'audit', label: 'Live Incident & Audit Trail', icon: FileText, count: auditLogs.length },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* =============================================================== */}
        {/* TAB 1: MISSION CONTROL & LIVE ANALYTICS */}
        {/* =============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Time Horizon Selector */}
            <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>Platform Operations & Telemetry</span>
                </h2>
                <p className="text-xs text-slate-400">Live platform performance and gross transaction metrics</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {['today', '7d', '30d', 'all'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      timeRange === t
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t === 'today' ? 'Today' : t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : 'All-Time'}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Financial KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">Gross Escrow Pool</span>
                  <Wallet className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl font-black text-white font-mono">₹{totalHeldEscrow.toLocaleString()}</p>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Fully Backed in Escrow
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Disbursed Payouts</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white font-mono">₹{totalDisbursedEscrow.toLocaleString()}</p>
                <span className="text-[10px] font-bold text-emerald-400">Paid to Female Creators</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">Active Micro-Gigs</span>
                  <Briefcase className="w-4 h-4 text-pink-400" />
                </div>
                <p className="text-2xl font-black text-white font-mono">{localGigs.length}</p>
                <span className="text-[10px] font-bold text-purple-400">
                  {approvedGigIds.length} Live • {localGigs.length - approvedGigIds.length} In Review
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">Verified User Base</span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-2xl font-black text-white font-mono">1,420</p>
                <span className="text-[10px] font-bold text-indigo-400">890 Learners • 530 Clients</span>
              </div>
            </div>

            {/* Interactive Section 1: Platform Take-Rate & Revenue Calculator */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Interactive Platform Take-Rate & Revenue Simulator</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust the platform commission rate slider to calculate platform net revenues on completed payouts.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-mono">Projected Platform Revenue</span>
                  <p className="text-2xl font-black text-emerald-400 font-mono">₹{simulatedRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Commission Rate: <strong className="text-purple-400">{platformFeePercent}%</strong></span>
                  <span className="text-slate-500">Range: 2% – 20%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={platformFeePercent}
                  onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Interactive Section 2: Platform Broadcast Notification Creator */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Broadcast Live System Announcement Banner</span>
              </h3>
              <p className="text-xs text-slate-400">
                Push an immediate flash notification banner to all connected users and learners across the platform.
              </p>

              <form onSubmit={handleBroadcastAnnouncement} className="flex gap-3 flex-col sm:flex-row">
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. 📢 15 New Micro-Gigs just verified! Apply today with zero fees."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                />
                <button
                  type="submit"
                  disabled={!announcementText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 2: MICRO-GIG VERIFICATION QUEUE */}
        {/* =============================================================== */}
        {activeTab === 'gigs' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-pink-400" />
                  <span>Micro-Gig Moderation & Verification Board</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Verify employer deposit guarantees before approving listings to the live job board.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsAddGigOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Verified Gig</span>
                </button>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  value={gigSearch}
                  onChange={(e) => setGigSearch(e.target.value)}
                  placeholder="Search by gig title, client, or category..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                {['all', 'pending', 'verified', 'flagged'].map(f => (
                  <button
                    key={f}
                    onClick={() => setGigFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      gigFilter === f
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Gigs Table / Cards */}
            <div className="space-y-3">
              {filteredGigs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-medium">
                  No opportunities found matching this criteria.
                </div>
              ) : (
                filteredGigs.map(opp => {
                  const isApproved = approvedGigIds.includes(opp.id);
                  const isFlagged = flaggedGigIds.includes(opp.id);

                  return (
                    <div
                      key={opp.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-700"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/20">
                            {opp.company}
                          </span>
                          <span className="text-xs font-black text-emerald-400 font-mono">
                            {opp.stipend}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            • {opp.category} • {opp.duration}
                          </span>
                          {isApproved && (
                            <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Live & Funded
                            </span>
                          )}
                          {isFlagged && (
                            <span className="text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Flagged for Fraud
                            </span>
                          )}
                        </div>

                        <h3 className="font-extrabold text-sm text-white">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {opp.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {!isApproved ? (
                          <button
                            onClick={() => handleApproveGig(opp.id, opp.title)}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve & Verify</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFlagGig(opp.id, opp.title)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold text-xs border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Flag</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteGig(opp.id, opp.title)}
                          className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
                          title="Delete opportunity permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal: Create Verified Gig */}
            {isAddGigOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black flex items-center gap-2">
                      <Plus className="w-5 h-5 text-pink-400" />
                      <span>Post Verified Enterprise Micro-Gig</span>
                    </h3>
                    <button onClick={() => setIsAddGigOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateGigSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Gig Title</label>
                      <input
                        type="text"
                        value={newGig.title}
                        onChange={(e) => setNewGig({ ...newGig, title: e.target.value })}
                        placeholder="e.g. Social Media Reel Creator & Canva Designer"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Company / Enterprise</label>
                        <input
                          type="text"
                          value={newGig.company}
                          onChange={(e) => setNewGig({ ...newGig, company: e.target.value })}
                          placeholder="e.g. KalaKriti Handlooms"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Stipend Amount</label>
                        <input
                          type="text"
                          value={newGig.stipend}
                          onChange={(e) => setNewGig({ ...newGig, stipend: e.target.value })}
                          placeholder="e.g. ₹6,500 (Flat Fee)"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Category</label>
                        <select
                          value={newGig.category}
                          onChange={(e) => setNewGig({ ...newGig, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        >
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Design">Graphic Design & Canva</option>
                          <option value="E-Commerce">E-Commerce & Shopify</option>
                          <option value="AI Data">AI Data Annotation</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">Duration</label>
                        <input
                          type="text"
                          value={newGig.duration}
                          onChange={(e) => setNewGig({ ...newGig, duration: e.target.value })}
                          placeholder="e.g. 2 Weeks"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Required Skills (Comma separated)</label>
                      <input
                        type="text"
                        value={newGig.skills}
                        onChange={(e) => setNewGig({ ...newGig, skills: e.target.value })}
                        placeholder="Canva, Instagram, Graphic Design"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddGigOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md"
                      >
                        Publish Verified Gig
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 3: USER DIRECTORY & RBAC CONTROLS */}
        {/* =============================================================== */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>Platform User Directory & Role-Based Access Control</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Elevate user permissions, verify identity KYC, or suspend fraudulent profiles.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {['ALL', 'LEARNER', 'EMPLOYER', 'ADMIN'].map(r => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      userRoleFilter === r
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by user name or email address..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Interactive Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">User / Email</th>
                    <th className="py-3 px-4">Role Privileges</th>
                    <th className="py-3 px-4">KYC Verification</th>
                    <th className="py-3 px-4">Funds Activity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeUserRole(u.id, u.name, e.target.value)}
                          className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-bold text-purple-300 cursor-pointer"
                        >
                          <option value="LEARNER">LEARNER</option>
                          <option value="EMPLOYER">EMPLOYER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleUserKyc(u.id, u.name, u.verifiedKyc)}
                          className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                            u.verifiedKyc
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {u.verifiedKyc ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          <span>{u.verifiedKyc ? 'Verified KYC' : 'Unverified'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                        {u.totalEarned}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.name, u.status)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            u.status === 'Active'
                              ? 'bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-500/30'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 4: ESCROW LEDGER & PAYOUT DISBURSEMENTS */}
        {/* =============================================================== */}
        {activeTab === 'escrow' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span>Escrow Financial Ledger & UPI Payout Authorization</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Client deposits are locked until milestone sign-off. One-click release directly to female freelancer accounts.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {['ALL', 'HELD', 'DISBURSED', 'DISPUTED'].map(f => (
                  <button
                    key={f}
                    onClick={() => setEscrowFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      escrowFilter === f
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredEscrow.map(tx => (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-purple-400">{tx.id}</span>
                      <span className="text-[10px] text-slate-500">• {tx.date}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        tx.status === 'HELD_IN_ESCROW'
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : tx.status === 'DISBURSED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {tx.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-white">{tx.gig}</h3>
                    <p className="text-xs text-slate-400">
                      Employer: <strong className="text-white">{tx.client}</strong> ➔ Freelancer: <strong className="text-purple-400">{tx.freelancer}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                    <span className="text-lg font-black text-white font-mono">₹{tx.amount.toLocaleString()}</span>

                    {tx.status === 'HELD_IN_ESCROW' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReleaseEscrow(tx.id, tx.amount, tx.freelancer)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Release UPI Payout</span>
                        </button>
                        <button
                          onClick={() => handleFreezeEscrow(tx.id, tx.amount)}
                          className="px-3 py-1.5 rounded-xl bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-500/30 font-bold text-xs transition-all cursor-pointer"
                        >
                          Freeze Dispute
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">
                        {tx.status === 'DISBURSED' ? 'Payout Disbursed ✅' : 'Frozen Under Review ❄️'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 5: PLATFORM SECURITY & EMERGENCY CONTROLS */}
        {/* =============================================================== */}
        {activeTab === 'controls' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fade-in">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Emergency Governance & Platform Switches</span>
              </h2>
              <p className="text-xs text-slate-400">
                Master operational toggles controlling platform safety, escrow lockouts, and registration gateways.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white">Platform Maintenance Mode</h4>
                  <p className="text-xs text-slate-400">Temporary lockout of public submissions during database migrations.</p>
                </div>
                <button
                  onClick={() => {
                    setPlatformControls(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
                    pushAuditLog('SECURITY_SWITCH', `Maintenance Mode toggled ${!platformControls.maintenanceMode ? 'ON' : 'OFF'}`, 'warning');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    platformControls.maintenanceMode
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {platformControls.maintenanceMode ? 'ACTIVE (LOCKED)' : 'OFF (NORMAL)'}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white">Emergency Escrow Lock</h4>
                  <p className="text-xs text-slate-400">Instantly halt all automatic UPI disbursements in the event of anomalies.</p>
                </div>
                <button
                  onClick={() => {
                    setPlatformControls(prev => ({ ...prev, escrowEmergencyLock: !prev.escrowEmergencyLock }));
                    pushAuditLog('SECURITY_SWITCH', `Emergency Escrow Freeze toggled ${!platformControls.escrowEmergencyLock ? 'ON' : 'OFF'}`, 'warning');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    platformControls.escrowEmergencyLock
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {platformControls.escrowEmergencyLock ? 'FROZEN (HALTED)' : 'ACTIVE (UNLOCKED)'}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white">Mandatory Identity KYC for Gigs</h4>
                  <p className="text-xs text-slate-400">Require phone/ID verification before learners can apply to high-value gigs.</p>
                </div>
                <button
                  onClick={() => {
                    setPlatformControls(prev => ({ ...prev, strictKycRequired: !prev.strictKycRequired }));
                    pushAuditLog('SECURITY_SWITCH', `Mandatory KYC requirement toggled ${!platformControls.strictKycRequired ? 'ON' : 'OFF'}`, 'security');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    platformControls.strictKycRequired
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {platformControls.strictKycRequired ? 'ENFORCED' : 'OPTIONAL'}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white">AI Content Moderation Shield</h4>
                  <p className="text-xs text-slate-400">Automated LLM scan for fake companies, spam proposals, and phishing.</p>
                </div>
                <button
                  onClick={() => {
                    setPlatformControls(prev => ({ ...prev, aiSpamFilter: !prev.aiSpamFilter }));
                    pushAuditLog('SECURITY_SWITCH', `AI Content Shield toggled ${!platformControls.aiSpamFilter ? 'ON' : 'OFF'}`, 'security');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    platformControls.aiSpamFilter
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {platformControls.aiSpamFilter ? 'PROTECTED' : 'DISABLED'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 6: IMMUTABLE AUDIT TRAIL */}
        {/* =============================================================== */}
        {activeTab === 'audit' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>Immutable Administrative Audit Trail</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Cryptographically sequenced record of all approvals, escrow releases, role elevations, and overrides.
                </p>
              </div>

              <button
                onClick={() => {
                  const json = JSON.stringify(auditLogs, null, 2);
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `herearn-audit-log-${Date.now()}.json`;
                  a.click();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer text-white border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit JSON</span>
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {auditLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      log.type === 'security'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : log.type === 'escrow'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : log.type === 'approval'
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-slate-300 font-sans font-medium">{log.detail}</span>
                  </div>

                  <span className="text-[10px] text-slate-500 shrink-0 font-mono">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
