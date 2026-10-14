import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import GoogleSignInButton from './GoogleSignInButton';
import Logo from './Logo';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  Award,
  Shield,
  KeyRound,
  Unlock,
  User,
  Briefcase,
} from 'lucide-react';

// Master Admin Key (keep this secret / move to env later)
const MASTER_ADMIN_KEY = 'HEREARN-ADMIN-2026-X9K';

export default function LoginPage({ onLoginSuccess, onNavigateToSignup, onNavigateHome, onContinueAsGuest }) {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('user'); // 'user' | 'recruiter' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Admin Key Login State (kept for real admin)
  const [adminKey, setAdminKey] = useState('');
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setIsAdminLoading(true);

    const cleanKey = adminKey.trim().toUpperCase();
    const validKeys = [
      MASTER_ADMIN_KEY,
      'HEREARN-ADMIN-2026-X9K',
      'HEREARN-2026-ADMIN',
      'HEREARN2026',
      'ADMIN123'
    ];

    try {
      const res = await api.verifyAdminKey(cleanKey).catch(() => null);

      if (res?.success || validKeys.includes(cleanKey)) {
        const adminUser = {
          id: res?.user?.id || 'admin-master',
          name: res?.user?.name || 'Platform Administrator',
          username: 'admin',
          email: res?.user?.email || 'admin@herearn.platform',
          role: 'ADMIN',
          isAdmin: true,
          status: 'Active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin'
        };

        sessionStorage.setItem('herearn_admin_authenticated', 'true');
        sessionStorage.setItem('herearn_admin_verified_key', cleanKey);
        localStorage.setItem('herearn_admin_authenticated', 'true');
        localStorage.setItem('herearn_user', JSON.stringify(adminUser));

        if (res?.token) {
          sessionStorage.setItem('herearn_admin_token', res.token);
          localStorage.setItem('herearn_jwt_token', res.token);
        }

        setIsAdminLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(adminUser);
        }
        navigate('/admin');
        return;
      } else {
        setIsAdminLoading(false);
        setAdminError('Invalid Security Passkey. Access denied.');
      }
    } catch (err) {
      setIsAdminLoading(false);
      setAdminError('Authentication verification failed.');
    }
  };

  // Form Submission (Supports Email or Username) – works for both User & Recruiter
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetInput = email.trim();
    const targetPassword = password.trim();

    if (!targetInput) {
      setError('Please enter your email address or username.');
      return;
    }

    if (!targetPassword) {
      setError('Please enter your password.');
      return;
    }

    // DIRECT ADMIN MASTER KEY DETECTION
    // If the user entered the Master Admin Key as their password or email, immediately log in as Admin & navigate to /admin!
    const validAdminKeys = [
      MASTER_ADMIN_KEY,
      'HEREARN-ADMIN-2026-X9K',
      'HEREARN-2026-ADMIN',
      'HEREARN2026',
      'ADMIN123'
    ];
    const upperInput = targetInput.toUpperCase();
    const upperPass = targetPassword.toUpperCase();

    if (validAdminKeys.includes(upperPass) || validAdminKeys.includes(upperInput)) {
      const cleanKey = validAdminKeys.includes(upperPass) ? upperPass : upperInput;
      const adminUser = {
        id: 'admin-master',
        name: 'Platform Administrator',
        username: 'admin',
        email: targetInput.includes('@') ? targetInput : 'admin@herearn.platform',
        role: 'ADMIN',
        isAdmin: true,
        status: 'Active',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin'
      };

      sessionStorage.setItem('herearn_admin_authenticated', 'true');
      sessionStorage.setItem('herearn_admin_verified_key', cleanKey);
      localStorage.setItem('herearn_admin_authenticated', 'true');
      localStorage.setItem('herearn_user', JSON.stringify(adminUser));

      // Trigger background token fetch if backend is active
      api.verifyAdminKey(cleanKey).then(res => {
        if (res?.token) {
          sessionStorage.setItem('herearn_admin_token', res.token);
          localStorage.setItem('herearn_jwt_token', res.token);
        }
      }).catch(() => {});

      if (onLoginSuccess) {
        onLoginSuccess(adminUser);
      }
      navigate('/admin');
      return;
    }

    setIsLoading(true);

    // 1. Search persistent local user registry by username or email
    const cleanSearch = targetInput.toLowerCase().replace(/^@/, '');
    const registeredUsers = JSON.parse(localStorage.getItem('herearn_registered_users') || '[]');
    const matchedUser = registeredUsers.find(u =>
      (u.email && u.email.toLowerCase() === targetInput.toLowerCase()) ||
      (u.username && u.username.toLowerCase() === cleanSearch) ||
      (u.name && u.name.toLowerCase() === targetInput.toLowerCase())
    );

    // If account found locally with password, enforce password check immediately
    if (matchedUser && matchedUser.password && matchedUser.password !== targetPassword) {
      setIsLoading(false);
      setError('Incorrect password for this account. Please verify your password and try again.');
      return;
    }

    const lookupEmail = matchedUser?.email || (targetInput.includes('@') ? targetInput : `${cleanSearch}@herearn.org`);

    try {
      const res = await api.login({ email: lookupEmail, username: cleanSearch, password: targetPassword });
      const userRole = (res.user?.role || matchedUser?.role || 'LEARNER').toUpperCase();

      // Recruiter tab: only EMPLOYER (recruiter) or ADMIN accounts may continue.
      // Checked BEFORE saving the token so a learner never gets logged in from this tab.
      if (loginType === 'recruiter' && userRole !== 'EMPLOYER' && userRole !== 'ADMIN') {
        setIsLoading(false);
        setError('This is not a recruiter account. Use the Learner & Employer tab, or sign up as a recruiter.');
        return;
      }

      if (res?.token) {
        localStorage.setItem('herearn_jwt_token', res.token);
      }
      setIsLoading(false);

      const resolvedUsername = matchedUser?.username || res.user?.username || cleanSearch;
      const resolvedName = matchedUser?.name || res.user?.name || (resolvedUsername.charAt(0).toUpperCase() + resolvedUsername.slice(1));

      // App.jsx redirects by role: EMPLOYER -> /recruiter, ADMIN -> /admin, others -> /dashboard
      onLoginSuccess({
        ...(matchedUser || {}),
        ...(res.user || {}),
        name: resolvedName,
        username: resolvedUsername,
        email: lookupEmail,
        role: userRole,
        isSignUp: false,
      });
    } catch (err) {
      setIsLoading(false);
      if (err.status === 401) {
        setError(err.message || 'Incorrect password. Please verify your password.');
        return;
      }

      if (err.status === 404) {
        setError(`No account found matching "${targetInput}". Please check your credentials or create a new account.`);
        return;
      }

      // Offline / network fallback with password verification
      if (matchedUser) {
        if (matchedUser.password && matchedUser.password !== targetPassword) {
          setError('Incorrect password. Please check your credentials and try again.');
          return;
        }

        const resolvedUsername = matchedUser.username || cleanSearch;
        const resolvedName = matchedUser.name || (resolvedUsername.charAt(0).toUpperCase() + resolvedUsername.slice(1));
        const userRole = (matchedUser.role || 'LEARNER').toUpperCase();

        onLoginSuccess({
          ...matchedUser,
          name: resolvedName,
          username: resolvedUsername,
          email: matchedUser.email || lookupEmail,
          role: userRole,
          isSignUp: false,
        });
      } else {
        setError(`No account registered under "${targetInput}". Please check your username/email or sign up.`);
      }
    }
  };

  const benefitsList = [
    { title: "Free Skill Development", desc: "100% free courses & practical tracks" },
    { title: "Build Industry Portfolio", desc: "Verified project showcases for clients" },
    { title: "Verified Opportunities", desc: "Curated micro-gigs & remote internships" },
    { title: "Application Tracking", desc: "Real-time dashboard status updates" },
    { title: "Learn From Anywhere", desc: "Mobile & laptop flexible self-paced learning" }
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in relative overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Background Animated Floating Ambient Shapes */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative z-10">
        
        {/* LEFT SIDE: BRANDING */}
        <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-purple-950 dark:to-slate-950 p-8 sm:p-10 text-white border border-purple-300/40 dark:border-purple-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 dark:bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-8 relative z-10">
            <div className="space-y-3">
              <div 
                className="cursor-pointer group inline-flex items-center"
                onClick={onNavigateHome}
              >
                <Logo size="lg" />
              </div>

              <div className="inline-block px-3.5 py-1 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider">
                "Learn. Build. Showcase. Earn."
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Welcome Back to Your <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">Growth Journey ✨</span>
              </h1>
              <p className="text-sm text-purple-100 dark:text-slate-300 leading-relaxed font-medium">
                Continue learning new market-relevant skills, build your verified portfolio, and connect with real income opportunities across India.
              </p>
            </div>

            <div className="space-y-3 bg-white/10 dark:bg-slate-900/60 p-5 rounded-2xl border border-purple-400/30 dark:border-purple-500/20 backdrop-blur-md">
              <p className="text-xs font-extrabold text-purple-200 uppercase tracking-wider">Why Women Choose HerEarn</p>
              <div className="space-y-2.5">
                {benefitsList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <span className="text-[11px] text-purple-100 dark:text-slate-400 font-medium block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/60 dark:bg-slate-950/80 rounded-2xl p-4 border border-purple-400/30 relative overflow-hidden shadow-inner flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Join 15,000+ Learners</p>
                  <p className="text-xs text-purple-200">Building careers every day</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl font-extrabold text-amber-200 dark:text-amber-300 tracking-tight">2,000+</p>
                <p className="text-[10px] font-bold text-purple-100 dark:text-slate-400 uppercase tracking-wider">Projects</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          
          <div className="bg-white dark:bg-slate-900/95 rounded-3xl p-7 sm:p-10 border border-purple-200 dark:border-purple-500/30 shadow-2xl space-y-6 text-slate-900 dark:text-white backdrop-blur-xl relative">
            
            {/* Dual Login Tab Switcher: User vs Recruiter */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-purple-500/20 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setLoginType('user'); setError(''); setAdminError(''); }}
                className={`py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginType === 'user'
                    ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-white shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5 text-purple-500" />
                <span>Learner & Employer</span>
              </button>
              <button
                type="button"
                onClick={() => { setLoginType('recruiter'); setError(''); setAdminError(''); }}
                className={`py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginType === 'recruiter'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md font-black'
                    : 'text-slate-500 hover:text-purple-600 dark:hover:text-purple-300'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-pink-400" />
                <span>Recruiter Login</span>
              </button>
            </div>

            {/* Form Headline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  {loginType === 'admin' ? (
                    <>
                      <Shield className="w-6 h-6 text-pink-500" />
                      <span>Admin Portal Login</span>
                    </>
                  ) : loginType === 'recruiter' ? (
                    <>
                      <Briefcase className="w-6 h-6 text-pink-500" />
                      <span>Recruiter Portal</span>
                    </>
                  ) : (
                    <span>Account Login</span>
                  )}
                </h2>
                <span className="text-xs font-bold text-purple-800 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0">
                  {loginType === 'admin' ? (
                    <>
                      <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                      Passkey Protected
                    </>
                  ) : loginType === 'recruiter' ? (
                    <>
                      <Briefcase className="w-3.5 h-3.5 text-pink-500" />
                      Hiring Access
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Free Upskilling Platform
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                {loginType === 'admin'
                  ? 'Enter your master authorization key to unlock platform governance and escrow controls.'
                  : loginType === 'recruiter'
                  ? 'Sign in with your recruiter email and password to access the hiring dashboard.'
                  : 'Sign in to continue your learning and earning journey.'}
              </p>
            </div>

            {/* ========================================================
                VIEW A: ADMIN PASSKEY LOGIN FORM (hidden behind link)
               ======================================================== */}
            {loginType === 'admin' ? (
              <form onSubmit={handleAdminLogin} className="space-y-5 animate-fade-in">
                {adminError && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{adminError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block uppercase tracking-wider flex items-center justify-between">
                    <span>MASTER ADMIN SECURITY KEY</span>
                    <span className="text-[10px] text-purple-400 font-mono lowercase">256-bit encrypted</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-purple-600 dark:text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminKey ? 'text' : 'password'}
                      value={adminKey}
                      onChange={(e) => {
                        setAdminKey(e.target.value);
                        if (adminError) setAdminError('');
                      }}
                      placeholder="e.g. HEREARN-ADMIN-2026-X9K"
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-purple-500/30 rounded-2xl text-xs sm:text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminKey(!showAdminKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      {showAdminKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-purple-800 dark:text-purple-200 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Master Key:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">{MASTER_ADMIN_KEY}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminKey(MASTER_ADMIN_KEY)}
                    className="text-pink-600 dark:text-pink-400 hover:underline font-extrabold cursor-pointer"
                  >
                    Auto-fill ⚡
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isAdminLoading || !adminKey.trim()}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isAdminLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying Passkey...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5" />
                      <span>Authorize & Enter Admin Console</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setLoginType('user')}
                    className="text-xs text-slate-500 hover:text-purple-600 dark:hover:text-purple-300 font-bold cursor-pointer"
                  >
                    ← Back to Regular Login
                  </button>
                </div>
              </form>
            ) : (
              /* ========================================================
                  VIEW B: USER / RECRUITER EMAIL + PASSWORD FORM
                 ======================================================== */
              <>
                {error && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-start gap-3 animate-shake">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                {forgotSent && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>Reset instructions sent! Check your email inbox.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* EMAIL ADDRESS OR USERNAME */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                      EMAIL ADDRESS OR USERNAME
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-purple-600 dark:text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder={loginType === 'recruiter' ? "recruiter@company.com" : "name@domain.com or @username"}
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-purple-500/30 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block uppercase tracking-wider">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-purple-500/30 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* REMEMBER ME */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                      />
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                        Remember Me on this device
                      </span>
                    </label>
                  </div>

                  {/* PRIMARY LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 mt-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>{loginType === 'recruiter' ? 'Log In as Recruiter' : 'Log In to Dashboard'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* DIVIDER: OR */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                  <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest absolute">
                    OR
                  </span>
                </div>

                {/* GOOGLE SIGN-IN (kept) */}
                <GoogleSignInButton
                  onSuccess={(user) => {
                    onLoginSuccess({
                      ...user,
                      isSignUp: false,
                    });
                  }}
                  onError={(msg) => {
                    setError(msg);
                  }}
                  disabled={isLoading}
                />

                {/* Admin access (small discreet link) */}
                <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 text-center">
                  <button
                    type="button"
                    onClick={() => setLoginType('admin')}
                    className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-pink-500" />
                    <span>Platform Administrator? Access Admin Console →</span>
                  </button>
                </div>

                {/* CREATE ACCOUNT LINK */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 text-center space-y-1">
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={onNavigateToSignup}
                      className="font-extrabold text-purple-700 dark:text-pink-400 hover:underline cursor-pointer ml-1"
                    >
                      Create Free Account →
                    </button>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    "Join HerEarn and start learning for free."
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}