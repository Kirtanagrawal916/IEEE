import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, BookOpen, Briefcase, Award, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-8 animate-fade-in">
        
        {/* Glow Badge & 404 Number */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-20"></div>
          <span className="relative text-8xl sm:text-9xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            The page you're looking for doesn't exist or has moved. Explore our skill tracks and opportunities below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-500/30 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Quick Links Card */}
        <div className="pt-4 border-t border-purple-500/20 grid grid-cols-3 gap-2 sm:gap-3 text-left">
          <Link
            to="/courses"
            className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 transition-all group"
          >
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">Courses</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Skill tracks</p>
          </Link>

          <Link
            to="/portfolio"
            className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-purple-200 dark:border-purple-500/20 hover:border-pink-400 transition-all group"
          >
            <Award className="w-4 h-4 text-pink-600 dark:text-pink-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">Portfolio</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Showcases</p>
          </Link>

          <Link
            to="/opportunities"
            className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-purple-200 dark:border-purple-500/20 hover:border-amber-400 transition-all group"
          >
            <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-slate-900 dark:text-white">Opportunities</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Micro-gigs</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
