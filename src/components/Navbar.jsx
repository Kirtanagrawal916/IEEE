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
  ChevronDown,
  Globe,
  Check,
  Info,
  Scale,
  FileText
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onLogout,
  theme, 
  onToggleTheme,
  onOpenAbout,
  onOpenTerms
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const menuRef = useRef(null);
  const langRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'gu', label: 'ગુજરાતી' }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
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
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                Her<span className="text-pink-400">Earn</span>
              </span>
              <p className="text-[11px] text-slate-200 dark:text-slate-200 font-bold tracking-wide opacity-95">
                Skill to Income Platform
              </p>
            </div>
          </div>

          {/* Clean Navigation: Home | Courses | Opportunities | Dashboard (If Logged In) */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/90 p-1.5 rounded-2xl border border-purple-500/30 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => handleNavSection('top')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-200 hover:text-white hover:bg-purple-900/40'
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
                  : 'text-slate-200 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Courses</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gigs')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gigs'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-200 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
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
                    : 'text-slate-200 hover:text-white hover:bg-purple-900/40'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}
          </div>

          {/* Right Section: Language Toggle, Theme Toggle, Login/Sign Up, & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Select Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-purple-500/20 text-xs font-bold text-slate-200 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-4 h-4 text-purple-400" />
                <span>{languages.find(l => l.code === lang)?.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-950 border border-purple-500/40 shadow-2xl p-1.5 z-50 text-white animate-fade-in text-xs">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLang(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                        lang === l.code ? 'bg-purple-600 text-white' : 'hover:bg-purple-900/40 text-slate-300'
                      }`}
                    >
                      <span>{l.label}</span>
                      {lang === l.code && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Light / Dark Mode Switch */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 text-amber-400 hover:scale-105 transition-all shadow-xs cursor-pointer"
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
                  type="button"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-pink-400 hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all text-white cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-purple-600 border-purple-500 shadow-md ring-2 ring-purple-400'
                      : 'border-purple-500/30 hover:border-pink-500'
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className={`text-xs py-2 px-3.5 shadow-md flex items-center gap-1.5 cursor-pointer rounded-xl transition-all ${
                    activeTab === 'signup'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold ring-2 ring-pink-400'
                      : 'btn-gradient-award'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
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
