import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingSection from './components/LandingSection';
import LearnSection from './components/LearnSection';
import PortfolioSection from './components/PortfolioSection';
import OpportunitiesSection from './components/OpportunitiesSection';
import Dashboard from './components/Dashboard';
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
import ChallengeDetailPage from './components/ChallengeDetailPage';
import SubmitProjectPage from './components/SubmitProjectPage';
import PortfolioDetailPage from './components/PortfolioDetailPage';
import PostGigPage from './components/PostGigPage';
import RecruiterDashboard from './components/RecruiterDashboard';

import LogoutModal from './components/LogoutModal';
import ToastNotification from './components/ToastNotification';
import ChatBot from './components/ChatBot';
import MentorshipSection from './components/MentorshipSection';
import CommunitySection from './components/CommunitySection';
import AdminPanel from './components/AdminPanel';
import Logo from './components/Logo';

import { 
  initialUser, 
  initialPortfolios, 
  initialOpportunities 
} from './data/mockData';

import { api } from './services/api';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Unified Auth state via AuthContext
  const { user, setUser, logout: authLogout } = useAuth();

  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('herearn_theme') || 'light';
  });

  // Modals & Navigation state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
    }
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
      // Asynchronously synchronize with backend database if logged in
      const token = localStorage.getItem('herearn_jwt_token');
      if (token && !userData.isGuest) {
        api.updateProfile({
          name: userData.name,
          username: userData.username,
          location: userData.location,
          bio: userData.bio,
          title: userData.title,
          avatar: userData.avatar,
          skills: userData.skills,
          skillPoints: userData.skillPoints,
          earnings: userData.earnings,
          totalEarned: userData.totalEarned,
          walletBalance: userData.walletBalance,
          completedLessons: userData.completedLessons,
          appliedGigIds: userData.appliedGigIds,
          badges: userData.badges,
        }).catch(err => {
          console.warn('[App] Background profile sync notice:', err?.message);
        });
      }
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
    navigate(mode === 'signup' ? '/signup' : '/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sign Out Handler
  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      if (authLogout) {
        await authLogout();
      } else {
        await api.logout();
      }
    } catch {
      // Ignore network errors
    }
    saveUserData(null);
    navigate('/');
    showToast("Signed Out 👋", "You have successfully logged out of HerEarn.");
  };

  // Profile Update Handler with API integration
  const handleUpdateProfile = async (profileData) => {
    try {
      const updatedUser = await api.updateProfile(profileData);
      const finalUser = updatedUser.user || updatedUser;
      setUser(finalUser);
      localStorage.setItem('herearn_user', JSON.stringify(finalUser));
      showToast("✨ Profile Updated!", "Your dashboard profile has been saved to the database.");
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
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
      await api.markLessonComplete(lessonId);
      const currentCompleted = user.completedLessons || [];
      const updatedLessons = currentCompleted.includes(lessonId)
        ? currentCompleted.filter(id => id !== lessonId)
        : [...currentCompleted, lessonId];

      saveUserData({
        ...user,
        completedLessons: updatedLessons,
      });

      showToast("🎉 Lesson Mastered!", "Your skill track progress has increased in database!");
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
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
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
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

  // View Opportunity Details in separate page
  const handleViewOpportunityDetails = (gig) => {
    setSelectedOpportunity(gig);
    navigate(`/opportunities/${gig.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Apply to Gig Trigger (Navigates to dedicated separate Opportunity Apply & Quiz page)
  const handleOpenApplyGig = (gig) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setSelectedOpportunity(gig);
    navigate(`/opportunities/${gig.id}/apply`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirm Gig Application Action with Quiz Assessment & API integration
  const handleConfirmApply = async (gigId, coverNote, portfolioId, quizSummary) => {
    try {
      await api.applyOpportunity(gigId, { coverNote, portfolioId, quizSummary });
      setOpportunities(opportunities.map(g => {
        if (g.id === gigId) {
          return {
            ...g,
            applied: true,
            applicantsCount: (g.applicantsCount || 0) + 1,
            quizScore: quizSummary ? quizSummary.percentage : null,
            eligible: quizSummary ? quizSummary.isEligible : true,
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

      if (quizSummary) {
        showToast(
          quizSummary.isEligible ? "🎉 Application & Quiz Passed!" : "Application Recorded", 
          quizSummary.isEligible ? `Eligible with ${quizSummary.percentage}% Quiz Score!` : `Quiz Score: ${quizSummary.percentage}%`
        );
      } else {
        showToast("🚀 Application Sent!", "Application recorded in database with portfolio proof.");
      }
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
      setOpportunities(opportunities.map(g => {
        if (g.id === gigId) {
          return {
            ...g,
            applied: true,
            applicantsCount: (g.applicantsCount || 0) + 1,
            quizScore: quizSummary ? quizSummary.percentage : null,
            eligible: quizSummary ? quizSummary.isEligible : true,
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

      if (quizSummary) {
        showToast(
          quizSummary.isEligible ? "🎉 Application & Quiz Passed!" : "Application Recorded", 
          quizSummary.isEligible ? `Eligible Candidate status verified (${quizSummary.percentage}% Quiz Score)!` : `Quiz score recorded (${quizSummary.percentage}%).`
        );
      } else {
        showToast("🚀 Application Sent!", "Client received your application with attached portfolio proof.");
      }
    }
  };

  // User Login Handler (Stores username & preserves persistent user account details)
  const handleLoginSuccess = (userData) => {
    const isNewSignUp = userData.isSignUp;
    const existingSaved = JSON.parse(localStorage.getItem('herearn_user') || 'null');
    const isSameUser = existingSaved && (
      existingSaved.id === userData.id ||
      existingSaved.email?.toLowerCase() === userData.email?.toLowerCase() ||
      existingSaved.username?.toLowerCase() === userData.username?.toLowerCase()
    );

    const rawUsername = (userData.username || (userData.name ? userData.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : userData.email?.split('@')[0]) || 'learner').replace(/^@/, '');
    const displayName = userData.name || (rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1));

    const loggedInUser = {
      id: userData.id || (isSameUser ? existingSaved.id : `u-${Date.now()}`),
      name: displayName,
      username: rawUsername,
      email: userData.email || `${rawUsername}@herearn.org`,
      role: (userData.role || (isSameUser ? existingSaved.role : 'LEARNER')).toUpperCase(),
      title: userData.title || (isSameUser ? existingSaved.title : `${userData.skillInterest || 'Digital Skill'} Specialist`),
      location: userData.location || (isSameUser ? existingSaved.location : 'India'),
      bio: userData.bio || (isSameUser ? existingSaved.bio : 'Passionate about building digital skills and delivering quality micro-gigs on HerEarn.'),
      avatar: userData.avatar || (isSameUser ? existingSaved.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rawUsername)}`),
      verified: true,
      skills: userData.skills || (isSameUser ? existingSaved.skills : [userData.skillInterest || "Digital Marketing", "Canva Design", "Instagram Management"]),
      totalEarned: userData.totalEarned !== undefined ? userData.totalEarned : (isSameUser ? existingSaved.totalEarned : (userData.earnings || 0)),
      earnings: userData.earnings !== undefined ? userData.earnings : (isSameUser ? existingSaved.earnings : (userData.totalEarned || 0)),
      walletBalance: userData.walletBalance !== undefined ? userData.walletBalance : (isSameUser ? existingSaved.walletBalance : (userData.totalEarned || 0)),
      completedLessons: userData.completedLessons || (isSameUser ? existingSaved.completedLessons : []),
      appliedGigIds: userData.appliedGigIds || (isSameUser ? existingSaved.appliedGigIds : []),
      skillPoints: userData.skillPoints !== undefined ? userData.skillPoints : (isSameUser ? existingSaved.skillPoints : 150),
      badges: userData.badges || (isSameUser ? existingSaved.badges : []),
    };

    saveUserData(loggedInUser);

    // Save/update in registered user registry for fast, permanent lookup by username
    try {
      const regUsers = JSON.parse(localStorage.getItem('herearn_registered_users') || '[]');
      const filtered = regUsers.filter(u => u.email?.toLowerCase() !== loggedInUser.email?.toLowerCase() && u.username?.toLowerCase() !== rawUsername.toLowerCase());
      const existingInReg = regUsers.find(u => u.email?.toLowerCase() === loggedInUser.email?.toLowerCase() || u.username?.toLowerCase() === rawUsername.toLowerCase());
      filtered.push({
        id: loggedInUser.id,
        name: loggedInUser.name,
        username: loggedInUser.username,
        email: loggedInUser.email,
        password: userData.password || existingInReg?.password,
        skills: loggedInUser.skills,
        skillPoints: loggedInUser.skillPoints,
        earnings: loggedInUser.earnings,
        totalEarned: loggedInUser.totalEarned,
        walletBalance: loggedInUser.walletBalance,
        completedLessons: loggedInUser.completedLessons,
        appliedGigIds: loggedInUser.appliedGigIds,
        badges: loggedInUser.badges,
      });
      localStorage.setItem('herearn_registered_users', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Could not sync registry:', e);
    }

    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      navigate(redirectUrl);
      } else if (loggedInUser.role === 'ADMIN') {
    navigate('/admin');
  } else if (loggedInUser.role === 'EMPLOYER') {
    navigate('/recruiter');
  } else {
    navigate('/dashboard');
  }
    showToast(isNewSignUp ? "Account Created! 🎉" : "Welcome Back! ✨", `Signed in as ${loggedInUser.name} (@${loggedInUser.username})`);
  };

  // Continue as Guest Handler
  const handleContinueAsGuest = () => {
    saveUserData(null);
    navigate('/dashboard');
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
      
      {/* Sticky Navigation Header (Hidden on Admin portal for dedicated admin console) */}
      {!isAdminRoute && (
        <Navbar 
          user={user}
          onLogout={() => setIsLogoutModalOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onUpdateUser={saveUserData}
          showToast={showToast}
        />
      )}

      {/* Main View Area with React Router Routes */}
      <main className={`flex-1 ${isAdminRoute ? 'pb-0' : 'pb-16'}`}>
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
            element={<TermsPage />} 
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
                onUpdateUserSkillPoints={(points, badge) => {
                  if (user) {
                    saveUserData({
                      ...user,
                      skillPoints: points,
                      badges: badge ? [...new Set([...(user.badges || []), badge])] : (user.badges || [])
                    });
                  }
                }}
                showToast={showToast}
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
                onUpdateUserSkillPoints={(points, badge) => {
                  if (user) {
                    saveUserData({
                      ...user,
                      skillPoints: points,
                      badges: badge ? [...new Set([...(user.badges || []), badge])] : (user.badges || [])
                    });
                  }
                }}
                showToast={showToast}
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
                onOpenSubmitModal={() => navigate('/portfolio/submit')}
                showToast={showToast}
              />
            } 
          />

          {/* Dedicated Full Page Challenge Routes (No Blur/Overlay) */}
          <Route 
            path="/challenges/:challengeId" 
            element={
              <ChallengeDetailPage 
                user={user} 
                onUpdateUserSkillPoints={(points, badge) => {
                  if (user) {
                    saveUserData({
                      ...user,
                      skillPoints: (user.skillPoints || 0) + points,
                      badges: [...(user.badges || []), badge]
                    });
                  }
                }}
                showToast={showToast} 
              />
            } 
          />
          <Route 
            path="/challenge/:challengeId" 
            element={
              <ChallengeDetailPage 
                user={user} 
                onUpdateUserSkillPoints={(points, badge) => {
                  if (user) {
                    saveUserData({
                      ...user,
                      skillPoints: (user.skillPoints || 0) + points,
                      badges: [...(user.badges || []), badge]
                    });
                  }
                }}
                showToast={showToast} 
              />
            } 
          />

          {/* Dedicated Full Page Submit Project Routes */}
          <Route 
            path="/portfolio/submit" 
            element={
              <SubmitProjectPage 
                user={user} 
                onSubmitProject={handleSubmitProject} 
                showToast={showToast} 
              />
            } 
          />
          <Route 
            path="/submit-project" 
            element={
              <SubmitProjectPage 
                user={user} 
                onSubmitProject={handleSubmitProject} 
                showToast={showToast} 
              />
            } 
          />

          {/* Dedicated Full Page Portfolio Detail View Route */}
          <Route 
            path="/portfolio/:id" 
            element={
              <PortfolioDetailPage 
                portfolios={portfolios} 
                user={user} 
                showToast={showToast} 
              />
            } 
          />

          {/* Dedicated Full Page Post Gig Routes */}
          <Route 
            path="/post-gig" 
            element={
              <PostGigPage 
                onAddOpportunity={(newOpp) => setOpportunities([newOpp, ...opportunities])} 
                showToast={showToast} 
              />
            } 
          />
          <Route 
            path="/opportunities/post" 
            element={
              <PostGigPage 
                onAddOpportunity={(newOpp) => setOpportunities([newOpp, ...opportunities])} 
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
                <ApplicationsPage 
                  user={user} 
                  onUpdateWallet={(updated) => saveUserData(updated)}
                  showToast={showToast}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard 
                  user={user}
                  onOpenSubmitModal={() => navigate('/portfolio/submit')}
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
                  onOpenSubmitModal={() => navigate('/portfolio/submit')}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateUserSkills={handleUpdateUserSkills}
                  onNavigate={(page) => navigate(`/${page}`)}
                  showToast={showToast}
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

          <Route 
            path="/mentorship" 
            element={
              <MentorshipSection showToast={showToast} />
            } 
          />

          <Route 
            path="/community" 
            element={
              <CommunitySection 
                user={user} 
                showToast={showToast} 
              />
            } 
          />

          <Route
  path="/recruiter/*"
  element={
    <ProtectedRoute user={user}>
      <RecruiterDashboard user={user} showToast={showToast} />
    </ProtectedRoute>
  }
/>

          <Route 
            path="/admin" 
            element={
              <AdminPanel 
                user={user}
                onLoginSuccess={handleLoginSuccess}
                opportunities={opportunities} 
                portfolios={portfolios} 
                setOpportunities={setOpportunities}
                setPortfolios={setPortfolios}
                showToast={showToast} 
              />
            } 
          />
        </Routes>
      </main>

      {/* Footer (Hidden on Admin portal) */}
      {!isAdminRoute && (
        <footer className={`border-t py-10 text-xs transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link to="/" className="cursor-pointer group shrink-0" title="HerEarn Home">
                <Logo size="sm" />
              </Link>
              <div className="text-center sm:text-left">
                <p className="font-bold text-xs">Skill-to-Income Platform for Women</p>
                <p className="opacity-75 text-[11px] mt-0.5">Empowering women across India to learn skills, build portfolios, and earn income.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 font-semibold">
              <Link to="/dashboard" className="hover:text-indigo-400 cursor-pointer">Dashboard</Link>
              <Link to="/" className="hover:text-indigo-400 cursor-pointer">Overview</Link>
              <Link to="/mentorship" className="hover:text-indigo-400 cursor-pointer text-indigo-400 font-bold">Mentorship</Link>
              <Link to="/about" className="hover:text-indigo-400 cursor-pointer text-purple-400 font-bold">About Us</Link>
              <Link to="/learn" className="hover:text-indigo-400 cursor-pointer">Courses</Link>
              <Link to="/portfolio" className="hover:text-indigo-400 cursor-pointer">Show Skill</Link>
              <Link to="/opportunities" className="hover:text-indigo-400 cursor-pointer">Opportunity</Link>
              <Link to="/post-gig" className="hover:text-pink-400 cursor-pointer font-bold text-pink-400">Post Gig</Link>
              <Link to="/admin" className="hover:text-purple-400 cursor-pointer font-bold text-purple-400">Admin</Link>
            </div>
          </div>
        </footer>
      )}

      {/* Confirmation Dialogs & Notifications */}
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

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
