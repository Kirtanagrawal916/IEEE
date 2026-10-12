import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Award, 
  Heart, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  User, 
  MapPin, 
  Calendar, 
  Tag, 
  Briefcase,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { initialPortfolios } from '../data/mockData';

export default function PortfolioDetailPage({ portfolios = initialPortfolios, user, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const allProjects = portfolios && portfolios.length > 0 ? portfolios : initialPortfolios;
  const project = allProjects.find(p => String(p.id) === String(id)) || allProjects[0];

  const [likes, setLikes] = useState(project.likes || 12);
  const [hasLiked, setHasLiked] = useState(false);

  const toggleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
      if (showToast) showToast("❤️ Liked!", "Your appreciation was recorded.");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      if (showToast) showToast("🔗 Link Copied!", "Shareable portfolio link copied to clipboard.");
    }
  };

  const relatedProjects = allProjects
    .filter(p => String(p.id) !== String(project.id) && p.category === project.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Portfolios</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Share Project"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={toggleLike}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                hasLiked 
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40 text-rose-600'
                  : 'bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-500/30 text-slate-700 dark:text-slate-300 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{likes}</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Asset Display (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 overflow-hidden shadow-xl">
              <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                <img
                  src={project.imageUrl || project.image || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                  {project.category}
                </div>
                {project.verified !== false && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified Skill Deliverable
                  </div>
                )}
              </div>

              {/* Action Toolbar Below Image */}
              <div className="p-5 border-t border-purple-100 dark:border-purple-500/20 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Track:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-500/30">
                    {project.skillTrack || project.category}
                  </span>
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <span>Open Live Deliverable / Canva</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Project Details & Creator Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Creator Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 shadow-md space-y-4">
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

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Verified Deliverable:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Certified
                </span>
              </div>
            </div>

            {/* Project Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 sm:p-7 shadow-xl space-y-5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                {project.title}
              </h1>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Deliverable Scope & Strategy
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2 pt-2 border-t border-purple-100 dark:border-purple-500/20">
                <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Skills & Tools Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(project.tags || [project.category]).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action to Explore Matching Gigs */}
              <div className="pt-2">
                <Link
                  to="/opportunities"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-extrabold text-xs text-center shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Explore Matching Client Gigs</span>
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
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-purple-500/30 overflow-hidden hover:scale-[1.02] transition-all shadow-md group block"
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
