import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.jpg';
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
  UserPlus, 
  LogIn,
  LogOut,
  Info,
  Scale
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onLogout,
  onContinueAsGuest,
  theme, 
  onToggleTheme,
  onOpenAbout,
  onOpenTerms
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

  const handleNavSection = (sectionId) => {
    if (sectionId === 'top') {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <img
              src={logo}
              alt="HerEarn - Skill to Income Platform"
              className="h-16 w-auto group-hover:scale-105 transition-transform"
              style={theme === 'dark' ? { filter: 'contrast(1.4) brightness(1.1)', mixBlendMode: 'screen' } : {}}
            />
          </div>

          {/* Clean Navigation: Home | Courses | Opportunities | Dashboard (If Logged In) */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-purple-300 dark:border-purple-500/30 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => handleNavSection('top')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-900/40'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-900/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Courses</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gigs')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gigs'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-900/40'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Opportunities</span>
            </button>

            {/* Dashboard Link - Hidden until user is logged in */}
            {user && (
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-900/40'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}
          </div>

          {/* Right Section: Theme Toggle, Login/Sign Up, & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Light / Dark Mode Switch */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-purple-500/30 text-amber-400'
                  : 'bg-purple-50 border-purple-300 text-purple-700'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600" />
              )}
            </button>

            {/* Login & Sign Up Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2.5 bg-slate-900 dark:bg-slate-900 border border-purple-500/30 px-3 py-1.5 rounded-xl cursor-pointer hover:border-pink-500 transition-all"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-purple-400" />
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold leading-tight text-white">{user.name}</p>
                    <p className="text-[10px] text-emerald-400 font-extrabold">₹{(user.earnings || 0).toLocaleString()}</p>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={onLogout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-pink-400 hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                
                {/* LOGIN BUTTON (HIGH CONTRAST & SPECIFICATION STYLED) */}
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer"
                  title="Explore HerEarn as a Guest Learner"
                >
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Guest Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  aria-label="Login to your account"
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A855F7] ${
                    theme === 'dark'
                      ? activeTab === 'login'
                        ? 'bg-purple-600 border-2 border-purple-400 text-white shadow-lg ring-2 ring-purple-400'
                        : 'bg-slate-900/90 border-2 border-purple-500/80 text-purple-200 hover:bg-purple-950/80 hover:border-purple-400 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.30)] active:bg-purple-900'
                      : activeTab === 'login'
                        ? 'bg-[#EDE9FE] border-2 border-[#9333EA] text-[#6D28D9] shadow-md ring-2 ring-[#A855F7]'
                        : 'bg-[#FFFFFF] border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5EEFF] hover:border-[#9333EA] hover:text-[#6D28D9] hover:shadow-[0_0_15px_rgba(124,58,237,0.20)] active:bg-[#EDE9FE]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Login</span>
                </button>

                {/* SIGN UP BUTTON (PRIMARY CTA GRADIENT) */}
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  aria-label="Create free account"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                    activeTab === 'signup'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white ring-2 ring-pink-400 shadow-lg'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white hover:shadow-lg'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>

              </div>
            )}

            {/* Upper Right 3-Dot Menu Dropdown for Mobile / Explore */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
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
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-slate-950 border border-purple-500/40 shadow-2xl p-2 z-50 animate-fade-in text-white space-y-1">
                  <div className="px-3 py-1.5 border-b border-purple-500/20">
                    <p className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">Explore Modules</p>
                  </div>

                  {/* 1. Courses */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('learn')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      activeTab === 'learn' ? 'bg-purple-600 text-white' : 'hover:bg-purple-900/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>Courses</span>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-extrabold">4 Tracks</span>
                  </button>

                  {/* 2. Show Skill */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('portfolio')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      activeTab === 'portfolio' ? 'bg-pink-600 text-white' : 'hover:bg-purple-900/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-pink-400" />
                      <span>Portfolios</span>
                    </div>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-extrabold">Verified</span>
                  </button>

                  {/* 3. Opportunities */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('gigs')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      activeTab === 'gigs' ? 'bg-amber-600 text-white' : 'hover:bg-purple-900/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      <span>Opportunities</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-extrabold">8+ Gigs</span>
                  </button>

                  {user && (
                    <button
                      type="button"
                      onClick={() => handleSelectTab('profile')}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                        activeTab === 'profile' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'hover:bg-purple-900/40 text-slate-200'
                      }`}
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>My Dashboard</span>
                    </button>
                  )}

                  <div className="px-3 pt-2 border-t border-purple-500/20">
                    <p className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">Information & Policies</p>
                  </div>

                  {/* About Us */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenAbout) onOpenAbout();
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-purple-900/40 text-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Info className="w-4 h-4 text-purple-400" />
                      <span>About Us</span>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-extrabold">Mission</span>
                  </button>

                  {/* Terms & Conditions */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenTerms) onOpenTerms();
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-purple-900/40 text-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Scale className="w-4 h-4 text-pink-400" />
                      <span>Terms & Conditions</span>
                    </div>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-extrabold">Policy</span>
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