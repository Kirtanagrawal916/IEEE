import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  User, 
  BookOpen, 
  Award, 
  Briefcase, 
  MoreVertical, 
  Sun, 
  Moon, 
  LogIn, 
  UserPlus, 
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onLogout,
  theme, 
  onToggleTheme 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                NariShakti<span className="text-pink-400">Skills</span>
              </span>
              <p className="text-[11px] opacity-75 font-medium tracking-wide">
                Skill to Income Platform
              </p>
            </div>
          </div>

          {/* Clean Main Direct Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-purple-500/20">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Right Section: Theme Toggle, Login/Sign Up, & 3-Dot Menu */}
          <div className="flex items-center gap-3">
            
            {/* Light / Dark Mode Switch */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 text-amber-400 hover:scale-105 transition-all shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-purple-400" />
              )}
            </button>

            {/* Login & Sign Up Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2.5 bg-slate-900 border border-purple-500/30 px-3 py-1.5 rounded-xl cursor-pointer hover:border-pink-500 transition-all"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-purple-400" />
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold leading-tight text-white">{user.name}</p>
                    <p className="text-[10px] text-emerald-400 font-extrabold">₹{(user.earnings || 0).toLocaleString()}</p>
                  </div>
                </div>

                <button 
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-pink-400 hover:bg-slate-800/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-purple-500/30 hover:border-pink-500 transition-all text-white"
                >
                  Login
                </button>

                <button
                  onClick={() => onOpenAuth('signup')}
                  className="btn-gradient-award text-xs py-2 px-4 shadow-md flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Sign Up
                </button>
              </div>
            )}

            {/* Upper Right 3-Dot Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                  isMenuOpen || ['learn', 'portfolio', 'gigs'].includes(activeTab)
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-500 shadow-md'
                    : 'bg-slate-900/80 border-purple-500/20 text-slate-300 hover:text-white'
                }`}
                title="Explore Sections"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Dropdown Menu Popup */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-slate-950 border border-purple-500/40 shadow-2xl p-2 z-50 animate-fade-in text-white">
                  <div className="px-3 py-2 border-b border-purple-500/20 mb-1">
                    <p className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">Explore Modules</p>
                  </div>

                  {/* 1. Learn Case */}
                  <button
                    onClick={() => handleSelectTab('learn')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      activeTab === 'learn' ? 'bg-purple-600 text-white' : 'hover:bg-purple-900/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>Learn Case</span>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-extrabold">5 Lessons</span>
                  </button>

                  {/* 2. Show Skill */}
                  <button
                    onClick={() => handleSelectTab('portfolio')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      activeTab === 'portfolio' ? 'bg-pink-600 text-white' : 'hover:bg-purple-900/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-pink-400" />
                      <span>Show Skill</span>
                    </div>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-extrabold">Verified</span>
                  </button>

                  {/* 3. Opportunity */}
                  <button
                    onClick={() => handleSelectTab('gigs')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      activeTab === 'gigs' ? 'bg-amber-600 text-white' : 'hover:bg-purple-900/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      <span>Opportunity</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-extrabold">3 Gigs</span>
                  </button>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
