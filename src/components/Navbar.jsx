import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

export default function Navbar({ 
  user, 
  onLogout,
  theme, 
  onToggleTheme
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

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

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center cursor-pointer group"
          >
            <img
              src={logo}
              alt="HerEarn - Skill to Income Platform"
              className="h-16 w-auto group-hover:scale-105 transition-transform"
              style={theme === 'dark' ? { filter: 'contrast(1.4) brightness(1.1)', mixBlendMode: 'screen' } : {}}
            />
          </Link>

          {/* Clean Navigation: Home | Courses | Opportunities | Dashboard (If Logged In) */}
          <div className="hidden md:flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/learn"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/learn'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Courses</span>
            </Link>

            <Link
              to="/portfolio"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/portfolio'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
              }`}
            >
              <Award className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Portfolios</span>
            </Link>

            <Link
              to="/opportunities"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pathname.startsWith('/opportunities') || pathname.startsWith('/opportunity')
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Opportunities</span>
            </Link>

            {/* Dashboard & Applications Links */}
            {user && (
              <>
                <Link
                  to="/applications"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pathname === '/applications'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Applications</span>
                </Link>

                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pathname.startsWith('/dashboard')
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </>
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

            {/* User Profile / Auth buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 px-3 py-1.5 rounded-xl cursor-pointer hover:border-pink-500 transition-all shadow-xs"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-purple-400" />
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold leading-tight text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">₹{(user.totalEarned || user.earnings || 0).toLocaleString()}</p>
                  </div>
                </Link>

                <button 
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  title="Log out of HerEarn"
                  aria-label="Log out"
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-purple-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    pathname === '/login'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 border-2 border-purple-500/80 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/signup"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                    pathname === '/signup'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white ring-2 ring-pink-400'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white hover:shadow-lg'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </div>
            )}

            {/* Upper Right 3-Dot Menu Dropdown for Mobile / Explore */}
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
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Dropdown Menu Popup */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-slate-950 border border-purple-200 dark:border-purple-500/40 shadow-2xl p-2 z-50 animate-fade-in text-slate-900 dark:text-white space-y-1">
                  <div className="px-3 py-1.5 border-b border-purple-500/20">
                    <p className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">Explore Modules</p>
                  </div>

                  <Link
                    to="/learn"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-purple-900/40 text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>Courses</span>
                    </div>
                  </Link>

                  <Link
                    to="/portfolio"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-purple-900/40 text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-pink-400" />
                      <span>Portfolios</span>
                    </div>
                  </Link>

                  <Link
                    to="/opportunities"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-purple-900/40 text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      <span>Opportunities</span>
                    </div>
                  </Link>

                  {user && (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 hover:bg-purple-900/40 text-slate-200 transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>My Dashboard</span>
                    </Link>
                  )}

                  <div className="px-3 pt-2 border-t border-purple-500/20">
                    <p className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">Information & Policies</p>
                  </div>

                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-purple-900/40 text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Info className="w-4 h-4 text-purple-400" />
                      <span>About Us</span>
                    </div>
                  </Link>

                  <Link
                    to="/terms"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-purple-900/40 text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Scale className="w-4 h-4 text-pink-400" />
                      <span>Terms & Conditions</span>
                    </div>
                  </Link>

                  <Link
                    to="/privacy"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-purple-900/40 text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      <span>Privacy Policy</span>
                    </div>
                  </Link>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </nav>
  );
}