import React, { useState } from 'react';
import { skillTracks } from '../data/mockData';
import { 
  User, 
  Award, 
  BookOpen, 
  IndianRupee, 
  CheckCircle2, 
  Briefcase, 
  Edit3, 
  MapPin, 
  Sparkles,
  Plus,
  LogIn,
  UserPlus,
  Clock,
  TrendingUp,
  X,
  Upload,
  Search,
  FileText,
  Eye,
  ThumbsUp,
  Download,
  ChevronRight,
  Star,
  Zap,
  Check,
  BarChart3,
  ArrowUpRight,
  Trophy,
  Target,
  Activity,
  Flame,
  CheckCircle,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ProfileSection({ 
  user, 
  userPortfolios = [], 
  userAppliedGigs = [], 
  onOpenAuth, 
  onOpenSubmitModal,
  onUpdateProfile,
  onNavigate
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCertCourse, setSelectedCertCourse] = useState('Graphic Design with Canva');

  // Active user data or default guest user
  const currentUser = user || {
    id: "guest",
    name: "Guest Learner",
    title: "Explore Skills, Build Portfolio & Earn Income",
    location: "India",
    bio: "You are exploring in Guest Mode. Create an account or log in to customize your profile, complete skill tracks, publish portfolio projects, and apply for income opportunities.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    verified: false,
    skills: ["Digital Marketing", "Graphic Design", "Canva", "E-Commerce"],
    earnings: 0,
    completedLessons: [],
    appliedGigIds: []
  };

  // Edit profile local state
  const [editName, setEditName] = useState(currentUser.name);
  const [editTitle, setEditTitle] = useState(currentUser.title);
  const [editLocation, setEditLocation] = useState(currentUser.location);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName || 'My Profile',
      title: editTitle || 'Skill Learner',
      location: editLocation || 'India',
      bio: editBio || 'Learning skills & building portfolio on HerEarn.',
      avatar: editAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    });
    setIsEditOpen(false);
  };

  const completedCount = currentUser.completedLessons ? currentUser.completedLessons.length : 0;
  const appliedCount = userAppliedGigs ? userAppliedGigs.length : 0;

  // --- TOP METRIC STATS DATA ---
  const statsCards = [
    {
      id: "stat-1",
      title: "Lessons Mastered",
      value: `${completedCount}`,
      subtext: completedCount > 0 ? `${completedCount} Lessons Completed` : "No lessons completed yet",
      icon: BookOpen,
      gradient: "from-purple-500/15 via-indigo-500/10 to-purple-600/20 dark:from-purple-600/30 dark:via-indigo-600/20 dark:to-purple-900/40",
      borderColor: "border-purple-300 dark:border-purple-500/40",
      textColor: "text-purple-700 dark:text-purple-400",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300"
    },
    {
      id: "stat-2",
      title: "Completed Tracks",
      value: completedCount >= 3 ? "1" : "0",
      subtext: completedCount >= 3 ? "Certificate Unlocked" : "In Progress",
      icon: CheckCircle2,
      gradient: "from-emerald-500/15 via-teal-500/10 to-emerald-600/20 dark:from-emerald-600/30 dark:via-teal-600/20 dark:to-emerald-900/40",
      borderColor: "border-emerald-300 dark:border-emerald-500/40",
      textColor: "text-emerald-700 dark:text-emerald-400",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
    },
    {
      id: "stat-3",
      title: "Applied Micro Gigs",
      value: `${appliedCount}`,
      subtext: appliedCount > 0 ? `${appliedCount} Active Applications` : "0 Gigs Applied",
      icon: Briefcase,
      gradient: "from-amber-500/15 via-orange-500/10 to-amber-600/20 dark:from-amber-600/30 dark:via-orange-600/20 dark:to-amber-900/40",
      borderColor: "border-amber-300 dark:border-amber-500/40",
      textColor: "text-amber-700 dark:text-amber-400",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
    },
    {
      id: "stat-4",
      title: "Portfolio Projects",
      value: `${userPortfolios.length}`,
      subtext: userPortfolios.length > 0 ? `${userPortfolios.length} Published Proofs` : "No projects published",
      icon: Eye,
      gradient: "from-blue-500/15 via-cyan-500/10 to-blue-600/20 dark:from-blue-600/30 dark:via-cyan-600/20 dark:to-blue-900/40",
      borderColor: "border-blue-300 dark:border-blue-500/40",
      textColor: "text-blue-700 dark:text-blue-400",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
    },
    {
      id: "stat-5",
      title: "Total Earnings",
      value: `₹${(currentUser.earnings || 0).toLocaleString()}`,
      subtext: user ? "Verified Payout Balance" : "Login to view balance",
      icon: IndianRupee,
      gradient: "from-pink-500/15 via-rose-500/10 to-pink-600/20 dark:from-pink-600/30 dark:via-rose-600/20 dark:to-pink-900/40",
      borderColor: "border-pink-300 dark:border-pink-500/40",
      textColor: "text-pink-700 dark:text-pink-400",
      badgeColor: "bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300"
    }
  ];

  // --- DYNAMIC LEARNING PROGRESS COURSES ---
  const userCompletedLessons = currentUser.completedLessons || [];

  const enrolledCourses = skillTracks.map(track => {
    const trackLessons = track.lessons || [];
    const lessonsDone = trackLessons.filter(l => userCompletedLessons.includes(l.id)).length;
    const totalLessons = trackLessons.length;
    const progress = totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0;
    
    const nextUncompleted = trackLessons.find(l => !userCompletedLessons.includes(l.id));
    let nextLesson = "Track Mastered - Download Certificate";
    if (nextUncompleted) {
      nextLesson = nextUncompleted.title;
    } else if (lessonsDone === 0) {
      nextLesson = "Start Lesson 1";
    }

    return {
      id: track.id,
      title: track.title,
      category: track.category,
      progress,
      lessonsDone,
      totalLessons,
      instructor: track.instructor ? track.instructor.split('(')[0].trim() : "Lead Instructor",
      nextLesson
    };
  });

  // --- DYNAMIC ACTIVE GIGS LIST ---
  const activeGigsList = userAppliedGigs.map(gig => ({
    id: gig.id,
    title: gig.title,
    company: gig.company,
    category: gig.category,
    budget: gig.stipend,
    status: "Applied",
    statusColor: "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30",
    deadline: gig.deadline || "Active"
  }));

  // --- DYNAMIC PORTFOLIO SHOWCASE DATA ---
  const displayedPortfolios = userPortfolios;

  // --- DYNAMIC EARNINGS TRANSACTIONS ---
  const recentTransactions = (currentUser.earnings && currentUser.earnings > 0)
    ? [
        { id: "t1", title: "Micro-Gig Milestone Payout", client: "Verified Client Escrow", amount: `+₹${currentUser.earnings.toLocaleString()}`, date: "Recent", status: "Completed" }
      ]
    : [];

  // --- RECOMMENDED COURSES ---
  const recommendedCourses = [
    {
      id: "rc1",
      title: "Meta Ads & Local Business Growth",
      category: "Marketing",
      level: "Intermediate",
      duration: "3.5 Hours",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "rc2",
      title: "UI/UX Design Fundamentals for Beginners",
      category: "Design",
      level: "Beginner",
      duration: "4.0 Hours",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "rc3",
      title: "Freelance Pitching & Client Relations",
      category: "Business",
      level: "All Levels",
      duration: "2.0 Hours",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
    }
  ];

  // --- DYNAMIC ACHIEVEMENTS BADGES ---
  const achievementsList = [
    { 
      id: "b1", 
      title: "First Lesson Mastered", 
      icon: Trophy, 
      unlocked: completedCount > 0, 
      desc: completedCount > 0 ? `${completedCount} Lessons Mastered` : "Complete your first lesson to unlock", 
      badgeBg: completedCount > 0 ? "bg-amber-50 dark:bg-slate-800/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/40" : "bg-slate-100 dark:bg-slate-800/30 text-slate-400 border-slate-200 dark:border-slate-700/40 opacity-60" 
    },
    { 
      id: "b2", 
      title: "Track Mastered", 
      icon: Award, 
      unlocked: completedCount >= 3, 
      desc: completedCount >= 3 ? "Skill Track Certificate Unlocked" : "Complete capstone track to unlock", 
      badgeBg: completedCount >= 3 ? "bg-purple-50 dark:bg-slate-800/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/40" : "bg-slate-100 dark:bg-slate-800/30 text-slate-400 border-slate-200 dark:border-slate-700/40 opacity-60" 
    },
    { 
      id: "b3", 
      title: "Portfolio Creator", 
      icon: Sparkles, 
      unlocked: userPortfolios.length > 0, 
      desc: userPortfolios.length > 0 ? `${userPortfolios.length} Showcase Project Published` : "Upload capstone project to unlock", 
      badgeBg: userPortfolios.length > 0 ? "bg-pink-50 dark:bg-slate-800/60 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-500/40" : "bg-slate-100 dark:bg-slate-800/30 text-slate-400 border-slate-200 dark:border-slate-700/40 opacity-60" 
    },
    { 
      id: "b4", 
      title: "Gig Applicant", 
      icon: Zap, 
      unlocked: userAppliedGigs.length > 0, 
      desc: userAppliedGigs.length > 0 ? `${userAppliedGigs.length} Active Application` : "Apply for micro-gigs to unlock", 
      badgeBg: userAppliedGigs.length > 0 ? "bg-emerald-50 dark:bg-slate-800/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/40" : "bg-slate-100 dark:bg-slate-800/30 text-slate-400 border-slate-200 dark:border-slate-700/40 opacity-60" 
    }
  ];

  // --- DYNAMIC ACTIVITY TIMELINE ---
  const activityTimelineData = [
    ...(completedCount > 0 ? [{ id: "act-1", action: "Lesson Completed", detail: `${completedCount} skill lesson(s) mastered on HerEarn`, time: "Recent", icon: BookOpen, color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/30" }] : []),
    ...(userPortfolios.length > 0 ? [{ id: "act-2", action: "Portfolio Published", detail: `Published '${userPortfolios[0].title}' project`, time: "Recent", icon: Upload, color: "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-500/20 border-pink-300 dark:border-pink-500/30" }] : []),
    ...(userAppliedGigs.length > 0 ? [{ id: "act-3", action: "Micro-Gig Applied", detail: `Submitted application for '${userAppliedGigs[0].title}'`, time: "Recent", icon: Briefcase, color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/30" }] : [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Top Banner Notice for Guests */}
      {!user && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 border border-purple-500/40 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-2.5 rounded-xl bg-purple-500/30 text-amber-300 border border-purple-400/40 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Exploring as Guest Learner</h4>
              <p className="text-xs text-purple-200 mt-0.5">Sign up or login to save your custom learning track, earnings, and client applications.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAuth('signup')}
              className="btn-gradient-award text-xs py-2 px-4 font-bold cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Free Account</span>
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-outline-award text-xs py-2 px-4 font-bold cursor-pointer text-white border-white/30 hover:bg-white/10"
            >
              <LogIn className="w-3.5 h-3.5 text-purple-300" />
              <span>Login</span>
            </button>
          </div>
        </div>
      )}

      {/* --- HEADER PROFILE CARD --- */}
      <div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-pink-500/10 dark:bg-pink-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative group">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-purple-500 dark:border-purple-400/60 shadow-xl"
              />
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer border border-purple-300/40"
                title="Edit Profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentUser.name}
                </h1>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  user 
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40' 
                    : 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {user ? 'Verified Account' : 'Guest Mode'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-200 font-semibold">{currentUser.title}</p>
              
              <p className="text-xs text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
                {currentUser.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-700 dark:text-slate-300 font-bold pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> {currentUser.location}
                </span>
                <span>•</span>
                <span className="text-purple-700 dark:text-purple-300 font-bold">{currentUser.skills?.length || 4} Verified Skills</span>
              </div>
            </div>
          </div>

          {/* Quick Action Profile Edit & Earnings Badge */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-purple-200 dark:border-purple-500/20">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-purple-300 dark:border-purple-400/40 bg-purple-50 dark:bg-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-800/60 flex items-center gap-2 cursor-pointer transition-all text-purple-900 dark:text-white shadow-md"
            >
              <Edit3 className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              <span>Edit Profile Workspace</span>
            </button>

            <div className="bg-slate-50 dark:bg-slate-900/90 border border-emerald-300 dark:border-emerald-500/40 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-extrabold tracking-wider block">Verified Earnings</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">₹{(currentUser.earnings || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- QUICK ACTIONS PANEL --- */}
      <div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-5 backdrop-blur-md shadow-xl text-slate-900 dark:text-white space-y-3">
        <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-200">Quick Actions Workspace</h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Instant Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={onOpenSubmitModal}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-purple-900/60 dark:to-slate-900 border border-slate-200 dark:border-purple-500/30 hover:border-pink-500 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer transition-all hover:-translate-y-1 shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-600/30 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-white">Upload Portfolio</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('gigs')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-purple-900/60 dark:to-slate-900 border border-slate-200 dark:border-purple-500/30 hover:border-amber-500 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer transition-all hover:-translate-y-1 shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-600/30 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-white">Browse Micro-Gigs</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('learn')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-purple-900/60 dark:to-slate-900 border border-slate-200 dark:border-purple-500/30 hover:border-purple-500 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer transition-all hover:-translate-y-1 shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-600/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-white">Continue Course</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCertModalOpen(true)}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-purple-900/60 dark:to-slate-900 border border-slate-200 dark:border-purple-500/30 hover:border-emerald-500 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer transition-all hover:-translate-y-1 shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-600/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-white">Download Certificate</span>
          </button>
        </div>
      </div>

      {/* --- 1. TOP STATS SECTION --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Workspace Key Performance Metrics
          </h2>
          <span className="text-xs text-purple-800 dark:text-purple-300 font-bold bg-purple-100 dark:bg-purple-500/20 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/30">
            Real-time Analytics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statsCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div 
                key={card.id}
                className={`bg-white dark:bg-slate-900/80 backdrop-blur-md border ${card.borderColor} rounded-2xl p-4 space-y-3 shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-default`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${card.badgeColor} border ${card.borderColor} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                    Active
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">{card.title}</span>
                  <p className={`text-2xl font-black ${card.textColor} tracking-tight mt-0.5`}>{card.value}</p>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold border-t border-slate-200 dark:border-white/10 pt-2">
                  {card.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- GRID SPLIT: LEARNING PROGRESS & ACTIVE GIGS --- */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* --- 2. LEARNING PROGRESS SECTION (7 COLS) --- */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-500/20 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Enrolled Course Progress
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Continue your active learning tracks to unlock certificates & gigs</p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('learn')}
                className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-pink-600 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Courses</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-purple-500/20 rounded-2xl p-4 space-y-3 hover:border-purple-400 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-md border border-purple-300 dark:border-purple-500/30">
                          {course.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• Instructor: {course.instructor}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{course.title}</h4>
                    </div>

                    <span className="text-xs font-black text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-3 py-1 rounded-full border border-purple-300 dark:border-purple-500/30 self-start sm:self-center">
                      {course.progress}% Completed
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="progress-bar-bg h-2">
                      <div 
                        className="progress-bar-fill transition-all duration-700" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <span>{course.lessonsDone} of {course.totalLessons} lessons completed</span>
                      <span className="text-purple-700 dark:text-purple-300 font-semibold">{course.nextLesson}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('learn')}
                      className="btn-gradient-award text-xs py-2 px-4 font-bold cursor-pointer shadow-sm"
                    >
                      <span>{course.progress === 100 ? 'View Certificate' : 'Continue Learning'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3. ACTIVE GIGS SECTION (5 COLS) --- */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-500/20 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  Active Micro-Gigs & Applications
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Track your income opportunities</p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('gigs')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Find Gigs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {activeGigsList.length > 0 ? (
                activeGigsList.map((gig) => (
                  <div key={gig.id} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3 hover:border-amber-400 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{gig.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{gig.company}</p>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${gig.statusColor}`}>
                        {gig.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700/40">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {gig.budget}
                      </span>

                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('gigs')}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800/80 border border-purple-300 dark:border-purple-500/30 text-xs font-bold text-purple-900 dark:text-purple-200 cursor-pointer flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3 text-purple-600 dark:text-purple-300" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No Active Micro-Gigs Yet</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto font-medium">
                      Apply to verified client tasks on the Opportunity board to earn income.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('gigs')}
                    className="btn-gradient-award text-xs py-2 px-4 font-bold cursor-pointer shadow-sm inline-flex items-center gap-1.5"
                  >
                    <span>Explore Opportunity Board</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* --- 4. PORTFOLIO SHOWCASE SECTION --- */}
      <div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-xl text-slate-900 dark:text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 dark:border-purple-500/20 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              Verified Portfolio Showcase Cards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Demonstrate proof-of-work to potential clients and hiring businesses</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="btn-gradient-award text-xs py-2 px-4 font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Portfolio Card</span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPortfolios.length > 0 ? (
            displayedPortfolios.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-purple-500/20 rounded-2xl p-4 space-y-3 hover:border-pink-400 transition-all hover:-translate-y-1 group shadow-lg"
              >
                <div className="relative overflow-hidden rounded-xl h-40">
                  <img 
                    src={item.imageUrl || item.thumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-pink-300 border border-pink-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {item.category || item.skillTrack}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 font-medium">
                    {item.description || "Portfolio project built using verified practical skills on HerEarn."}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700/50 pt-3 font-semibold">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      {item.views || 1}
                    </span>
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {item.likes || 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenSubmitModal}
                    className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-500/40 text-[11px] font-bold text-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Portfolio</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-purple-500/20 rounded-2xl p-8 text-center space-y-3 col-span-full">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Portfolio Cards Uploaded Yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
                  Publish your capstone project proof to demonstrate practical skills to hiring clients.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenSubmitModal}
                className="btn-gradient-award text-xs py-2.5 px-5 font-bold cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Upload First Capstone Project</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- GRID SPLIT: EARNINGS DASHBOARD & ACHIEVEMENTS --- */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* --- 5. EARNINGS DASHBOARD (7 COLS) --- */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-6 backdrop-blur-md shadow-xl text-slate-900 dark:text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 dark:border-purple-500/20 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Earnings Analytics & Financial Growth
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Track your income stream and client payouts</p>
              </div>

              <div className="bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 self-start sm:self-auto">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{currentUser.earnings > 0 ? "+100% Payout" : "0% Income"}</span>
              </div>
            </div>

            {/* Mini Bar & Line Chart Representation */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-end text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider block">Total Balance</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{(currentUser.earnings || 0).toLocaleString()}</span>
                </div>
                <span className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Earnings History</span>
              </div>

              {/* Bar Visualizer */}
              <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200 dark:border-slate-700/50">
                {[
                  { month: 'Jan', val: '₹0', height: currentUser.earnings ? '20%' : '5%', bg: 'bg-purple-600/40' },
                  { month: 'Feb', val: '₹0', height: currentUser.earnings ? '30%' : '5%', bg: 'bg-purple-600/60' },
                  { month: 'Mar', val: '₹0', height: currentUser.earnings ? '45%' : '5%', bg: 'bg-pink-600/60' },
                  { month: 'Apr', val: '₹0', height: currentUser.earnings ? '60%' : '5%', bg: 'bg-purple-500' },
                  { month: 'May', val: '₹0', height: currentUser.earnings ? '80%' : '5%', bg: 'bg-pink-500' },
                  { month: 'Current', val: `₹${(currentUser.earnings || 0).toLocaleString()}`, height: currentUser.earnings ? '100%' : '5%', bg: 'bg-gradient-to-t from-purple-600 to-pink-500' }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.val}
                    </span>
                    <div 
                      className={`w-full rounded-t-lg ${item.bg} group-hover:brightness-125 transition-all`} 
                      style={{ height: item.height }}
                    ></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions List */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Recent Payout Transactions</h4>
              <div className="space-y-2">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <div key={tx.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 flex items-center justify-between text-xs">
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white">{tx.title}</h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{tx.client} • {tx.date}</p>
                      </div>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-500/30">
                        {tx.amount}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No payout transactions recorded yet.</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Complete client micro-gigs to receive verified direct earnings.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* --- 7. ACHIEVEMENTS SECTION (5 COLS) --- */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-500/20 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  Achievements & Badges
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Earn recognized credentials & rank up</p>
              </div>

              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-500/30">
                {achievementsList.filter(b => b.unlocked).length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {achievementsList.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div 
                    key={badge.id}
                    className={`border rounded-2xl p-4 space-y-2 text-left hover:scale-105 transition-all ${badge.badgeBg}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-purple-100 dark:bg-white/10">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-white/10">
                        Badge
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{badge.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-snug">{badge.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* --- 8. ACTIVITY TIMELINE --- */}
            <div className="pt-2 space-y-3 border-t border-purple-200 dark:border-purple-500/20">
              <h4 className="text-xs font-extrabold text-purple-800 dark:text-purple-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Recent Activity Timeline
              </h4>

              <div className="space-y-3 pl-2 border-l-2 border-purple-300 dark:border-purple-500/30">
                {activityTimelineData.length > 0 ? (
                  activityTimelineData.map((act) => {
                    const IconComp = act.icon;
                    return (
                      <div key={act.id} className="relative pl-4 space-y-0.5 group">
                        <div className={`absolute -left-[17px] top-0.5 p-1 rounded-full border ${act.color}`}>
                          <IconComp className="w-3 h-3" />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">{act.action}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{act.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{act.detail}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="pl-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    No recent activity yet. Master lessons, upload projects, or apply for gigs to build your timeline.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* --- 6. RECOMMENDED COURSES SECTION --- */}
      <div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-xl text-slate-900 dark:text-white">
        <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-500/20 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              Recommended Next Courses & Skills
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Curated learning paths tailored to your current skill profile</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('learn')}
            className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-pink-600 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Tracks</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((rc) => (
            <div 
              key={rc.id}
              className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-3 hover:border-purple-400 transition-all hover:-translate-y-1 group shadow-lg"
            >
              <div className="relative overflow-hidden rounded-xl h-36">
                <img 
                  src={rc.image} 
                  alt={rc.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                  <span className="bg-slate-950/90 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    {rc.level}
                  </span>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-slate-950/90 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {rc.rating}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-purple-700 dark:text-purple-400 uppercase font-extrabold tracking-wider">{rc.category}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">{rc.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Duration: {rc.duration}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/40">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('learn')}
                  className="w-full btn-gradient-award text-xs py-2.5 justify-center font-bold cursor-pointer"
                >
                  <span>Enroll in Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl relative space-y-4 text-xs">
            <button 
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-purple-200 dark:border-purple-500/20 pb-3">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Workspace Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title / Skill Role</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location (City, State)</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-semibold text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-semibold text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gradient-award justify-center py-3 font-bold mt-2 cursor-pointer text-xs"
              >
                Save Workspace Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- DOWNLOAD CERTIFICATE MODAL --- */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl max-w-lg w-full p-6 text-slate-900 dark:text-white shadow-2xl relative space-y-5 text-xs">
            <button 
              type="button"
              onClick={() => setIsCertModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-purple-200 dark:border-purple-500/20 pb-3">
              <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Verified Certificate Download</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Download high-resolution official PDF credential</p>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border-2 border-emerald-500/40 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden shadow-inner text-white">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-1">
                <Trophy className="w-8 h-8" />
              </div>
              <p className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-400">Certificate of Completion</p>
              <h4 className="text-xl font-black text-white">{currentUser.name}</h4>
              <p className="text-xs text-purple-200">has successfully mastered all capstone modules for</p>
              <p className="text-sm font-extrabold text-pink-300 border-y border-purple-500/30 py-2">
                {selectedCertCourse}
              </p>
              <p className="text-[10px] text-slate-400">Credential ID: HE-2026-CERT-8842 • Verified by HerEarn Foundation</p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">Select Completed Course Track:</label>
              <select 
                value={selectedCertCourse}
                onChange={(e) => setSelectedCertCourse(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
              >
                <option value="Graphic Design with Canva">Graphic Design with Canva (100% Completed)</option>
                <option value="Digital Marketing & Social Media">Digital Marketing & Social Media (75% Completed - Certificate Draft)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Certificate for "${selectedCertCourse}" downloaded successfully!`);
                  setIsCertModalOpen(false);
                }}
                className="flex-1 btn-gradient-award justify-center py-3 font-bold cursor-pointer text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
