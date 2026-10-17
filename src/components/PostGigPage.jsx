import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  Briefcase, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Tag, 
  Eye, 
  ShieldCheck
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';

export default function PostGigPage({ onAddOpportunity, showToast }) {
  const navigate = useNavigate();

  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Digital Marketing');
  const [stipend, setStipend] = useState('₹4,500');
  const [duration, setDuration] = useState('3 Days');
  const [deadline, setDeadline] = useState('In 5 days');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('Instagram, Canva, Marketing');
  const [isPublishing, setIsPublishing] = useState(false);

  const categories = [
    'Digital Marketing', 
    'Canva & Design', 
    'Content Writing', 
    'E-Commerce & Shopify', 
    'Social Media Management'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company || !title || !description) return;

    setIsPublishing(true);

    const newGig = {
      id: `gig-${Date.now()}`,
      company,
      title,
      category,
      stipend,
      duration,
      deadline,
      description,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      applicantsCount: 0,
      applied: false,
      date: 'Just now'
    };

    setTimeout(() => {
      setIsPublishing(false);
      triggerCelebrationConfetti();
      if (onAddOpportunity) {
        onAddOpportunity(newGig);
      }

      // Broadcast notification to Notification Bar and Notification Center
      try {
        const notifList = JSON.parse(localStorage.getItem('herearn_notifications') || '[]');
        const newNotif = {
          id: `notif-${Date.now()}`,
          type: "skill_match",
          title: `🎯 New Opportunity: ${title}`,
          message: `${company} just posted a new paid gig with ${stipend}. Apply now to unlock your matching course lectures!`,
          timestamp: "Just now",
          isRead: false,
          path: `/opportunities/${newGig.id}`
        };
        localStorage.setItem('herearn_notifications', JSON.stringify([newNotif, ...notifList]));
        window.dispatchEvent(new CustomEvent('herearn_notifications_updated'));
        window.dispatchEvent(new CustomEvent('herearn_new_opportunity', { detail: newGig }));
      } catch (err) {
        console.warn('[PostGigPage] Notification dispatch error:', err);
      }

      if (showToast) {
        showToast("🚀 Opportunity Published!", `"${title}" is now open for applications on HerEarn.`);
      }
      navigate('/opportunities');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-[#0F0918] text-[#1F2937] dark:text-white transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Opportunities</span>
          </Link>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Employer & Client Partner Hub
          </span>
        </div>

        {/* Hero Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Post a Paid Micro-Gig / Opportunity
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Connect directly with verified, certified women creators for your marketing, design, and digital projects.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Form & Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 sm:p-8 shadow-md">
              <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Company / Brand Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Desi Crafts / Aspire Media"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Category Track <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                    Opportunity Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Instagram Reels Video Editor & Graphic Designer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Stipend / Payout (₹)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="₹4,500"
                      value={stipend}
                      onChange={(e) => setStipend(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="3 Days / Flexible"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Deadline
                    </label>
                    <input
                      type="text"
                      placeholder="In 5 days"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                    Required Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Canva, Video Editing, Social Media"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                    Job Description & Scope of Work <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe deliverables expected, project goals, and client requirements..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-extrabold text-xs shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isPublishing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publishing Opportunity...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Opportunity to Live Board</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* Right: Card Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-500/20 pb-3">
                <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Opportunity Card Preview
                </span>
                <span className="text-[10px] text-slate-400">Applicant Board View</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-purple-200 dark:border-purple-500/30 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    {category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {stipend}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {title || 'Opportunity Title'}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                    {company || 'Your Company Name'} • Remote
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {description || 'Detailed project description and scope of deliverables will appear here.'}
                </p>

                <div className="flex flex-wrap gap-1">
                  {skills.split(',').map((s, idx) => (
                    <span key={idx} className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded-md">
                      #{s.trim()}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Duration: {duration}</span>
                  <span>Deadline: {deadline}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 text-xs text-purple-800 dark:text-purple-300 leading-relaxed font-medium">
                🛡️ Verified applicants must pass a short skill screening quiz and attach portfolio proof before their proposal reaches your dashboard.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
