import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.jpg';
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
  Scale
} from 'lucide-react';
import LogoutModal from './LogoutModal';
import NotificationCenter from './NotificationCenter';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onLogout,
  onContinueAsGuest,
  theme, 
  onToggleTheme
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
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

  const handleNav = (tabName) => {
    if (setActiveTab) {
      setActiveTab(tabName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center cursor-pointer group"
          >
            <img
              src={logo}
              alt="HerEarn - Skill to Income Platform"
              className="h-16 w-auto group-hover:scale-105 transition-transform"
              style={theme === 'dark' ? { filter: 'contrast(1.4) brightness(1.1)', mixBlendMode: 'screen' } : {}}
            />
          </div>

          {/* Clean Navigation: Home | Courses | Opportunities | Dashboard (If Logged In) */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-purple-200 dark:border-purple-500/30 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('learn')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Courses</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('portfolio')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
              }`}
            >
              <Award className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Portfolios</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('opportunities')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'opportunities' || activeTab === 'gigs' || activeTab === 'opportunity_detail'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Opportunities</span>
            </button>

            {/* Profile / Dashboard Link */}
            {user && (
              <button
                type="button"
                onClick={() => handleNav('profile')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}
          </div>

          {/* Right Section: Notification Bell, Theme Toggle, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notification Center Bell */}
            <NotificationCenter theme={theme} onNavigate={(path) => {
              if (path.includes('opportunity')) handleNav('opportunities');
              else if (path.includes('learn')) handleNav('learn');
              else if (path.includes('portfolio')) handleNav('portfolio');
              else handleNav('profile');
            }} />

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

            {/* User Profile / Auth buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 px-3 py-1.5 rounded-xl cursor-pointer hover:border-pink-500 transition-all shadow-xs"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-purple-400" />
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold leading-tight text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">₹{(user.totalEarned || user.earnings || 0).toLocaleString()}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-purple-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {onContinueAsGuest && (
                  <button
                    type="button"
                    onClick={onContinueAsGuest}
                    className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white bg-purple-50 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer"
                    title="Explore HerEarn as a Guest Learner"
                  >
                    <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Guest Mode</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('login') : handleNav('login')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-purple-600 border-purple-500 text-white shadow-md ring-2 ring-purple-400'
                      : 'bg-white dark:bg-transparent text-purple-700 dark:text-white border-purple-300 dark:border-purple-500/30 hover:border-pink-500'
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('signup') : handleNav('signup')}
                  className="hidden sm:flex btn-gradient-award text-xs py-2 px-3.5 cursor-pointer shadow-md"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Mobile Dropdown Toggle Button */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                  isMenuOpen
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-500 shadow-md'
                    : 'bg-white dark:bg-slate-900/80 border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-slate-300 hover:text-purple-900 dark:hover:text-white'
                }`}
                title="Explore Sections"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu Popup */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-slate-950 border border-purple-200 dark:border-purple-500/40 shadow-2xl p-2 z-50 animate-fade-in text-slate-900 dark:text-white space-y-1">
                  <div className="px-3 py-1.5 border-b border-purple-500/20">
                    <p className="text-[11px] font-extrabold text-purple-600 dark:text-purple-300 uppercase tracking-wider">Explore Platform</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); handleNav('home'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Compass className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Home Landing Page</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); handleNav('learn'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <BookOpen className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span>Skill Courses & Challenges</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); handleNav('portfolio'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Public Portfolios Showcase</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); handleNav('opportunities'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Opportunities Board</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); handleNav('about'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>About HerEarn Platform</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); handleNav('terms'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Terms & Escrow Policy</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </nav>
  );
}