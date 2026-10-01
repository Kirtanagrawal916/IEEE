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
import OpportunityDetailPage from './components/OpportunityDetailPage';
import OpportunityApplyPage from './components/OpportunityApplyPage';
import TrackDetailPage from './components/TrackDetailPage';
import LessonPlayerPage from './components/LessonPlayerPage';
import ApplicationsPage from './components/ApplicationsPage';
import PublicProfilePage from './components/PublicProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

import AuthModal from './components/AuthModal';
import SubmitProjectModal from './components/SubmitProjectModal';
import ApplyGigModal from './components/ApplyGigModal';
import LogoutModal from './components/LogoutModal';
import ToastNotification from './components/ToastNotification';
import ChatBot from './components/ChatBot';

import { 
  initialUser, 
  initialPortfolios, 
  initialOpportunities 
} from './data/mockData';

import { api } from './services/api';

export default function App() {
  // Navigation active tab: 'home' | 'about' | 'learn' | 'portfolio' | 'gigs' | 'profile' | 'login' | 'signup' | 'terms' | 'privacy' | 'opportunity_detail' | 'opportunity_apply'
  const [activeTab, setActiveTab] = useState('home');
  
  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('herearn_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('herearn_theme') || 'light';
  });

  // Modals & Active state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('herearn_theme', theme);
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

  const showToast = (title, message) => {
    setToast({ title, message });
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setActiveTab(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    saveUserData(null);
    setIsLogoutModalOpen(false);
    setActiveTab('home');
    showToast("Signed Out", "You have signed out of your account.");
  };

  const handleCompleteLesson = (lessonId) => {
    if (!user) {
      showToast("Guest Mode Alert 💡", "Create a free account to track course progress & save certificates!");
      return;
    }

    const currentCompleted = user.completedLessons || [];
    if (!currentCompleted.includes(lessonId)) {
      const updatedUser = {
        ...user,
        completedLessons: [...currentCompleted, lessonId],
      };
      saveUserData(updatedUser);
      showToast("Lesson Completed! 🎉", "Great job! Keep progressing to unlock capstone projects.");
    }
  };

  const handleSubmitProject = (projectData) => {
    const newProject = {
      id: `p-${Date.now()}`,
      title: projectData.title,
      authorName: user?.name || "Learner Creator",
      authorAvatar: user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      category: projectData.category || "Marketing",
      image: projectData.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
      description: projectData.description,
      likes: 0,
      tags: projectData.tags ? projectData.tags.split(',').map(t => t.trim()) : ["HerEarn"],
    };

    setPortfolios([newProject, ...portfolios]);
    showToast("Project Published! 🚀", "Your project is live in the community portfolio showcase.");
  };

  const handleOpenApplyGig = (gig) => {
    if (!user) {
      showToast("Sign In Required 🔒", "Please log in or continue to submit gig proposals.");
      handleOpenAuth('login');
      return;
    }
    setSelectedOpportunity(gig);
    setIsApplyOpen(true);
  };

  const handleViewOpportunityDetails = (gig) => {
    setSelectedOpportunity(gig);
    setActiveTab('opportunity_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      showToast("🚀 Application Sent!", "Application recorded with portfolio proof.");
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

      showToast("🚀 Application Sent!", "Client received your application with portfolio proof.");
    }
  };

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
    setActiveTab('profile');
    showToast(isNewSignUp ? "Account Created! 🎉" : "Welcome Back! ✨", `Signed in as ${loggedInUser.name}`);
  };

  const handleContinueAsGuest = () => {
    saveUserData(null);
    setActiveTab('profile');
    setIsAuthOpen(false);
    showToast("Guest Mode Active 👤", "Exploring HerEarn in Guest Mode.");
  };

  const handleUpdateUserSkills = (newSkills) => {
    const updatedUser = user ? { ...user, skills: newSkills } : {
      name: 'Guest Learner',
      isGuest: true,
      skills: newSkills
    };
    setUser(updatedUser);
    localStorage.setItem('herearn_user', JSON.stringify(updatedUser));
    showToast("🎯 Skills Updated!", `Skill profile updated (${newSkills.length} skills active). Opportunity match percentages updated.`);
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
        setActiveTab={setActiveTab}
        user={user}
        onLogout={() => setIsLogoutModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        onContinueAsGuest={handleContinueAsGuest}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingSection 
                onNavigate={(page) => navigate(`/${page}`)}
                onOpenAuth={() => handleOpenAuth('signup')}
                theme={theme}
              />
            } 
          />

          <Route 
            path="/about" 
            element={
              <AboutPage 
                onNavigate={(page) => navigate(`/${page}`)}
              />
            } 
          />

          <Route 
            path="/terms" 
            element={
              <TermsPage 
                onNavigate={(page) => navigate(`/${page}`)}
              />
            } 
          />

          <Route 
            path="/privacy" 
            element={
              <PrivacyPage 
                onNavigate={(page) => navigate(`/${page}`)}
              />
            } 
          />

          <Route 
            path="/learn" 
            element={
              <LearnSection 
                user={user}
                onCompleteLesson={handleCompleteLesson}
                onNavigateToPortfolio={() => {
                  navigate('/portfolio');
                  setIsSubmitOpen(true);
                }}
              />
            } 
          />

          <Route 
            path="/courses" 
            element={
              <LearnSection 
                user={user}
                onCompleteLesson={handleCompleteLesson}
                onNavigateToPortfolio={() => {
                  navigate('/portfolio');
                  setIsSubmitOpen(true);
                }}
              />
            } 
          />

          <Route 
            path="/courses/:trackId" 
            element={
              <TrackDetailPage 
                user={user}
                onCompleteLesson={handleCompleteLesson}
              />
            } 
          />

          <Route 
            path="/courses/:trackId/lessons/:lessonId" 
            element={
              <LessonPlayerPage 
                user={user}
                onCompleteLesson={handleCompleteLesson}
                showToast={showToast}
              />
            } 
          />

          <Route 
            path="/portfolio" 
            element={
              <PortfolioSection 
                portfolios={portfolios}
                user={user}
                onOpenSubmitModal={() => setIsSubmitOpen(true)}
                showToast={showToast}
              />
            } 
          />

          <Route 
            path="/profile/:userId" 
            element={<PublicProfilePage />} 
          />

          <Route 
            path="/opportunities" 
            element={
              <OpportunitiesSection 
                opportunities={opportunities}
                user={user}
                onApplyGig={handleOpenApplyGig}
                onViewDetails={handleViewOpportunityDetails}
                onUpdateUserSkills={handleUpdateUserSkills}
              />
            } 
          />

          <Route 
            path="/opportunities/:id" 
            element={
              <OpportunityDetailPage 
                gig={selectedOpportunity || opportunities[0]}
                user={user}
                onBack={() => navigate('/opportunities')}
                onApply={handleOpenApplyGig}
                onToggleSkill={handleUpdateUserSkills}
              />
            } 
          />

          <Route 
            path="/opportunities/:id/apply" 
            element={
              <ProtectedRoute user={user}>
                <OpportunityApplyPage 
                  gig={selectedOpportunity || opportunities[0]}
                  user={user}
                  userPortfolios={userPortfolios}
                  onBack={() => navigate(`/opportunities/${selectedOpportunity?.id || opportunities[0]?.id}`)}
                  onConfirmApplySuccess={(gigId, coverNote, portId, quizSummary) => handleConfirmApply(gigId, coverNote, portId, quizSummary)}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/applications" 
            element={
              <ProtectedRoute user={user}>
                <ApplicationsPage user={user} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard 
                  user={user}
                  onOpenSubmitModal={() => setIsSubmitOpen(true)}
                  onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute user={user}>
                <ProfileSection 
                  user={user}
                  userPortfolios={userPortfolios}
                  userAppliedGigs={userAppliedGigs}
                  onOpenAuth={handleOpenAuth}
                  onOpenSubmitModal={() => setIsSubmitOpen(true)}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateUserSkills={handleUpdateUserSkills}
                  onNavigate={(page) => navigate(`/${page}`)}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/login" 
            element={
              <LoginPage 
                onLoginSuccess={handleLoginSuccess}
                onContinueAsGuest={handleContinueAsGuest}
                onNavigateToSignup={() => navigate('/signup')}
                onNavigateHome={() => navigate('/')}
                onNavigate={(page) => navigate(`/${page}`)}
              />
            } 
          />

          <Route 
            path="/signup" 
            element={
              <SignupPage 
                onLoginSuccess={handleLoginSuccess}
                onContinueAsGuest={handleContinueAsGuest}
                onNavigateToLogin={() => navigate('/login')}
                onNavigateHome={() => navigate('/')}
              />
            } 
          />
        </Routes>
      </main>

      <SubmitProjectModal 
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitProject={handleSubmitProject}
      />

      <ApplyGigModal 
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        gig={selectedOpportunity}
        userPortfolios={userPortfolios}
        onConfirmApply={handleConfirmApply}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      <ToastNotification 
        toast={toast} 
        onClose={() => setToast(null)} 
      />

      {/* Floating AI Chatbot on every page */}
      <ChatBot />

    </div>
  );
}
