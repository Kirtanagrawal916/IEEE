import React, { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Briefcase, Users, Star, CheckCircle2, Plus, Trash2, Loader2, X, Lock, Unlock, AlertCircle } from 'lucide-react';
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

  // Learners should never see this page
  if (user?.role && user.role !== 'EMPLOYER' && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
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
            Signed in as {user?.name || 'Recruiter'}. Post jobs and review the women who apply.
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
            <div key={a.id} className={`${card} p-4 sm:p-5 space-y-3`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={a.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.user.name)}`} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-extrabold text-sm">{a.user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.user.email}{a.user.location ? ` · ${a.user.location}` : ''}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[a.status] || STATUS_STYLE.SUBMITTED}`}>
                  {a.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Applied for <b>{a.opportunity.title}</b> on {new Date(a.appliedAt).toLocaleDateString()}</p>
              {a.coverNote && <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 rounded-xl p-3">{a.coverNote}</p>}
              {a.user.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {a.user.skills.map((s) => <span key={s} className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold">{s}</span>)}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setStatus(a, 'UNDER_REVIEW')} disabled={a.status === 'UNDER_REVIEW'} className={`${btn} bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300`}>Mark under review</button>
                <button onClick={() => setStatus(a, 'SHORTLISTED')} disabled={a.status === 'SHORTLISTED'} className={`${btn} bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300`}>Shortlist</button>
                <button onClick={() => setStatus(a, 'ACCEPTED')} disabled={a.status === 'ACCEPTED'} className={`${btn} bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300`}>Accept</button>
                <button onClick={() => setStatus(a, 'REJECTED')} disabled={a.status === 'REJECTED'} className={`${btn} bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300`}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}