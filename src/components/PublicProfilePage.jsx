import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Award, 
  BookOpen, 
  Briefcase, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  ArrowLeft,
  Mail
} from 'lucide-react';
import { api } from '../services/api';
import { initialUser, initialPortfolios } from '../data/mockData';

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setIsLoading(true);

      try {
        const res = await api.getPublicPortfolio();
        if (res.success && res.projects) {
          const matchProj = res.projects.filter(p => p.userId === userId || p.authorName);
          setUserProjects(matchProj.length > 0 ? matchProj : initialPortfolios);
        } else {
          setUserProjects(initialPortfolios);
        }
      } catch (err) {
        setUserProjects(initialPortfolios);
      }

      // Mock or fetch profile user
      setProfileUser({
        name: userId ? `Learner (${userId.substring(0, 6)})` : initialUser.name,
        bio: 'Passionate digital creator and learner. Building market-relevant skills in marketing, graphic design, and web development to take on freelance micro-gigs.',
        location: 'Mumbai, India',
        skills: ['Digital Marketing', 'Social Media', 'Canva Design', 'Copywriting'],
        verified: true,
        completedTracksCount: 2
      });

      setIsLoading(false);
    };

    fetchPublicProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading public profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Portfolio Showcase
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-purple-500/20 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 p-1 shrink-0 shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-2xl">
              {profileUser?.name?.charAt(0) || 'H'}
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-black">{profileUser?.name}</h1>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Learner
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {profileUser?.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-pink-500" /> {profileUser?.location}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-purple-500" /> {profileUser?.completedTracksCount} Skill Tracks Completed
              </span>
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Skills Tags */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-purple-600 dark:text-purple-400 uppercase tracking-wider text-xs">
            Verified Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {profileUser?.skills?.map((skill, idx) => (
              <span 
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Showcase Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Public Portfolio Projects ({userProjects.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userProjects.map((proj) => (
            <div 
              key={proj.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-purple-500/20 shadow-md space-y-4 hover:border-purple-500 transition-all"
            >
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-800 relative">
                <img 
                  src={proj.image || '/portfolio_creator_ai.jpg'} 
                  alt={proj.title}
                  className="w-full h-full object-cover" 
                />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                  {proj.category}
                </span>
                <h3 className="font-bold text-base mt-1">{proj.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
              </div>

              {proj.link && (
                <a 
                  href={proj.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  View Live Project <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
