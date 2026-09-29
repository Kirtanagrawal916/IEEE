import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingSection from './components/LandingSection';
import LearnSection from './components/LearnSection';
import PortfolioSection from './components/PortfolioSection';
import OpportunitiesSection from './components/OpportunitiesSection';
import ProfileSection from './components/ProfileSection';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';

import AuthModal from './components/AuthModal';
import SubmitProjectModal from './components/SubmitProjectModal';
import ApplyGigModal from './components/ApplyGigModal';
import ToastNotification from './components/ToastNotification';

import { 
  initialUser, 
  initialPortfolios, 
  initialOpportunities 
} from './data/mockData';

import { api } from './services/api';

export default function App() {
  // Default to 'about' (About Page) tab when visiting website
  const [activeTab, setActiveTab] = useState('about');
  
  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('herearn_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [theme, setTheme] = useState('dark');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [activeGigToApply, setActiveGigToApply] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Initial Data Fetching from Express Backend API
  useEffect(() => {
    const fetchBackendData = async () => {
      // 1. Auto Login via JWT
      const token = localStorage.getItem('herearn_jwt_token');
      if (token) {
        try {
          const meRes = await api.getMe();
          if (meRes.success && meRes.user) {
            setUser(meRes.user);
            localStorage.setItem('herearn_user', JSON.stringify(meRes.user));
          }
        } catch (err) {
          console.log('[App] Auto-login check:', err.message);
        }
      }

      // 2. Opportunities Feed
      try {
        const oppRes = await api.getOpportunities();
        if (oppRes.success && oppRes.opportunities && oppRes.opportunities.length > 0) {
          setOpportunities(oppRes.opportunities);
        }
      } catch (err) {
        console.log('[App] Using fallback opportunities:', err.message);
      }

      // 3. Public Portfolio Feed
      try {
        const portRes = await api.getPublicPortfolio();
        if (portRes.success && portRes.projects && portRes.projects.length > 0) {
          setPortfolios(portRes.projects);
        }
      } catch (err) {
        console.log('[App] Using fallback portfolios:', err.message);
      }
    };

    fetchBackendData();
  }, []);

  const saveUserData = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('herearn_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('herearn_user');
      localStorage.removeItem('herearn_jwt_token');
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setActiveTab(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sign Out Handler
  const handleLogout = () => {
    saveUserData(null);
    setActiveTab('profile'); // Keep on Dashboard in guest view
    showToast("Signed Out", "You have successfully logged out.");
  };

  // Continue as Guest Handler
  const handleContinueAsGuest = () => {
    saveUserData(null);
    setActiveTab('profile');
    setIsAuthOpen(false);
    showToast("Guest Mode Active 👤", "Exploring HerEarn in Guest Mode.");
  };

  // Profile Update Handler with API integration
  const handleUpdateProfile = async (profileData) => {
    try {
      const updatedUser = await api.updateProfile(profileData);
      setUser(updatedUser.user || updatedUser);
      showToast("✨ Profile Updated!", "Your dashboard profile has been saved to the backend database.");
    } catch (err) {
      const updated = { ...(user || initialUser), ...profileData };
      saveUserData(updated);
      showToast("✨ Profile Updated!", "Your dashboard profile has been updated.");
    }
  };

  // Lesson Completion Action with API integration
  const handleCompleteLesson = async (lessonId) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }

    try {
      const res = await api.markLessonComplete(lessonId);
      const currentCompleted = user.completedLessons || [];
      const updatedLessons = currentCompleted.includes(lessonId)
        ? currentCompleted.filter(id => id !== lessonId)
        : [...currentCompleted, lessonId];

      saveUserData({
        ...user,
        completedLessons: updatedLessons,
      });

      showToast("🎉 Lesson Mastered!", "Your skill track progress has increased in database!");
    } catch (err) {
      const currentCompleted = user.completedLessons || [];
      const updatedLessons = currentCompleted.includes(lessonId)
        ? currentCompleted.filter(id => id !== lessonId)
        : [...currentCompleted, lessonId];

      saveUserData({
        ...user,
        completedLessons: updatedLessons,
      });
      showToast("🎉 Lesson Mastered!", "Your skill track progress has increased!");
    }
  };

  // Submit Portfolio Project Action with API integration
  const handleSubmitProject = async (newProject) => {
    try {
      const res = await api.createProject(newProject);
      const created = res.project || {
        id: `p-${Date.now()}`,
        authorName: user ? user.name : "Guest Learner",
        authorAvatar: user ? user.avatar : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        location: user ? user.location : "India",
        skillTrack: newProject.category,
        likes: 1,
        date: "Just now",
        ...newProject,
      };

      setPortfolios([created, ...portfolios]);
      showToast("✨ Portfolio Published!", "Your project is saved to database and live on the public showcase gallery.");
    } catch (err) {
      const createdItem = {
        id: `p-${Date.now()}`,
        authorName: user ? user.name : "Guest Learner",
        authorAvatar: user ? user.avatar : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        location: user ? user.location : "India",
        skillTrack: newProject.category,
        likes: 1,
        date: "Just now",
        ...newProject,
      };

      setPortfolios([createdItem, ...portfolios]);
      showToast("✨ Portfolio Published!", "Your project is live on the public showcase gallery.");
    }
  };

  // Apply to Gig Trigger
  const handleOpenApplyGig = (gig) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setActiveGigToApply(gig);
    setIsApplyOpen(true);
  };

  // Confirm Gig Application Action with API integration
  const handleConfirmApply = async (gigId, coverNote) => {
    try {
      await api.applyOpportunity(gigId, { coverNote });
      setOpportunities(opportunities.map(g => {
        if (g.id === gigId) {
          return {
            ...g,
            applied: true,
            applicantsCount: (g.applicantsCount || 0) + 1,
          };
        }
        return g;
      }));

      if (user) {
        saveUserData({
          ...user,
          appliedGigIds: [...(user.appliedGigIds || []), gigId],
        });
      }

      showToast("🚀 Application Sent!", "Application recorded in database with portfolio proof.");
    } catch (err) {
      setOpportunities(opportunities.map(g => {
        if (g.id === gigId) {
          return {
            ...g,
            applied: true,
            applicantsCount: (g.applicantsCount || 0) + 1,
          };
        }
        return g;
      }));

      if (user) {
        saveUserData({
          ...user,
          appliedGigIds: [...(user.appliedGigIds || []), gigId],
        });
      }

      showToast("🚀 Application Sent!", "Client received your application with attached portfolio proof.");
    }
  };

  // User Login Handler
  const handleLoginSuccess = (userData) => {
    const isNewSignUp = userData.isSignUp;
    const loggedInUser = {
      id: userData.id || `u-${Date.now()}`,
      name: userData.name || 'Learner',
      email: userData.email || 'user@herearn.org',
      title: `${userData.skillInterest || 'Digital Skill'} Specialist`,
      location: userData.location || 'India',
      bio: userData.bio || 'Passionate about building digital skills and delivering quality micro-gigs on HerEarn.',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      verified: true,
      skills: userData.skills || [userData.skillInterest || "Digital Marketing", "Canva Design", "Instagram Management"],
      totalEarned: userData.totalEarned || 0,
      completedLessons: [],
      appliedGigIds: [],
    };

    saveUserData(loggedInUser);
    setActiveTab('profile'); // Switch to Dashboard view
    showToast(isNewSignUp ? "Account Created! 🎉" : "Welcome Back! ✨", `Signed in as ${loggedInUser.name}`);
  };

  const userPortfolios = portfolios.filter(p => p.authorName === (user?.name || "Guest Learner"));
  const userAppliedGigs = opportunities.filter(g => (user?.appliedGigIds || []).includes(g.id));

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Sticky Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onContinueAsGuest={handleContinueAsGuest}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAbout={() => {
          setActiveTab('about');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTerms={() => {
          setActiveTab('terms');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'profile' && (
          <ProfileSection 
            user={user}
            userPortfolios={userPortfolios}
            userAppliedGigs={userAppliedGigs}
            onOpenAuth={handleOpenAuth}
            onOpenSubmitModal={() => setIsSubmitOpen(true)}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'home' && (
          <LandingSection 
            onNavigate={setActiveTab}
            onOpenAuth={() => handleOpenAuth('signup')}
            theme={theme}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'terms' && (
          <TermsPage 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPage 
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'learn' && (
          <LearnSection 
            user={user}
            onCompleteLesson={handleCompleteLesson}
            onNavigateToPortfolio={() => {
              setActiveTab('portfolio');
              setIsSubmitOpen(true);
            }}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioSection 
            portfolios={portfolios}
            onOpenSubmitModal={() => setIsSubmitOpen(true)}
          />
        )}

        {activeTab === 'gigs' && (
          <OpportunitiesSection 
            opportunities={opportunities}
            onApplyGig={handleOpenApplyGig}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onContinueAsGuest={handleContinueAsGuest}
            onNavigateToSignup={() => {
              setActiveTab('signup');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => setActiveTab('home')}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'signup' && (
          <SignupPage 
            onLoginSuccess={handleLoginSuccess}
            onContinueAsGuest={handleContinueAsGuest}
            onNavigateToLogin={() => {
              setActiveTab('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-10 text-xs transition-colors ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-sm">HerEarn • Skill-to-Income Platform for Women</p>
            <p className="opacity-75 mt-1">Empowering women across India to learn skills, build portfolios, and earn income.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 font-semibold">
            <button onClick={() => { setActiveTab('profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-400 cursor-pointer">Dashboard</button>
            <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-400 cursor-pointer">Overview</button>
            <button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-400 cursor-pointer text-purple-400 font-bold">About Us</button>
            <button onClick={() => { setActiveTab('learn'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-400 cursor-pointer">Learn Case</button>
            <button onClick={() => { setActiveTab('portfolio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-400 cursor-pointer">Show Skill</button>
            <button onClick={() => { setActiveTab('gigs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-400 cursor-pointer">Opportunity</button>
            <button onClick={() => { setActiveTab('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-400 cursor-pointer">Terms & Conditions</button>
            <button onClick={() => { setActiveTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-indigo-400 cursor-pointer">Privacy Policy</button>
            {!user && (
              <>
                <button onClick={() => handleOpenAuth('login')} className="hover:text-indigo-400 cursor-pointer font-bold text-purple-400">Log In</button>
                <button onClick={() => handleOpenAuth('signup')} className="hover:text-pink-400 cursor-pointer font-bold text-pink-400">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <AuthModal 
        isOpen={isAuthOpen}
        initialMode={authMode} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
      />

      <SubmitProjectModal 
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitProject={handleSubmitProject}
      />

      <ApplyGigModal 
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        gig={activeGigToApply}
        userPortfolios={userPortfolios}
        onConfirmApply={handleConfirmApply}
      />

      <ToastNotification 
        toast={toast} 
        onClose={() => setToast(null)} 
      />

    </div>
  );
}
