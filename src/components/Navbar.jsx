import React from 'react';
import { Sparkles, BookOpen, Briefcase, User, Award, LogIn, Compass } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth }) {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Compass },
    { id: 'learn', label: 'Learn Skills', icon: BookOpen, badge: '5 Lessons' },
    { id: 'portfolio', label: 'Showcase', icon: Award, badge: 'Verified' },
    { id: 'gigs', label: 'Opportunity Board', icon: Briefcase, badge: '6 Gigs' },
    { id: 'profile', label: 'My Dashboard', icon: User }
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-pink-200 bg-clip-text text-transparent tracking-tight">
                NariShakti<span className="text-rose-400">Skills</span>
              </span>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Learn • Showcase • Earn
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile Pill / Auth Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <div 
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 border border-indigo-500/30 px-3.5 py-1.5 rounded-2xl cursor-pointer transition-all shadow-sm"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-400/80 shadow"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    {user.name}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  </p>
                  <p className="text-[11px] text-indigo-300 font-medium">
                    Earned: ₹{user.earnings.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="btn-primary text-sm py-2 px-4"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 py-2.5 px-2 fixed bottom-0 left-0 right-0 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
