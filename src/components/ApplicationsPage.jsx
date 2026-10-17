import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Building, 
  Sparkles, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  ArrowRight,
  Send,
  Lock,
  IndianRupee,
  Calendar,
  Video,
  Star
} from 'lucide-react';
import { api } from '../services/api';
import { initialOpportunities } from '../data/mockData';
import DeliverableWorkroomModal from './DeliverableWorkroomModal';

export default function ApplicationsPage({ user, onUpdateWallet, showToast }) {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Workroom Modal State
  const [selectedWorkroomApp, setSelectedWorkroomApp] = useState(null);
  const [isWorkroomOpen, setIsWorkroomOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await api.getMyApplications();
        if (res.success && res.applications) {
          setApplications(res.applications);
        } else {
          throw new Error('No applications API response');
        }
      } catch (err) {
        // Fallback for demo guest accounts
        const userGigIds = user?.appliedGigIds || [];
        const userGigs = initialOpportunities.filter(g => userGigIds.includes(g.id));
        setApplications(userGigs.map(g => ({
          id: `app-${g.id}`,
          opportunityTitle: g.title,
          company: g.company,
          stipend: g.stipend,
          status: 'SHORTLISTED', // Demo with shortlisted to allow workroom testing
          deliveryStatus: 'IN_PROGRESS',
          appliedAt: new Date().toLocaleDateString(),
          coverNote: 'I have built portfolio projects matching this role and am eager to contribute.'
        })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleOpenWorkroom = (app) => {
    setSelectedWorkroomApp(app);
    setIsWorkroomOpen(true);
  };

  const handleApproveAndReleasePayment = (appId, amount) => {
    // 1. Update application state locally
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return { ...a, status: 'ACCEPTED', deliveryStatus: 'APPROVED' };
      }
      return a;
    }));

    // 2. Update user wallet balance in localStorage and app
    try {
      const savedUserStr = localStorage.getItem('herearn_user');
      const currentUser = savedUserStr ? JSON.parse(savedUserStr) : (user || {});
      const currentBal = currentUser.walletBalance || currentUser.totalEarned || 12000;
      const updatedUser = {
        ...currentUser,
        walletBalance: currentBal + amount,
        totalEarned: (currentUser.totalEarned || 0) + amount
      };
      localStorage.setItem('herearn_user', JSON.stringify(updatedUser));
      if (onUpdateWallet) {
        onUpdateWallet(updatedUser);
      }
    } catch (e) {
      console.warn('[ApplicationsPage] Wallet update error:', e);
    }
  };

  const getStatusBadge = (app) => {
    const status = app.status;
    const deliveryStatus = app.deliveryStatus;

    if (deliveryStatus === 'APPROVED') {
      return <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300">Paid & Delivered ✓</span>;
    }
    if (deliveryStatus === 'SUBMITTED') {
      return <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300">Deliverables Under Review ⏳</span>;
    }

    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300">Accepted 🎉</span>;
      case 'SHORTLISTED':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300">Shortlisted ✨</span>;
      case 'UNDER_REVIEW':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300">Under Review ⏳</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-300">Not Selected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300">Submitted 🚀</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 p-6 sm:p-10 border border-purple-500/30 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-pink-400" /> My Opportunity Applications & Workrooms
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Application & Milestone Tracker</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Track client evaluation, submit deliverables in the secure workroom, and claim escrow payouts.
          </p>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Fetching your submitted applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-purple-500/20 shadow-md space-y-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">No Applications Submitted Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Explore active opportunities matching your skills and apply using your portfolio projects.
          </p>
          <Link 
            to="/opportunities" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-all"
          >
            Explore Opportunities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-purple-500/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-purple-500"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{app.company}</span>
                  {getStatusBadge(app)}
                </div>

                <h3 className="text-lg font-bold">{app.opportunityTitle || app.title}</h3>

                {app.coverNote && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="font-bold">Proposal Pitch:</span> "{app.coverNote}"
                  </p>
                )}

                {/* Point 3: Interview Callout Banner for Applicant */}
                {app.interviewTime && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase text-indigo-700 dark:text-indigo-300 block">
                          Client Interview Scheduled
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {app.interviewTime}
                        </span>
                      </div>
                    </div>

                    {app.interviewLink && (
                      <a
                        href={app.interviewLink.startsWith('http') ? app.interviewLink : `https://${app.interviewLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Call</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Point 7: Post-Gig Rating & Review for Applicant */}
                {app.rating && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= app.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                        ))}
                        <span className="font-bold ml-1.5">{app.rating} / 5 Stars</span>
                      </div>
                      {app.reviewText && <p className="text-slate-600 dark:text-slate-300 italic">"{app.reviewText}"</p>}
                    </div>
                    <span className="text-[10px] text-slate-400">Review by {app.reviewAuthor || 'Client'}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Applied: {app.appliedAt}
                  </span>
                  {app.stipend && (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" /> Stipend: {app.stipend}
                    </span>
                  )}
                  <span className="text-purple-600 dark:text-purple-400 font-bold inline-flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                    </span>
                    <Lock className="w-3 h-3" /> Escrow Protected
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2.5">
                {/* Milestone Workroom CTA */}
                <button
                  type="button"
                  onClick={() => handleOpenWorkroom(app)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Workroom & Submit</span>
                </button>

                <Link 
                  to="/opportunities" 
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deliverable Workroom Modal */}
      <DeliverableWorkroomModal
        isOpen={isWorkroomOpen}
        onClose={() => setIsWorkroomOpen(false)}
        application={selectedWorkroomApp}
        onApproveAndReleasePayment={handleApproveAndReleasePayment}
        showToast={showToast}
      />

    </div>
  );
}
