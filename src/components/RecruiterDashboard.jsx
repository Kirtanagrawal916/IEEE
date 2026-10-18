import React, { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Star, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Loader2, 
  X, 
  Lock, 
  Unlock, 
  AlertCircle,
  Calendar,
  Video,
  ExternalLink,
  IndianRupee,
  ShieldCheck,
  FileCheck,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';

const TYPES = ['Micro-Gig', 'Remote Internship', 'Remote Part-time', 'Freelance', 'Full-time'];
const CATEGORIES = ['Marketing', 'Design', 'Tech', 'Content', 'Business'];
const EMPTY_FORM = {
  title: '', company: '', stipend: '', type: TYPES[0], category: CATEGORIES[0],
  duration: '', deadline: '', skillsRequired: '', deliverables: '', description: '',
};
const STATUS_STYLE = {
  SUBMITTED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  UNDER_REVIEW: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  SHORTLISTED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
  ACCEPTED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  REJECTED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
};

const card = 'bg-white dark:bg-slate-900/95 border border-purple-200 dark:border-purple-500/30 rounded-2xl';
const input = 'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-purple-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white';
const btn = 'px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors disabled:opacity-50';

export default function RecruiterDashboard({ user, showToast }) {
  const [tab, setTab] = useState('jobs');
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('ALL');

  // Point 3: Interview Scheduling Modal State
  const [interviewModalApp, setInterviewModalApp] = useState(null);
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLink, setInterviewLink] = useState('');
  const [schedulingInterview, setSchedulingInterview] = useState(false);

  // Point 5: Escrow Approval State
  const [approvingAppId, setApprovingAppId] = useState(null);

  // Point 7: Recruiter Review Modal State
  const [reviewModalApp, setReviewModalApp] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [savingReview, setSavingReview] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const [s, j, a] = await Promise.all([
        api.getRecruiterStats(), api.getRecruiterJobs(), api.getRecruiterApplicants(),
      ]);
      setStats(s.stats);
      setJobs(j.jobs || []);
      setApplicants(a.applicants || []);
    } catch (err) {
      setError(err.status === 403 || err.status === 401
        ? 'Your account does not have recruiter access. Log in with a recruiter account.'
        : `Could not load your dashboard: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Helpful access notice for non-recruiter accounts
  if (user?.role && user.role !== 'EMPLOYER' && user.role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 mx-auto flex items-center justify-center">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recruiter Portal Access</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You are currently signed in as <strong className="text-purple-600 dark:text-purple-400">{user.email || user.username}</strong> ({user.role || 'Learner'}). This dashboard is dedicated to verified employers and recruiters managing job postings.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href="/dashboard"
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition-colors shadow-sm"
            >
              Go to Learner Dashboard
            </a>
            <a
              href="/login"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs text-center transition-colors"
            >
              Log in as Employer
            </a>
          </div>
        </div>
      </div>
    );
  }

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handlePost = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createRecruiterJob(form);
      showToast?.('Job posted', `"${form.title}" is now live for learners.`);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } catch (err) {
      showToast?.('Could not post job', err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleJob = async (job) => {
    try {
      await api.updateRecruiterJob(job.id, { isOpen: !job.isOpen });
      await load();
    } catch (err) { showToast?.('Update failed', err.message); }
  };

  const removeJob = async (job) => {
    if (!window.confirm(`Delete "${job.title}" and all its applications?`)) return;
    try {
      await api.deleteRecruiterJob(job.id);
      showToast?.('Job deleted', job.title);
      await load();
    } catch (err) { showToast?.('Delete failed', err.message); }
  };

  const setStatus = async (app, status) => {
    try {
      await api.updateApplicantStatus(app.id, status);
      await load();
    } catch (err) { showToast?.('Update failed', err.message); }
  };

  // Point 3: Handle Schedule Interview
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!interviewTime.trim() || !interviewLink.trim()) return;
    setSchedulingInterview(true);
    try {
      await api.scheduleInterview(interviewModalApp.id, {
        interviewTime: interviewTime.trim(),
        interviewLink: interviewLink.trim(),
      });
      showToast?.('📅 Interview Scheduled', `Invited ${interviewModalApp.user.name} for ${interviewTime}`);
      setInterviewModalApp(null);
      setInterviewTime('');
      setInterviewLink('');
      await load();
    } catch (err) {
      showToast?.('Scheduling failed', err.message);
    } finally {
      setSchedulingInterview(false);
    }
  };

  // Point 5: Handle Approve Deliverables & Disburse Escrow
  const handleApproveDeliverable = async (applicant) => {
    const stipend = applicant.opportunity?.stipend || '₹5,000';
    if (!window.confirm(`Approve deliverables and disburse escrow stipend (${stipend}) to ${applicant.user.name}'s wallet?`)) return;
    
    setApprovingAppId(applicant.id);
    try {
      const res = await api.approveApplicantPayout(applicant.id);
      showToast?.('🎉 Escrow Released!', res.message || 'Payment credited to candidate wallet.');
      await load();
    } catch (err) {
      showToast?.('Approval failed', err.message);
    } finally {
      setApprovingAppId(null);
    }
  };

  // Point 7: Handle Submit Recruiter Review
  const handleSubmitRecruiterReview = async (e) => {
    e.preventDefault();
    setSavingReview(true);
    try {
      await api.submitRecruiterReview(reviewModalApp.id, {
        rating: reviewRating,
        reviewText: reviewComment.trim(),
      });
      showToast?.('⭐ Review Saved', 'Your rating and feedback have been recorded.');
      setReviewModalApp(null);
      setReviewRating(5);
      setReviewComment('');
      await load();
    } catch (err) {
      showToast?.('Review submission failed', err.message);
    } finally {
      setSavingReview(false);
    }
  };

  const statCards = [
    { label: 'Total jobs', value: stats?.totalJobs, Icon: Briefcase },
    { label: 'Open now', value: stats?.openJobs, Icon: Unlock },
    { label: 'Applicants', value: stats?.totalApplicants, Icon: Users },
    { label: 'Shortlisted', value: stats?.shortlisted, Icon: Star },
    { label: 'Accepted', value: stats?.accepted, Icon: CheckCircle2 },
  ];
  const shown = filter === 'ALL' ? applicants : applicants.filter((a) => a.status === filter);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6 text-slate-900 dark:text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recruiter dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Signed in as {user?.name || 'Recruiter'}. Post jobs, schedule interviews, review deliverables, and approve escrow disbursements.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-extrabold flex items-center gap-2 cursor-pointer"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Close form' : 'Post a job'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-sm font-semibold flex gap-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map(({ label, value, Icon }) => (
          <div key={label} className={`${card} p-4`}>
            <Icon className="w-4 h-4 text-purple-500 mb-2" />
            <p className="text-2xl font-extrabold">{loading ? '–' : value ?? 0}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handlePost} className={`${card} p-5 sm:p-6 grid sm:grid-cols-2 gap-4`}>
          <h2 className="sm:col-span-2 text-lg font-extrabold">New job posting</h2>
          <input className={input} placeholder="Job title *" value={form.title} onChange={setField('title')} required />
          <input className={input} placeholder="Company name *" value={form.company} onChange={setField('company')} required />
          <input className={input} placeholder="Pay, e.g. ₹8,000 / month *" value={form.stipend} onChange={setField('stipend')} required />
          <input className={input} placeholder="Duration, e.g. 3 months" value={form.duration} onChange={setField('duration')} />
          <select className={input} value={form.type} onChange={setField('type')}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className={input} value={form.category} onChange={setField('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Apply by *
            <input type="date" className={`${input} mt-1`} value={form.deadline} onChange={setField('deadline')} required />
          </label>
          <input className={`${input} self-end`} placeholder="Skills needed, comma separated" value={form.skillsRequired} onChange={setField('skillsRequired')} />
          <input className={`${input} sm:col-span-2`} placeholder="What the person will deliver, comma separated" value={form.deliverables} onChange={setField('deliverables')} />
          <textarea className={`${input} sm:col-span-2 min-h-28`} placeholder="Describe the work *" value={form.description} onChange={setField('description')} required />
          <button type="submit" disabled={saving} className="sm:col-span-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Publish job
          </button>
        </form>
      )}

      <div className="flex gap-2 text-sm font-bold">
        {[['jobs', `My jobs (${jobs.length})`], ['applicants', `Applicants (${applicants.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl cursor-pointer ${tab === key ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>
      ) : tab === 'jobs' ? (
        jobs.length === 0 ? (
          <div className={`${card} p-10 text-center text-sm text-slate-600 dark:text-slate-300`}>
            You haven't posted any jobs yet. Select "Post a job" to reach learners.
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className={`${card} p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3`}>
                <div className="min-w-0">
                  <p className="font-extrabold">{job.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {job.company} · {job.type} · {job.stipend} · apply by {new Date(job.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-xs mt-1 font-semibold">
                    {job.applicants} applicant{job.applicants === 1 ? '' : 's'} ·{' '}
                    <span className={job.isOpen ? 'text-emerald-600' : 'text-slate-500'}>{job.isOpen ? 'Open' : 'Closed'}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleJob(job)} className={`${btn} bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1`}>
                    {job.isOpen ? <><Lock className="w-3 h-3" /> Close</> : <><Unlock className="w-3 h-3" /> Reopen</>}
                  </button>
                  <button onClick={() => removeJob(job)} className={`${btn} bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 flex items-center gap-1`}>
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full cursor-pointer ${filter === s ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                {s === 'ALL' ? 'All' : s.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
          {shown.length === 0 ? (
            <div className={`${card} p-10 text-center text-sm text-slate-600 dark:text-slate-300`}>
              No applicants here yet. They show up as learners apply to your jobs.
            </div>
          ) : shown.map((a) => (
            <div key={a.id} className={`${card} p-4 sm:p-5 space-y-4`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={a.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.user.name)}`} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-extrabold text-sm">{a.user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.user.email}{a.user.location ? ` · ${a.user.location}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.deliveryStatus === 'APPROVED' ? (
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                      Deliverable Paid ✅
                    </span>
                  ) : a.deliveryStatus === 'SUBMITTED' ? (
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 animate-pulse">
                      Deliverable Under Review ⏳
                    </span>
                  ) : null}
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[a.status] || STATUS_STYLE.SUBMITTED}`}>
                    {a.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>Applied for <b>{a.opportunity.title}</b></span>
                {a.opportunity.stipend && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
                    <IndianRupee className="w-3.5 h-3.5" /> {a.opportunity.stipend}
                  </span>
                )}
                <span>on {new Date(a.appliedAt).toLocaleDateString()}</span>
              </div>

              {a.coverNote && <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-slate-800">"{a.coverNote}"</p>}
              
              {a.user.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {a.user.skills.map((s) => <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold">{s}</span>)}
                </div>
              )}

              {/* Point 3: Interview Scheduled Callout */}
              {a.interviewTime && (
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div>
                      <span className="font-extrabold text-indigo-950 dark:text-indigo-200 block">Interview Scheduled</span>
                      <span className="text-indigo-700 dark:text-indigo-300">{a.interviewTime}</span>
                    </div>
                  </div>
                  {a.interviewLink && (
                    <a
                      href={a.interviewLink.startsWith('http') ? a.interviewLink : `https://${a.interviewLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Open Meeting</span>
                    </a>
                  )}
                </div>
              )}

              {/* Point 4 & Point 5: Deliverables Workroom Section & Escrow Release */}
              {(a.deliverableUrl || a.deliveryStatus === 'SUBMITTED' || a.deliveryStatus === 'APPROVED') && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4" /> Milestone Deliverables Submitted
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {a.submittedAt ? `Submitted: ${new Date(a.submittedAt).toLocaleDateString()}` : ''}
                    </span>
                  </div>

                  {a.deliverableUrl && (
                    <div className="flex items-center gap-2">
                      <a
                        href={a.deliverableUrl.startsWith('http') ? a.deliverableUrl : `https://${a.deliverableUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{a.deliverableUrl}</span>
                      </a>
                    </div>
                  )}

                  {a.deliverableNotes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/50">
                      "{a.deliverableNotes}"
                    </p>
                  )}

                  {/* Escrow Release Action */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Escrow: {a.opportunity?.stipend || '₹5,000'}</span>
                    </div>

                    {a.deliveryStatus !== 'APPROVED' ? (
                      <button
                        type="button"
                        onClick={() => handleApproveDeliverable(a)}
                        disabled={approvingAppId === a.id}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {approvingAppId === a.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>Approve Deliverables & Release Escrow Payout</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4" /> Escrow Disbursed to Candidate
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Point 7: Post-Gig Star Rating & Review Display */}
              {a.rating && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= a.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                      ))}
                      <span className="text-xs font-bold ml-1.5">{a.rating} / 5 Stars</span>
                    </div>
                    {a.reviewText && <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{a.reviewText}"</p>}
                  </div>
                  <span className="text-[10px] text-slate-400">By {a.reviewAuthor || 'Reviewer'}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => setStatus(a, 'UNDER_REVIEW')} disabled={a.status === 'UNDER_REVIEW'} className={`${btn} bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300`}>Mark under review</button>
                <button onClick={() => setStatus(a, 'SHORTLISTED')} disabled={a.status === 'SHORTLISTED'} className={`${btn} bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300`}>Shortlist</button>
                <button onClick={() => setStatus(a, 'ACCEPTED')} disabled={a.status === 'ACCEPTED'} className={`${btn} bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300`}>Accept</button>
                <button onClick={() => setStatus(a, 'REJECTED')} disabled={a.status === 'REJECTED'} className={`${btn} bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300`}>Reject</button>

                {/* Point 3: Schedule Interview Button */}
                <button
                  type="button"
                  onClick={() => {
                    setInterviewModalApp(a);
                    setInterviewTime(a.interviewTime || '');
                    setInterviewLink(a.interviewLink || '');
                  }}
                  className={`${btn} bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 flex items-center gap-1.5`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{a.interviewTime ? 'Reschedule Interview' : 'Schedule Interview'}</span>
                </button>

                {/* Point 7: Rate Candidate Button */}
                {!a.rating && (a.status === 'ACCEPTED' || a.deliveryStatus === 'APPROVED') && (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewModalApp(a);
                      setReviewRating(5);
                      setReviewComment('');
                    }}
                    className={`${btn} bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 flex items-center gap-1`}
                  >
                    <Star className="w-3 h-3" />
                    <span>Rate Candidate</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Point 3: Schedule Interview Modal */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl p-6 text-slate-900 dark:text-white space-y-5">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Schedule Candidate Interview</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">With {interviewModalApp.user.name}</p>
                </div>
              </div>
              <button
                onClick={() => setInterviewModalApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold">Interview Date & Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oct 24, 2026 at 4:30 PM IST"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className={input}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold">Video Meeting Link (Google Meet / Zoom) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  className={input}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInterviewModalApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={schedulingInterview}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {schedulingInterview && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save & Notify Applicant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Point 7: Recruiter Review Modal */}
      {reviewModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl p-6 text-slate-900 dark:text-white space-y-5">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Rate Freelancer Performance</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{reviewModalApp.user.name} • {reviewModalApp.opportunity.title}</p>
                </div>
              </div>
              <button
                onClick={() => setReviewModalApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRecruiterReview} className="space-y-4 text-xs">
              <div className="space-y-2 text-center py-2">
                <span className="block font-bold">Select Star Rating</span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star className={`w-8 h-8 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                    </button>
                  ))}
                </div>
                <span className="font-extrabold text-sm text-purple-600 dark:text-purple-400">{reviewRating} out of 5 Stars</span>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold">Feedback / Recommendation Note</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Exceptional delivery quality, punctual communication, and thorough documentation."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className={input}
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReview}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {savingReview && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}