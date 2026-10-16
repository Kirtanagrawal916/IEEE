import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { 
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
  Scale,
  Globe,
  FileText,
  Users,
  Shield,
  ChevronDown,
  IndianRupee,
  ArrowUpRight,
  Sparkles,
  Gamepad2,
  MessageSquare,
  Check
} from 'lucide-react';
import LogoutModal from './LogoutModal';
import WalletWithdrawModal from './WalletWithdrawModal';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ 
  user, 
  onLogout,
  theme, 
  onToggleTheme,
  onUpdateUser,
  showToast
}) {
  const { language, setLanguage, t, LANGUAGES } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCareerOpen, setIsCareerOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const menuRef = useRef(null);
  const careerRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (careerRef.current && !careerRef.current.contains(event.target)) {
        setIsCareerOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  // Active check for Career Opportunity group
  const isCareerActive = 
    pathname.startsWith('/courses') || 
    pathname === '/learn' || 
    pathname === '/portfolio' || 
    pathname.startsWith('/opportunities') || 
    pathname.startsWith('/opportunity');

  // User wallet balance
  const userBalance = user?.walletBalance !== undefined 
    ? user.walletBalance 
    : (user?.totalEarned !== undefined ? user.totalEarned : (user?.earnings || 0));

  const handleConfirmWithdrawal = (amount) => {
    const newBal = Math.max(0, userBalance - amount);
    const updatedUser = {
      ...user,
      walletBalance: newBal,
      totalEarned: newBal
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    } else {
      try {
        localStorage.setItem('herearn_user', JSON.stringify(updatedUser));
      } catch (e) {
        console.warn('[Navbar] Wallet save error:', e);
      }
    }
  };

  // Safe handle for user
  const userHandle = user?.username 
    ? `@${user.username}` 
    : (user?.name ? `@${user.name.toLowerCase().replace(/\s+/g, '')}` : '@learner');

  return (
    <nav className="glass-nav sticky top-0 z-50 shadow-md transition-colors w-full">
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center cursor-pointer group py-1"
            title="HerEarn - Skill to Income Platform"
          >
            <Logo size="sm" imgClassName="h-8 sm:h-9 w-auto" />
          </Link>

          {/* Central Navigation: Home | Career Opportunity (Dropdown: Courses, Portfolio, Opportunities) | Mentorship | Applications */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-purple-200 dark:border-purple-500/30 backdrop-blur-md shadow-lg">
            
            {/* Home */}
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-[#4B5563] dark:text-slate-200 hover:text-[#7C3AED] hover:bg-[#F3E8FF] dark:hover:bg-purple-950/40'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('home')}</span>
            </Link>

            {/* Career Opportunity Dropdown (Contains Courses, Portfolio, Opportunities) */}
            <div className="relative" ref={careerRef}>
              <button
                type="button"
                onClick={() => setIsCareerOpen(!isCareerOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCareerActive
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#4B5563] dark:text-slate-200 hover:text-[#7C3AED] hover:bg-[#F3E8FF] dark:hover:bg-purple-950/40'
                }`}
                title="Career Opportunities: Courses, Portfolio & Gigs"
              >
                <Briefcase className="w-4 h-4" />
                <span>Career Opportunity</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCareerOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Career Opportunity Menu Popover */}
              {isCareerOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                  <div className="px-3 py-1.5 border-b border-purple-500/20 text-[10px] font-extrabold text-purple-500 uppercase tracking-wider">
                    Career Progression Hub
                  </div>

                  {/* Course / Skill Tracks */}
                  <Link
                    to="/courses"
                    onClick={() => setIsCareerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                      (pathname.startsWith('/courses') || pathname === '/learn') && !location.search.includes('tab=puzzles')
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-500/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">Courses</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Free certified skill tracks & video lessons</p>
                    </div>
                  </Link>

                  {/* Mini Puzzle Games */}
                  <Link
                    to="/courses?tab=puzzles"
                    onClick={() => setIsCareerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${
                      location.search.includes('tab=puzzles')
                        ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-bold border border-pink-300 dark:border-pink-500/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">Mini Puzzle Games</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Queen placing & point connector puzzles</p>
                    </div>
                  </Link>

                  {/* Portfolio */}
                  <Link
                    to="/portfolio"
                    onClick={() => setIsCareerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                      pathname === '/portfolio'
                        ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-bold border border-pink-300 dark:border-pink-500/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">Portfolio</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Verified student showcases & projects</p>
                    </div>
                  </Link>

                  {/* Opportunities */}
                  <Link
                    to="/opportunities"
                    onClick={() => setIsCareerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                      pathname.startsWith('/opportunities') || pathname.startsWith('/opportunity')
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-500/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">Opportunities</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Micro-gigs, paid freelancing & internships</p>
                    </div>
                  </Link>

                </div>
              )}
            </div>

            {/* Mentorship */}
            <Link
              to="/mentorship"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/mentorship'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-[#4B5563] dark:text-slate-200 hover:text-[#7C3AED] hover:bg-[#F3E8FF] dark:hover:bg-purple-950/40'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Mentorship</span>
            </Link>

            {/* Community */}
            <Link
              to="/community"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pathname.startsWith('/community')
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-[#4B5563] dark:text-slate-200 hover:text-[#7C3AED] hover:bg-[#F3E8FF] dark:hover:bg-purple-950/40'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-pink-500" />
              <span>Community</span>
            </Link>

            {/* Applications (If Logged In) */}
            {user && (
              <Link
                to="/applications"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pathname === '/applications'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-[#4B5563] dark:text-slate-200 hover:text-[#7C3AED] hover:bg-[#F3E8FF] dark:hover:bg-purple-950/40'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>{t('applications')}</span>
              </Link>
            )}

            {/* Super Admin Portal */}
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/admin'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-[#4B5563] dark:text-slate-200 hover:text-[#7C3AED] hover:bg-[#F3E8FF] dark:hover:bg-purple-950/40'
              }`}
              title="Super Admin Portal (Staff Account & 2FA Passkey Protected)"
            >
              <Shield className="w-4 h-4 text-pink-500" />
              <span>Admin</span>
              {user?.role === 'ADMIN' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </Link>
          </div>

          {/* Right Section: Language Selector, Theme Switch, Guest Login/Sign Up & 3-Dot Menu */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Native Language Selector Dropdown (Protected from external translation mutations) */}
            <div className="relative notranslate" ref={langRef} translate="no">
              <button
                type="button"
                translate="no"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="notranslate flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-white/90 dark:bg-slate-900/90 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Select Language / भाषा चुनें"
              >
                <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400 notranslate" />
                <span className="hidden sm:inline font-bold notranslate" translate="no">{currentLangObj.native}</span>
                <span className="sm:hidden font-extrabold uppercase notranslate" translate="no">{currentLangObj.code}</span>
              </button>

              {isLangOpen && (
                <div 
                  className="notranslate absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 shadow-2xl p-2.5 z-50 animate-fade-in space-y-1.5 max-h-80 overflow-y-auto"
                  translate="no"
                >
                  <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 border-b border-purple-500/20 text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider z-10 flex items-center justify-between notranslate" translate="no">
                    <span className="notranslate" translate="no">Select Language</span>
                    <span className="notranslate font-mono text-[9px] text-slate-400" translate="no">{LANGUAGES.length} Languages</span>
                  </div>

                  {/* Permanent Static Language List - Always displays in original native script */}
                  <div className="space-y-1 notranslate" translate="no">
                    {LANGUAGES.map((langItem) => {
                      const isSelected = language === langItem.code;
                      return (
                        <button
                          key={langItem.code}
                          type="button"
                          translate="no"
                          onClick={() => {
                            setLanguage(langItem.code);
                            setIsLangOpen(false);
                          }}
                          className={`notranslate w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xs'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="notranslate font-bold text-[13px]" translate="no">
                            {langItem.native}
                          </span>
                          <div className="flex items-center gap-1.5 notranslate" translate="no">
                            <span className={`notranslate text-[11px] font-normal ${isSelected ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`} translate="no">
                              {langItem.name}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white shrink-0 notranslate" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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



            {/* Guest Action Buttons (When not logged in) */}
            {!user && (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`tap-target px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    pathname === '/login'
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'bg-white dark:bg-[#191026] border border-[#E5E7EB] dark:border-purple-800/40 text-[#4B5563] dark:text-slate-200 hover:text-[#7C3AED] hover:bg-[#F3E8FF]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/signup"
                  className={`tap-target px-4 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                    pathname === '/signup'
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Upper Right 3-Dot Menu Button */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                  isMenuOpen
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-500 shadow-md'
                    : 'bg-white dark:bg-slate-900/80 border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white'
                }`}
                title="Account, Withdraw & Navigation Menu"
                aria-label="Open 3-dot menu"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Dropdown Menu Popup */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white dark:bg-slate-950 border border-purple-200 dark:border-purple-500/40 shadow-2xl p-2.5 z-50 animate-fade-in text-slate-900 dark:text-white space-y-2">
                  
                  {/* 1. PROFILE SECTION (Visible at the top when logged in, as in picture) */}
                  {user && (
                    <div className="bg-slate-900 dark:bg-slate-900/90 border border-purple-500/30 rounded-2xl p-3 shadow-md space-y-2.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'} 
                          alt={user.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-400 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-sm text-white truncate max-w-[100px]">
                              {user.name || 'User'}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-950 border border-purple-500/40 text-purple-300">
                              {userHandle}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-emerald-400 font-extrabold text-sm tracking-tight">
                              ₹{userBalance.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400">earned</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Profile Navigation Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-purple-500/20">
                        <Link
                          to="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-center text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <User className="w-3 h-3 text-purple-400" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-2.5 py-1.5 rounded-lg bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-200 text-center text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-pink-400" />
                          <span>Dashboard</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* 2. WITHDRAW SECTION (Dedicated instant withdraw action in 3-dot menu) */}
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (!user) {
                          navigate('/login');
                          if (showToast) {
                            showToast("Login Required", "Please sign in to withdraw your earnings.");
                          }
                        } else {
                          setIsWithdrawModalOpen(true);
                        }
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/20 hover:from-emerald-500/25 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                      title="Instant UPI Withdrawal"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                          <IndianRupee className="w-4 h-4 font-bold" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">Withdraw</span>
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                              Instant UPI
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300">
                            Cash out wallet balance directly
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </button>
                  </div>

                  {/* 3. NAVIGATION MODULES (For mobile & quick access) */}
                  <div className="space-y-1 pt-1">
                    <div className="px-3 py-1 border-b border-purple-500/20">
                      <p className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">Explore Modules</p>
                    </div>

                    <Link
                      to="/courses"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        <span>Courses</span>
                      </div>
                    </Link>

                    <Link
                      to="/portfolio"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-pink-500" />
                        <span>Portfolios</span>
                      </div>
                    </Link>

                    <Link
                      to="/opportunities"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Briefcase className="w-4 h-4 text-amber-500" />
                        <span>Opportunities</span>
                      </div>
                    </Link>

                    <Link
                      to="/mentorship"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span>Mentorship</span>
                      </div>
                    </Link>

                    <Link
                      to="/community"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-pink-500" />
                        <span>Community & Chat</span>
                      </div>
                    </Link>

                    <Link
                      to="/courses?tab=puzzles"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Gamepad2 className="w-4 h-4 text-pink-500" />
                        <span>Mini Puzzle Games (12)</span>
                      </div>
                    </Link>

                    {user && (
                      <Link
                        to="/applications"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-emerald-500" />
                          <span>My Applications</span>
                        </div>
                      </Link>
                    )}

                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-4 h-4 text-pink-500" />
                        <span>Admin Portal</span>
                      </div>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300">
                        2FA Staff
                      </span>
                    </Link>
                  </div>

                  {/* 4. POLICIES & INFORMATION */}
                  <div className="space-y-1 pt-1 border-t border-purple-500/20">
                    <div className="px-3 py-1">
                      <p className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">Information</p>
                    </div>

                    <Link
                      to="/about"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2.5 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-purple-500" />
                      <span>About Us</span>
                    </Link>

                    <Link
                      to="/terms"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2.5 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Scale className="w-3.5 h-3.5 text-pink-500" />
                      <span>Terms & Conditions</span>
                    </Link>

                    <Link
                      to="/privacy"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2.5 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Scale className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Privacy Policy</span>
                    </Link>
                  </div>

                  {/* 5. LOG OUT OPTION (MUST BE AT THE VERY LAST) */}
                  {user && (
                    <div className="pt-2 border-t border-purple-200 dark:border-purple-500/20">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Wallet Instant UPI Withdrawal Modal */}
      <WalletWithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        walletBalance={userBalance}
        onConfirmWithdrawal={handleConfirmWithdrawal}
        showToast={showToast}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </nav>
  );
}