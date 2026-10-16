import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Award, 
  Heart, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  MapPin, 
  Briefcase,
  Sparkles,
  Check,
  Tag,
  ShieldCheck,
  MessageSquareQuote,
  Layers,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { initialPortfolios } from '../data/mockData';
import { api } from '../services/api';

export default function PortfolioDetailPage({ portfolios = initialPortfolios, user, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const allProjects = portfolios && portfolios.length > 0 ? portfolios : initialPortfolios;
  
  // Attempt to find project in local cache or fallback
  const initialProject = allProjects.find(p => String(p.id) === String(id)) || allProjects[0];
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState(false);

  // Likes tracking
  const [likes, setLikes] = useState(initialProject?.likes || initialProject?.likesCount || 14);
  const [hasLiked, setHasLiked] = useState(() => {
    try {
      const stored = localStorage.getItem('herearn_liked_portfolios');
      const list = stored ? JSON.parse(stored) : [];
      return list.includes(initialProject?.id);
    } catch {
      return false;
    }
  });

  // If project not in local list, attempt to fetch from backend
  useEffect(() => {
    const matched = allProjects.find(p => String(p.id) === String(id));
    if (matched) {
      setProject(matched);
      setLikes(matched.likes || matched.likesCount || 14);
    } else {
      setLoading(true);
      api.getProject(id)
        .then(res => {
          if (res.success && res.project) {
            setProject(res.project);
            setLikes(res.project.likes || res.project.likesCount || 14);
          }
        })
        .catch(err => {
          console.log('[PortfolioDetailPage] Fetch project notice:', err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id, allProjects]);

  const toggleLike = async () => {
    if (hasLiked) {
      setLikes(prev => Math.max(0, prev - 1));
      setHasLiked(false);
      try {
        const stored = JSON.parse(localStorage.getItem('herearn_liked_portfolios') || '[]');
        localStorage.setItem('herearn_liked_portfolios', JSON.stringify(stored.filter(x => x !== project.id)));
      } catch (e) {
        console.warn(e);
      }
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      try {
        const stored = JSON.parse(localStorage.getItem('herearn_liked_portfolios') || '[]');
        if (!stored.includes(project.id)) {
          stored.push(project.id);
          localStorage.setItem('herearn_liked_portfolios', JSON.stringify(stored));
        }
      } catch (e) {
        console.warn(e);
      }
      if (showToast) showToast("❤️ Liked!", "Your appreciation was recorded and synced.");
      
      // Sync to backend
      try {
        await api.likeProject(project.id);
      } catch (err) {
        console.log('[PortfolioDetail] Like sync notice:', err.message);
      }
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      if (showToast) showToast("🔗 Link Copied!", "Shareable portfolio case study link copied to clipboard.");
    }
  };

  const relatedProjects = allProjects
    .filter(p => String(p.id) !== String(project?.id) && p.category === project?.category)
    .slice(0, 3);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#FFF9F5] dark:bg-[#0F0918] text-[#1F2937] dark:text-white">
        <div className="text-center space-y-4">
          <p className="text-sm font-semibold text-slate-500">Project not found</p>
          <button 
            type="button" 
            onClick={() => navigate('/portfolio')}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
          >
            Return to Showcase
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-[#0F0918] text-[#1F2937] dark:text-white transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Portfolios</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Share Project"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={toggleLike}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                hasLiked 
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{likes}</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Assets, Deliverables, Testimonial (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual Showcase Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img
                  src={project.imageUrl || project.image || '/portfolio_creator_ai.jpg'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl border border-white/10">
                  {project.category}
                </div>
                {project.verified !== false && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>100% Verified Deliverable</span>
                  </div>
                )}
              </div>

              {/* Action Toolbar Below Image */}
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Track:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800">
                    {project.skillTrack || project.category}
                  </span>
                </div>

                {(project.link || project.projectUrl) && (
                  <a
                    href={project.link || project.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <span>View Live Deliverable / Asset</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Deliverables Checklist Card */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Verified Deliverables Package</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {project.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Testimonial Card */}
            {project.clientTestimonial && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 dark:from-purple-950/20 dark:to-slate-900 rounded-3xl border border-purple-100 dark:border-purple-800/40 p-6 sm:p-7 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Client Feedback & Review</span>
                </div>
                <p className="text-sm sm:text-base italic text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  "{project.clientTestimonial}"
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Project Details & Creator Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Creator Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={project.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.authorName || 'user'}`}
                  alt={project.authorName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-400 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {project.authorName || 'Learner'}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{project.location || 'India'}</span>
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between font-medium">
                <span>Skill Track Certification:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Certified
                </span>
              </div>
            </div>

            {/* Project Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
              
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Case Study Overview
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {project.title}
                </h1>
              </div>

              {/* Proven Impact Chip */}
              {project.impact && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>Impact:</strong> {project.impact}</span>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Scope & Strategic Execution
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {project.description}
                </p>
              </div>

              {/* Tools Used */}
              {project.toolsUsed && project.toolsUsed.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Tools & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.toolsUsed.map((tool, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Keywords & Categories
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(project.tags || [project.category]).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action to Explore Matching Gigs / Hire Creator */}
              <div className="pt-3">
                <Link
                  to="/opportunities"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs text-center shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Commission a Paid Micro-Gig with Creator</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              More Projects from {project.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map(rel => (
                <Link
                  key={rel.id}
                  to={`/portfolio/${rel.id}`}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:scale-[1.02] transition-all shadow-sm group block"
                >
                  <div className="h-40 bg-slate-950 overflow-hidden">
                    <img
                      src={rel.imageUrl || rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400">{rel.category}</p>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{rel.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">By {rel.authorName}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
