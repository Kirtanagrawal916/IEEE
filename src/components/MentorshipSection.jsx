import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Star, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Search, 
  Filter, 
  Send, 
  ExternalLink, 
  ChevronRight, 
  X, 
  BookOpen, 
  Briefcase, 
  Clock, 
  Globe, 
  MapPin, 
  ArrowRight, 
  Share2, 
  Laptop, 
  UserCheck, 
  Plus, 
  Check, 
  Info,
  RotateCcw,
  Mic,
  MicOff,
  Paperclip,
  Video,
  FileText,
  Copy,
  Image as ImageIcon
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';
import { api } from '../services/api';

export default function MentorshipSection({ user, showToast }) {
  // Active navigation tab: 'mentors' | 'masterclasses' | 'my-bookings'
  const [activeTab, setActiveTab] = useState('mentors');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');

  // Booked sessions state (persisted)
  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('herearn_mentorship_bookings') || '[]');
    } catch {
      return [];
    }
  });

  // Masterclass RSVPs state
  const [rsvps, setRsvps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('herearn_masterclass_rsvps') || '[]');
    } catch {
      return [];
    }
  });

  // Interactive Booking Modal State
  const [bookingModalMentor, setBookingModalMentor] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('Portfolio & Resume Review');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Success Confirmation Modal
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Active Mentor Chat Modal ({ mentor, booking })
  const [activeChatMentor, setActiveChatMentor] = useState(null);

  // Volunteer Mentor Application Modal
  const [showApplyMentorModal, setShowApplyMentorModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', expertise: '', experience: '', linkedin: '' });
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Synchronize legacy booked IDs for backward compatibility
  const bookedMentorIds = useMemo(() => bookings.map(b => b.mentorId), [bookings]);

  // Mentor Directory Data (Curated high-caliber female tech & design mentors across India)
  const mentors = [
    {
      id: 'm1',
      name: 'Ananya Sharma',
      role: 'Senior Product Marketer',
      company: 'TechCorp India',
      experience: '8+ Years',
      domain: 'Digital Marketing',
      languages: ['English', 'Hindi'],
      skills: ['Social Media Ads', 'Brand Growth', 'SEO Strategy', 'Content Funnels'],
      rating: 4.95,
      reviewsCount: 54,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      availabilitySlots: ['Wed 6:00 PM IST', 'Sat 11:30 AM IST', 'Sun 4:00 PM IST'],
      bio: 'Helping women creators and learners transition into remote digital marketing, run profitable ad campaigns, and secure high-paying freelance retainers.',
      badge: 'Top Rated Mentor',
      nextSlot: 'Wed, 6:00 PM',
      sessionDuration: '35 mins'
    },
    {
      id: 'm2',
      name: 'Pooja Verma',
      role: 'Lead Brand & Visual Designer',
      company: 'Studio Astra',
      experience: '6+ Years',
      domain: 'UI/UX & Canva Design',
      languages: ['English', 'Hindi', 'Gujarati'],
      skills: ['Canva Pro', 'Figma', 'Visual Branding', 'Packaging Mockups'],
      rating: 5.0,
      reviewsCount: 68,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      availabilitySlots: ['Tue 5:00 PM IST', 'Thu 5:00 PM IST', 'Sat 2:00 PM IST'],
      bio: 'Specialized in turning Canva enthusiasts into professional brand identity designers. I review project portfolios and help members quote client fees with confidence.',
      badge: 'Design Specialist',
      nextSlot: 'Tomorrow, 5:00 PM',
      sessionDuration: '30 mins'
    },
    {
      id: 'm3',
      name: 'Ritu Mukherji',
      role: 'E-Commerce Growth Strategist',
      company: 'Shopify Partner Lead',
      experience: '7+ Years',
      domain: 'E-Commerce & Shopify',
      languages: ['English', 'Bengali', 'Hindi'],
      skills: ['Shopify Storefronts', 'Catalog Management', 'Razorpay Setup', 'Conversion Rate'],
      rating: 4.88,
      reviewsCount: 41,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
      availabilitySlots: ['Mon 7:00 PM IST', 'Fri 6:30 PM IST', 'Sat 6:00 PM IST'],
      bio: 'Guiding women founders and freelance managers on setting up online boutiques, importing catalogs, and automating WhatsApp customer support.',
      badge: 'E-Commerce Mentor',
      nextSlot: 'Fri, 6:30 PM',
      sessionDuration: '40 mins'
    },
    {
      id: 'm4',
      name: 'Sunita Nair',
      role: 'Career Re-entry Coach & Ex-HR Lead',
      company: 'PathForward Talent',
      experience: '12+ Years',
      domain: 'Career Restart & Confidence',
      languages: ['English', 'Hindi', 'Malayalam'],
      skills: ['Career Gap Strategy', 'Interview Preparation', 'LinkedIn Optimization', 'Salary Negotiation'],
      rating: 4.98,
      reviewsCount: 89,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      availabilitySlots: ['Thu 4:00 PM IST', 'Sat 10:00 AM IST', 'Sun 11:30 AM IST'],
      bio: 'Dedicated to helping stay-at-home mothers and women with 2–10 year career breaks rebuild unshakeable confidence, translate life skills to resumes, and land remote roles.',
      badge: 'Career Restart Icon',
      nextSlot: 'Sat, 10:00 AM',
      sessionDuration: '45 mins'
    },
    {
      id: 'm5',
      name: 'Dr. Meenakshi Sundaram',
      role: 'Senior Full-Stack Architect',
      company: 'OpenCraft Labs',
      experience: '10+ Years',
      domain: 'Freelance & Web Development',
      languages: ['English', 'Tamil', 'Hindi'],
      skills: ['React & Next.js', 'API Integration', 'GitHub Workflows', 'Client Estimates'],
      rating: 4.92,
      reviewsCount: 37,
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300',
      availabilitySlots: ['Wed 7:30 PM IST', 'Sat 4:00 PM IST', 'Sun 6:00 PM IST'],
      bio: 'Mentoring aspiring female developers to build clean web applications, showcase verifiable GitHub portfolio links, and crack global remote freelance contracts.',
      badge: 'Tech & Code Leader',
      nextSlot: 'Wed, 7:30 PM',
      sessionDuration: '40 mins'
    },
    {
      id: 'm6',
      name: 'Divya Chawla',
      role: 'Freelance Upwork Top Rated Plus',
      company: 'Independent Copywriter',
      experience: '5+ Years',
      domain: 'Freelance & Client Proposals',
      languages: ['English', 'Punjabi', 'Hindi'],
      skills: ['Upwork Proposals', 'Email Sequences', 'Client Contracts', 'USD Invoicing'],
      rating: 4.97,
      reviewsCount: 62,
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300',
      availabilitySlots: ['Tue 6:00 PM IST', 'Thu 6:00 PM IST', 'Sat 5:00 PM IST'],
      bio: 'Earned over $45,000 working remotely from Chandigarh. I teach learners how to craft winning proposals that get replies from international clients in 48 hours.',
      badge: 'Upwork Expert',
      nextSlot: 'Thu, 6:00 PM',
      sessionDuration: '30 mins'
    }
  ];

  // Masterclasses Data
  const masterclasses = [
    {
      id: 'mc1',
      title: 'Canva to Cash: How to Package & Sell Brand Kits for ₹5,000+ Each',
      host: 'Pooja Verma',
      hostRole: 'Lead Brand Designer @ Studio Astra',
      date: 'Saturday, 25 Oct',
      time: '5:00 PM - 6:30 PM IST',
      attendeesCount: 342,
      maxSeats: 500,
      tags: ['Canva Design', 'Client Pitching', 'Live Demo'],
      banner: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=800',
      description: 'Watch Pooja build a complete corporate brand kit from scratch in Canva Pro, including color tokens, typography, and downloadable client guidelines that businesses pay for.'
    },
    {
      id: 'mc2',
      title: 'Winning ₹15,000+ Monthly Retainers as a Home Creator or Student',
      host: 'Ananya Sharma',
      hostRole: 'Senior Marketer @ TechCorp',
      date: 'Sunday, 26 Oct',
      time: '4:00 PM - 5:30 PM IST',
      attendeesCount: 518,
      maxSeats: 600,
      tags: ['Social Media', 'Freelance Retainers', 'Contract Templates'],
      banner: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
      description: 'The exact step-by-step outreach system to sign local clinics, boutiques, and bakeries on recurring monthly social media maintenance retainers.'
    },
    {
      id: 'mc3',
      title: 'Returning to Tech & Design After a 5-Year Career Break: The Exact Roadmap',
      host: 'Sunita Nair',
      hostRole: 'Career Re-entry Coach (Ex-HR Lead)',
      date: 'Next Saturday, 1 Nov',
      time: '6:00 PM - 7:30 PM IST',
      attendeesCount: 295,
      maxSeats: 400,
      tags: ['Career Break', 'Resume Audit', 'Confidence Building'],
      banner: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      description: 'How to position childcare, relocation, or eldercare breaks as strengths on your LinkedIn, craft a modern project portfolio, and handle salary questions without panic.'
    }
  ];

  // Mentee Success Stories
  const successStories = [
    {
      mentee: 'Sneha Kulkarni',
      location: 'Pune, Maharashtra',
      mentorName: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      outcome: 'Closed ₹12,000/month Social Media Retainer',
      quote: 'I was hesitant to pitch clients because I had never worked in an office. In one 30-minute session, Ananya revamped my proposal pitch. Two weeks later, a local dental clinic signed me!'
    },
    {
      mentee: 'Priya Sundaram',
      location: 'Chennai, Tamil Nadu',
      mentorName: 'Pooja Verma',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      outcome: 'Landed First 3 Canva Brand Identity Gigs',
      quote: 'Pooja pointed out exactly how to organize my Canva portfolio so clients see real business value. Having a female mentor who understood my family commitments made all the difference.'
    },
    {
      mentee: 'Meenakshi Iyer',
      location: 'Bengaluru, Karnataka',
      mentorName: 'Sunita Nair',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      outcome: 'Restarted After 6-Year Parenting Gap',
      quote: 'I felt outdated after 6 years away from work. Sunita helped me map my organizational skills to remote project management. I am now working 20 hours a week from home with total flexibility.'
    }
  ];

  // Domains for filtering
  const domains = [
    'All',
    'Digital Marketing',
    'UI/UX & Canva Design',
    'E-Commerce & Shopify',
    'Career Restart & Confidence',
    'Freelance & Client Proposals'
  ];

  // Filtered Mentors list
  const filteredMentors = useMemo(() => {
    return mentors.filter(m => {
      const matchesDomain = selectedDomain === 'All' || m.domain === selectedDomain;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        m.name.toLowerCase().includes(q) || 
        m.role.toLowerCase().includes(q) || 
        m.skills.some(s => s.toLowerCase().includes(q)) ||
        m.bio.toLowerCase().includes(q);
      return matchesDomain && matchesSearch;
    });
  }, [mentors, selectedDomain, searchQuery]);

  // Open booking modal
  const openBookingModal = (mentor) => {
    setBookingModalMentor(mentor);
    setSelectedSlot(mentor.availabilitySlots[0] || 'Wed 6:00 PM IST');
    setSelectedTopic('Portfolio & Resume Review');
    setBookingNotes('');
  };

  // Confirm meeting assignment handler
  const handleConfirmBooking = () => {
    if (!bookingModalMentor || !selectedSlot) return;

    setIsSubmittingBooking(true);

    const bookingId = `book-${Date.now()}`;

    const newBooking = {
      id: bookingId,
      mentorId: bookingModalMentor.id,
      mentorName: bookingModalMentor.name,
      mentorRole: bookingModalMentor.role,
      mentorAvatar: bookingModalMentor.avatar,
      slot: selectedSlot,
      topic: selectedTopic,
      notes: bookingNotes,
      duration: bookingModalMentor.sessionDuration,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings.filter(b => b.mentorId !== bookingModalMentor.id)];
    setBookings(updated);

    try {
      localStorage.setItem('herearn_mentorship_bookings', JSON.stringify(updated));
      localStorage.setItem('herearn_booked_mentorships', JSON.stringify(updated.map(b => b.mentorId)));
    } catch (e) {
      console.warn('[Mentorship] Storage error:', e);
    }

    setTimeout(() => {
      setIsSubmittingBooking(false);
      setBookingModalMentor(null);
      setConfirmedBooking(newBooking);
      triggerCelebrationConfetti();
      if (showToast) {
        showToast("🎉 Meeting Assigned!", `Session assigned with ${bookingModalMentor.name} for ${selectedSlot}. Direct chat is now unlocked!`);
      }
    }, 400);
  };

  // Cancel booking
  const handleCancelBooking = (bookingId, mentorName) => {
    const updated = bookings.filter(b => b.id !== bookingId);
    setBookings(updated);
    try {
      localStorage.setItem('herearn_mentorship_bookings', JSON.stringify(updated));
      localStorage.setItem('herearn_booked_mentorships', JSON.stringify(updated.map(b => b.mentorId)));
    } catch (e) {
      console.warn('[Mentorship] Storage error:', e);
    }
    if (showToast) {
      showToast("Meeting Cancelled", `Assigned meeting with ${mentorName} has been cancelled.`);
    }
  };

  // RSVP Masterclass
  const handleToggleRsvp = (masterclass) => {
    const isRsvped = rsvps.includes(masterclass.id);
    const updated = isRsvped ? rsvps.filter(id => id !== masterclass.id) : [...rsvps, masterclass.id];
    setRsvps(updated);
    try {
      localStorage.setItem('herearn_masterclass_rsvps', JSON.stringify(updated));
    } catch {}

    if (showToast) {
      if (isRsvped) {
        showToast("RSVP Cancelled", `You have cancelled your seat for "${masterclass.title}".`);
      } else {
        triggerCelebrationConfetti();
        showToast("🎟️ Seat Reserved!", `Your free pass for "${masterclass.title}" is confirmed. Check email for details.`);
      }
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (booking) => {
    const title = encodeURIComponent(`HerEarn Mentorship Session: ${booking.mentorName} & You`);
    const details = encodeURIComponent(`HerEarn Mentorship Session.\nMentor: ${booking.mentorName}\nTopic: ${booking.topic}\nDuration: ${booking.duration}\nChat with your mentor directly on the HerEarn platform!`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
  };

  // Handle Mentor Application
  const handleApplyMentor = (e) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.email) return;
    setApplySubmitted(true);
    triggerCelebrationConfetti();
    if (showToast) {
      showToast("✨ Application Received!", "Thank you for volunteering. Our mentorship coordinator will reach out in 48 hours.");
    }
    setTimeout(() => {
      setShowApplyMentorModal(false);
      setApplySubmitted(false);
      setApplyForm({ name: '', email: '', expertise: '', experience: '', linkedin: '' });
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF9F5] dark:bg-[#0F0918] text-[#1F2937] dark:text-white transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-10 space-y-8 animate-fade-in">
      
      {/* ========================================================
          1. HERO HEADER BANNER (Glassmorphism & Gradients)
         ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 p-6 sm:p-10 border border-purple-500/30 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>100% Free Peer & Leadership Network</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Connect & Chat Directly With <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300">Women Leaders in Tech & Business</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Schedule meetings with verified female leaders across India. Unlock direct 1:1 mentor chat for tailored feedback on your portfolio, freelance proposal reviews, and career restart strategies.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1:1 Mentor Chat Unlocked</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Career Break Friendly</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-purple-300" />
                <span>100% Free Mentorship</span>
              </div>
            </div>
          </div>

          {/* Quick Action Card on Banner */}
          <div className="w-full lg:w-auto bg-white/10 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-purple-500/30 text-xs shrink-0 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">Safe Community Guarantee</p>
                <p className="text-purple-200 text-[11px]">Strictly verified women mentors</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-center">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-lg font-black text-white">850+</p>
                <p className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">Mentorship Sessions</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-lg font-black text-pink-300">4.9 ★</p>
                <p className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">Average Rating</p>
              </div>
            </div>

            <button
              onClick={() => setShowApplyMentorModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-purple-400/30"
            >
              <Heart className="w-3.5 h-3.5 text-pink-300" />
              <span>Apply to Volunteer as a Mentor</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. NAVIGATION TABS (Mentors vs Masterclasses vs Bookings)
         ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-200 dark:border-purple-900/40 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'mentors'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 border border-purple-100 dark:border-purple-900/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Strategy Mentors ({mentors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('masterclasses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'masterclasses'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 border border-purple-100 dark:border-purple-900/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>Live Group Masterclasses ({masterclasses.length})</span>
            <span className="px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-500 text-[10px] font-extrabold uppercase">Free</span>
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'my-bookings'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 border border-purple-100 dark:border-purple-900/30'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>My Scheduled Mentorships ({bookings.length})</span>
            {bookings.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold">
                {bookings.length} Active
              </span>
            )}
          </button>
        </div>

        {activeTab === 'mentors' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by mentor, skill, or role..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          3. TAB 1: 1-ON-1 MENTORS DIRECTORY
         ======================================================== */}
      {activeTab === 'mentors' && (
        <div className="space-y-6">
          
          {/* Domain Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
            <span className="text-xs font-extrabold text-slate-400 shrink-0 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Domain:
            </span>
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  selectedDomain === d
                    ? 'bg-purple-900/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-400 dark:border-purple-400'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-purple-100 dark:border-purple-900/30'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Mentors Grid */}
          {filteredMentors.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-purple-200 dark:border-purple-500/30 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No mentors found matching your filter</h3>
              <p className="text-xs text-slate-500">Try clearing your search query or selecting "All" domains.</p>
              <button
                onClick={() => { setSelectedDomain('All'); setSearchQuery(''); }}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((m) => {
                const isBooked = bookedMentorIds.includes(m.id);
                const activeBooking = bookings.find(b => b.mentorId === m.id);

                return (
                  <div
                    key={m.id}
                    className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-5 shadow-lg flex flex-col justify-between hover:border-purple-500 hover:shadow-xl transition-all group relative"
                  >
                    <div className="space-y-4">
                      
                      {/* Top Header: Avatar + Badge + Rating */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="relative">
                            <img
                              src={m.avatar}
                              alt={m.name}
                              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-300 dark:border-purple-500/50 shadow-md group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Verified Available" />
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {m.name}
                              </h3>
                              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">{m.role}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{m.company}</p>
                          </div>
                        </div>

                        {/* Top Rated Chip */}
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-md border border-pink-200 dark:border-pink-800">
                            {m.badge}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-black">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{m.rating}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({m.reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio Quote */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-3">
                        "{m.bio}"
                      </p>

                      {/* Experience & Languages Pill Row */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-500" />
                          {m.experience}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-pink-500" />
                          {m.languages.join(', ')}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {m.sessionDuration} Free
                        </span>
                      </div>

                      {/* Skills Covered Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.skills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-lg border border-purple-200/60 dark:border-purple-800/60"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      {/* Next Slot Preview */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-950 dark:to-purple-950/30 border border-purple-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Next Slot:</span>
                        <span className="text-purple-700 dark:text-purple-300 font-extrabold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {m.nextSlot}
                        </span>
                      </div>

                    </div>

                    {/* Booking Trigger Button */}
                    <div className="pt-2">
                      {isBooked ? (
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center">
                            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Meeting Assigned ({activeBooking?.slot || m.nextSlot})</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveChatMentor({ mentor: m, booking: activeBooking })}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Chat with Mentor</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(activeBooking?.id, m.name)}
                              className="px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-100 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openBookingModal(m)}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-md shadow-purple-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Assign Meeting & Chat</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================
          4. TAB 2: LIVE GROUP MASTERCLASSES
         ======================================================== */}
      {activeTab === 'masterclasses' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/40 dark:to-indigo-950/40 rounded-3xl p-6 border border-purple-200 dark:border-purple-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Weekend Live Video Masterclasses</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Free interactive webinars with Q&A, live portfolio reviews, and downloadable templates.</p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 text-xs font-bold text-purple-700 dark:text-purple-300">
              🎟️ 100% Free Entry
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {masterclasses.map((mc) => {
              const isRsvped = rsvps.includes(mc.id);
              const spotsLeft = mc.maxSeats - mc.attendeesCount - (isRsvped ? 1 : 0);

              return (
                <div
                  key={mc.id}
                  className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-purple-500 transition-all"
                >
                  <div className="space-y-4">
                    <div className="relative h-44 overflow-hidden">
                      <img src={mc.banner} alt={mc.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-purple-900/80 text-white backdrop-blur-md text-[10px] font-black uppercase">
                        Live Webinar
                      </div>
                      <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        <span>{mc.date} • {mc.time}</span>
                      </div>
                    </div>

                    <div className="p-6 pt-0 space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {mc.tags.map((t, i) => (
                          <span key={i} className="text-[10px] font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                            {t}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                        {mc.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {mc.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white">{mc.host}</p>
                          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">{mc.hostRole}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 dark:text-white">{mc.attendeesCount + (isRsvped ? 1 : 0)} attending</p>
                          <p className="text-[10px] text-pink-600 dark:text-pink-400 font-bold">{spotsLeft} spots left</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleToggleRsvp(mc)}
                      className={`w-full py-3 rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isRsvped
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white'
                      }`}
                    >
                      {isRsvped ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Reserved! (Click to cancel RSVP)</span>
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4" />
                          <span>RSVP Free Seat Now</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          5. TAB 3: MY SCHEDULED MENTORSHIPS
         ======================================================== */}
      {activeTab === 'my-bookings' && (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-purple-200 dark:border-purple-500/30 space-y-4 max-w-xl mx-auto shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">No active mentorship meetings</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You haven't assigned any mentorship meetings yet. Schedule a session with any verified mentor to unlock direct 1:1 chat guidance.
              </p>
              <button
                onClick={() => setActiveTab('mentors')}
                className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-black text-xs shadow-md hover:bg-purple-700 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Browse Available Mentors</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-5 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img src={b.mentorAvatar} alt={b.mentorName} className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{b.mentorName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                            Assigned
                          </span>
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">{b.mentorRole}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelBooking(b.id, b.mentorName)}
                      className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Cancel this session"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 p-4 rounded-2xl bg-purple-50 dark:bg-slate-950 border border-purple-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Reserved Slot:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        {b.slot}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Topic:</span>
                      <span className="font-bold text-purple-700 dark:text-purple-300">{b.topic}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Session Duration:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{b.duration || '35 mins'}</span>
                    </div>
                    {b.notes && (
                      <div className="pt-2 border-t border-purple-200/50 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 italic">
                        Notes: "{b.notes}"
                      </div>
                    )}
                  </div>

                  {/* Actions: Chat with Mentor + Add to Calendar */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const m = mentors.find(item => item.id === b.mentorId) || {
                          id: b.mentorId,
                          name: b.mentorName,
                          role: b.mentorRole,
                          avatar: b.mentorAvatar,
                          sessionDuration: b.duration
                        };
                        setActiveChatMentor({ mentor: m, booking: b });
                      }}
                      className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat with Mentor</span>
                    </button>

                    <a
                      href={getGoogleCalendarUrl(b)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-purple-50 dark:hover:bg-slate-700 shadow-xs cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Calendar</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          6. MENTEE SUCCESS STORIES & TESTIMONIALS
         ======================================================== */}
      <div className="pt-8 border-t border-purple-200 dark:border-purple-900/40 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 text-xs font-black uppercase">
            <Heart className="w-3.5 h-3.5 fill-pink-500" />
            <span>Real Learner Transformations</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">How 1-on-1 Mentorship Changes Careers</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Read how member women turned personalized advice into verifiable client income.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((st, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={st.avatar} alt={st.mentee} className="w-12 h-12 rounded-2xl object-cover border border-purple-300 shadow-sm" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{st.mentee}</h4>
                    <p className="text-[11px] text-slate-500">{st.location}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-[11px] font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-pink-500" />
                  <span>{st.outcome}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic font-medium">
                  "{st.quote}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-400">
                Mentored by <strong className="text-slate-700 dark:text-slate-300">{st.mentorName}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          7. INTERACTIVE BOOKING MODAL
         ======================================================== */}
      {bookingModalMentor && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-scale-in text-slate-900 dark:text-white">
            
            <button
              onClick={() => setBookingModalMentor(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mentor Info Header */}
            <div className="flex items-center gap-4 border-b border-purple-100 dark:border-slate-800 pb-4">
              <img src={bookingModalMentor.avatar} alt={bookingModalMentor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400 shadow-md" />
              <div>
                <h3 className="text-lg font-black">{bookingModalMentor.name}</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">{bookingModalMentor.role}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span>★ {bookingModalMentor.rating}</span>
                  <span>•</span>
                  <span>{bookingModalMentor.sessionDuration} Mentorship & Chat</span>
                </div>
              </div>
            </div>

            {/* Step 1: Select Topic */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                <span>1. Select Primary Session Goal:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Portfolio & Resume Review',
                  'First Paid Client Strategy',
                  'Career Break Restart Advice',
                  'Proposals & Rate Negotiation'
                ].map(topic => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                      selectedTopic === topic
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-purple-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-purple-200 dark:border-slate-700 hover:border-purple-400'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Available Slot */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                <span>2. Choose Meeting Time:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {bookingModalMentor.availabilitySlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-2xl text-xs font-bold text-center transition-all border cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-purple-200 dark:border-slate-700 hover:border-purple-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                <span>3. What is your #1 question? (Optional):</span>
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="e.g., I have 3 Canva samples and want to know how much to charge local bakeries..."
                rows={2}
                className="w-full p-3 rounded-2xl bg-purple-50/40 dark:bg-slate-800/40 border border-purple-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 resize-none font-medium"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBookingModalMentor(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isSubmittingBooking}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-black text-xs shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all cursor-pointer flex items-center gap-2"
              >
                {isSubmittingBooking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Assigning Session...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Meeting & Unlock Chat</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          8. BOOKING CONFIRMED SUCCESS MODAL
         ======================================================== */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl animate-scale-in text-slate-900 dark:text-white">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black">Meeting Assigned & Chat Unlocked!</h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your meeting with <strong className="text-purple-600 dark:text-purple-400">{confirmedBooking.mentorName}</strong> is confirmed. You can now chat directly with your mentor to discuss your goals, share portfolio links, or ask questions!
            </p>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-slate-950 border border-purple-200 dark:border-slate-800 text-xs space-y-1">
              <p className="font-extrabold text-base text-slate-900 dark:text-white">{confirmedBooking.slot}</p>
              <p className="text-purple-600 dark:text-purple-400 font-bold">{confirmedBooking.topic}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1.5 mt-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>1:1 Mentor Chat is Now Open</span>
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const m = mentors.find(item => item.id === confirmedBooking.mentorId) || {
                    id: confirmedBooking.mentorId,
                    name: confirmedBooking.mentorName,
                    role: confirmedBooking.mentorRole,
                    avatar: confirmedBooking.mentorAvatar,
                    sessionDuration: confirmedBooking.duration
                  };
                  setActiveChatMentor({ mentor: m, booking: confirmedBooking });
                  setConfirmedBooking(null);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>💬 Chat with {confirmedBooking.mentorName.split(' ')[0]} Now</span>
              </button>

              <button
                type="button"
                onClick={() => { setConfirmedBooking(null); setActiveTab('my-bookings'); }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                View in "My Scheduled Mentorships"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          8b. DIRECT MENTOR CHAT MODAL
         ======================================================== */}
      {activeChatMentor && (
        <MentorChatModal
          mentor={activeChatMentor.mentor}
          booking={activeChatMentor.booking}
          user={user}
          onClose={() => setActiveChatMentor(null)}
          showToast={showToast}
        />
      )}

      {/* ========================================================
          9. VOLUNTEER AS A MENTOR MODAL
         ======================================================== */}
      {showApplyMentorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-scale-in text-slate-900 dark:text-white">
            <button
              onClick={() => setShowApplyMentorModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-pink-500" />
              </div>
              <div>
                <h3 className="text-xl font-black">Volunteer as a HerEarn Mentor</h3>
                <p className="text-xs text-slate-500">Give back just 1 hour a week to empower other women.</p>
              </div>
            </div>

            {applySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold">Thank You for Your Generosity!</h4>
                <p className="text-xs text-slate-500">Our team will review your details and connect with you on LinkedIn within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleApplyMentor} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applyForm.name}
                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                    placeholder="e.g. Shreya Mukherjee"
                    className="w-full mt-1 p-2.5 rounded-xl bg-purple-50/40 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full mt-1 p-2.5 rounded-xl bg-purple-50/40 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-300">Domain / Expertise *</label>
                    <input
                      type="text"
                      required
                      value={applyForm.expertise}
                      onChange={(e) => setApplyForm({ ...applyForm, expertise: e.target.value })}
                      placeholder="e.g. Canva & Visual Design"
                      className="w-full mt-1 p-2.5 rounded-xl bg-purple-50/40 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-300">Years of Experience</label>
                    <input
                      type="text"
                      value={applyForm.experience}
                      onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                      placeholder="e.g. 5+ Years"
                      className="w-full mt-1 p-2.5 rounded-xl bg-purple-50/40 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300">LinkedIn Profile Link</label>
                  <input
                    type="url"
                    value={applyForm.linkedin}
                    onChange={(e) => setApplyForm({ ...applyForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full mt-1 p-2.5 rounded-xl bg-purple-50/40 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowApplyMentorModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer"
                  >
                    Submit Volunteer Application
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

/**
 * Intelligent Client-Side Fallback for Mentor Chat
 * Ensures domain-aware, non-generic replies even if offline or if backend is unreachable.
 */
function getClientMentorReply(message, mentor, booking, user, options = {}) {
  const text = (message || '').toLowerCase().trim();
  const domain = (mentor?.domain || '').toLowerCase();
  const slot = booking?.slot || mentor?.nextSlot || 'our scheduled session';
  const topic = booking?.topic || 'Portfolio & Strategy';
  const hasImage = Boolean(options?.hasImageAttachment);
  const lang = options?.preferredLanguage || 'EN';

  // 0. Visual / Image Attachment Feedback
  if (hasImage) {
    if (lang === 'HI') {
      return `मैंने आपका अटैच किया हुआ डिज़ाइन/प्रोजेक्ट प्रीव्यू देखा! 
• **विज़ुअल बैलेंस (Visual Hierarchy):** मुख्य हेडिंग को सबटेक्स्ट से कम से कम 2.5x बड़ा रखें ताकि क्लाइंट का ध्यान सबसे पहले मुख्य मैसेज पर जाए।
• **कंट्रास्ट और मार्जिन:** कैनवस के किनारों पर कम से कम 24px की खाली जगह रखें और टेक्स्ट को बैकग्राउंड पर आसानी से पढ़ने योग्य बनाएं।
• **कॉल-टू-एक्शन (CTA):** बटन को ब्राइट एक्सेंट कलर दें ताकि यूज़र तुरंत एक्शन ले।
हमारे ${slot} के सेशन में हम इसे क्लाइंट-रेडी फ़ाइनल टच देंगे!`;
    }
    return `I can see your uploaded preview! Here are 3 immediate design feedback points based on industry standards:
• **Visual Hierarchy:** Ensure your primary heading is at least 2.5x larger than any subtext so the core value proposition is immediately visible.
• **Breathing Room & Contrast:** Maintain at least 24px of clear padding around all canvas edges. Check that text contrast pops cleanly against the background colors.
• **Call-To-Action (CTA):** Give your button or main link accent contrast (such as vibrant amber or brand purple) to guide the user's eye.
We will pull up this exact creative during our session on **${slot}** to polish it to client-ready standards!`;
  }

  // Hindi / Hinglish Response branch
  if (lang === 'HI') {
    if (text.includes('rate') || text.includes('price') || text.includes('charge') || text.includes('inr') || text.includes('rupee')) {
      return `भारत में फ्रीलांसिंग के लिए सही रेट तय करना बहुत जरूरी है:
• **कैनवा सोशल मीडिया स्टार्टर किट:** 12 पोस्ट्स + 4 स्टोरीज़ के लिए ₹5,000 – ₹9,000।
• **मंथली डिज़ाइन रिटेनर:** ₹12,000 – ₹20,000 प्रति माह।
• **शॉपिफ़ाई स्टोर सेटअप:** ₹10,000 – ₹22,000 बेसिक स्टोर के लिए।
कभी भी बिना 50% एडवांस या HerEarn Escrow के काम शुरू न करें। हमारे ${slot} के सेशन में हम आपकी कस्टमाइज्ड प्राइसिंग शीट बनाएंगे!`;
    }
    if (text.includes('portfolio') || text.includes('review') || text.includes('resume')) {
      return `मैं आपके पोर्टफोलियो को ज़रूर रिव्यू करूँगी! हमारे ${slot} के सेशन के लिए:
• 20 साधारण पोस्ट्स के बजाय केवल 3 बेहतरीन केस स्टडीज चुनें।
• हर प्रोजेक्ट के साथ क्लाइंट का उद्देश्य और आपका सॉल्यूशन 2 लाइनों में लिखें।
• अपना ड्राफ्ट लिंक यहाँ शेयर कर सकते हैं, मैं सेशन से पहले इसे देख लूँगी!`;
    }
    return `नमस्ते! ${mentor.name} के तौर पर मैं आपके '${topic}' सेशन (समय: ${slot}) के लिए तैयार हूँ। आप अपने प्रोजेक्ट, प्राइसिंग या क्लाइंट पिचिंग से जुड़ा कोई भी सवाल यहाँ बेझिझक पूछ सकते हैं!`;
  }

  // 1. Portfolio Review
  if (text.includes('portfolio') || text.includes('review') || text.includes('resume') || text.includes('cv') || text.includes('github') || text.includes('behance') || text.includes('draft') || text.includes('sample')) {
    if (domain.includes('design') || domain.includes('canva') || domain.includes('ui')) {
      return `I would love to review your design work! For our meeting on ${slot}, please prepare:
• 3 curated case studies (e.g. 1 brand identity kit, 1 high-converting Instagram carousel, and 1 client mockup).
• A brief note explaining the client's goal and your design rationale.
• You can paste your Canva view-only or Behance link right here in our chat, and I'll inspect it before our ${topic} session!`;
    }
    if (domain.includes('marketing')) {
      return `Reviewing marketing campaigns is my specialty! Before our call on ${slot}:
• Gather 2 or 3 snapshots showing your ad creative, audience targeting logic, and metrics (like CTR, CPC, or simulated ROAS).
• Summarize the core problem you solved for the brand in 2 sentences.
• Feel free to share your Google Docs or slide deck link right here anytime!`;
    }
    if (domain.includes('shopify') || domain.includes('commerce')) {
      return `Yes, reviewing your store build or catalog structure is key! For our session on ${slot}:
• Have your Shopify store preview link ready (including password if unpublished).
• Test your mobile navigation, banner contrast, and checkout badges (COD / Razorpay).
• Drop the link here so I can give it a preliminary look before we connect!`;
    }
    if (domain.includes('code') || domain.includes('tech') || domain.includes('web')) {
      return `Absolutely! For developer portfolios, here is my golden rule:
• Make sure your GitHub repos have a clear README with a live deployment link (Vercel/Netlify), tech stack badges, and screenshots.
• Highlight 2 clean, production-grade projects rather than tutorial clones.
• Drop your GitHub profile or live project link right here, and I'll inspect the code structure before our session on ${slot}!`;
    }
    return `I will gladly review your portfolio! Please share the link or summary points here. For our session on ${slot}, have your 2 best project samples ready so we can optimize them for paying clients and higher rates!`;
  }

  // 2. Pricing & Rates in ₹ INR
  if (text.includes('rate') || text.includes('price') || text.includes('charge') || text.includes('fee') || text.includes('cost') || text.includes('how much') || text.includes('quote') || text.includes('retainer') || text.includes('rupee') || text.includes('inr')) {
    if (domain.includes('design') || domain.includes('canva') || domain.includes('ui')) {
      return `Pricing is where many freelance designers leave money on the table. Here are the realistic rates I recommend in India:
• **Starter Social Media Kit:** ₹5,000 – ₹9,000 for 12 branded Canva posts + 4 story templates.
• **Monthly Design Retainer:** ₹12,000 – ₹20,000/month for ongoing social graphics and promotional banners.
• **Complete Brand Identity Kit:** ₹15,000 – ₹30,000 including logo variations, color palette, typography guidelines, and mockups.
Never charge per hour for design—always charge per deliverable with 50% upfront via HerEarn Escrow. We will calibrate your custom pricing sheet during our session on ${slot}!`;
    }
    if (domain.includes('marketing')) {
      return `For digital marketing and ad management in India, here are standard freelance benchmarks:
• **Social Media Management:** ₹8,000 – ₹18,000/month per brand (content calendar + posting + basic engagement).
• **Performance Ad Setup (Meta/Google Ads):** ₹12,000 – ₹25,000/month retainer or a base fee of ₹10,000 + 10% of ad spend.
• **Lead Generation Campaign Audit:** ₹4,000 – ₹7,000 one-time fee.
During our ${topic} session on ${slot}, we will craft a tiered proposal template you can send to prospective clients!`;
    }
    if (domain.includes('shopify') || domain.includes('commerce')) {
      return `E-commerce clients have clear ROI expectations, so you can charge premium rates:
• **Single Product / Micro Shopify Store:** ₹10,000 – ₹18,000 for complete theme customization and payment gateway integration.
• **Catalog Setup & Multi-Collection Store:** ₹22,000 – ₹45,000 including 30 products, shipping zones, and WhatsApp checkout.
• **Monthly Store Maintenance & App Management:** ₹15,000/month retainer.
We will detail how to present this quote during our upcoming meeting!`;
    }
    if (domain.includes('code') || domain.includes('tech') || domain.includes('web')) {
      return `For web development projects in India and international remote gigs:
• **Landing Page (React / Tailwind):** ₹12,000 – ₹25,000 with mobile responsiveness and contact forms.
• **Full Multi-page Web App / MVP:** ₹35,000 – ₹80,000+ depending on database and API integrations.
• **Bug Fixing / Performance Optimization:** ₹3,500 – ₹8,000 per milestone.
Always use milestone-based contracts with HerEarn Escrow protection so you never have to chase payments.`;
    }
    return `In freelancing, pricing depends on perceived business value rather than hours spent. For beginners in India, aim for ₹6,000 – ₹15,000 per project or retainer. Always ask for 50% advance or Escrow funding. We will fine-tune your specific pricing during our meeting on ${slot}!`;
  }

  // 3. Client Acquisition & Pitching
  if (text.includes('client') || text.includes('pitch') || text.includes('proposal') || text.includes('find work') || text.includes('gig') || text.includes('cold') || text.includes('outreach') || text.includes('lead')) {
    return `Landing your first clients is all about a high-value, low-friction pitch! Here is my 3-step outreach framework:
1. **The Specific Audit:** Find a local brand or creator on Instagram or LinkedIn. Identify ONE specific thing they could improve (e.g. low-res post template, missing call-to-action, or slow mobile page).
2. **The Free Sample Hook:** Create a 1-slide mockup solving that exact problem and send a polite DM: "Hi [Name], I noticed your recent product launch and designed 2 alternative creative mockups to test CTR. Happy to share them if you'd like!"
3. **The Escrow Transition:** Once they reply with enthusiasm, offer a small paid starter package protected by HerEarn Escrow.
During our ${topic} session on ${slot}, I'll share exact cold DM templates that have worked for my mentees!`;
  }

  // 4. Career Gap & Confidence
  if (text.includes('gap') || text.includes('break') || text.includes('restart') || text.includes('motherhood') || text.includes('marriage') || text.includes('confidence') || text.includes('fear') || text.includes('scared') || text.includes('late')) {
    return `First, take a deep breath. A career break is never a barrier—it is simply a chapter of life.
Clients and modern remote employers do not judge how many years you took off; they care whether you can solve their problem today.
• **Reframe the narrative:** Never apologize for your gap. State: "I took intentional time for family responsibilities, and recently completed rigorous hands-on training in ${mentor?.domain || 'digital skills'} on HerEarn."
• **Let proof-of-work speak:** When you show 2 verified project case studies and verified client testimonials, your skill is unquestionable.
You have so much resilience and maturity to bring to the table. We will map out your confidence building strategy together on ${slot}!`;
  }

  // 5. Session Preparation / Agenda
  if (text.includes('session') || text.includes('meeting') || text.includes('slot') || text.includes('schedule') || text.includes('call') || text.includes('prep') || text.includes('agenda') || text.includes('ready') || text.includes('looking forward')) {
    return `I'm very much looking forward to our session as well! Our meeting is scheduled for **${slot}**, and our focus will be **"${topic}"**.
To get maximum value from our 1-on-1 time, please prepare:
1. **Your #1 Challenge:** The single biggest hurdle you want clarity on right now.
2. **Draft Work Links:** Any portfolio link, proposal draft, or profile you want me to inspect.
3. **Your 60-Day Income Goal:** E.g., securing your first ₹10,000 freelance retainer.
Feel free to drop any questions here beforehand so I can review them prior to our call!`;
  }

  // 6. Greetings
  if (text.match(/^(hi|hello|hey|good morning|good evening|good afternoon|namaste)\b/i)) {
    return `Hello! It's wonderful to connect with you. As your mentor for **${topic}**, I'm here to support your journey every step of the way. 
Our session is confirmed for **${slot}**. How is your learning progressing, and is there any particular challenge you'd like to brainstorm together right now?`;
  }

  // 7. General Contextual Fallback
  return `Thank you for sharing that question! As your mentor in ${mentor?.domain || 'this field'}, I want to make sure you have complete clarity.
The key next step is applying this directly to a concrete project sample that you can showcase to clients with confidence.
I have noted this question down for our upcoming session on **${slot}** focused on **"${topic}"**. Feel free to share any more context or drafts here in the meantime!`;
}

/**
 * Interactive Mentor Chat Window Modal
 * Allows user to chat 1-on-1 dynamically with their assigned mentor via AI & domain-aware NLP.
 * Features: Voice Mic Input, Image Attachments, Cal Sync, Video Room, Prep Sheet, and Language Switching.
 */
function MentorChatModal({ mentor, booking, user, onClose, showToast }) {
  const chatStorageKey = `herearn_mentor_chat_${mentor.id}`;

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(chatStorageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-init-1',
        sender: 'mentor',
        text: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm ${mentor.name}. Welcome to our 1-on-1 mentorship workspace. Our meeting is confirmed for ${booking?.slot || mentor.nextSlot || 'our scheduled time'} to focus on "${booking?.topic || 'Portfolio & Strategy'}". Feel free to share questions, attach design mockups, ask about freelance pricing in ₹ INR, or prepare for our call below!`,
        time: 'Just now'
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState('EN'); // 'EN' | 'HI' | 'Hinglish'
  const [showPrepSheet, setShowPrepSheet] = useState(false);
  const [previewZoomImage, setPreviewZoomImage] = useState(null);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(messages));
    } catch (e) {
      console.warn('Storage error:', e);
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatStorageKey]);

  // Handle Speech-to-Text Voice Input
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (showToast) showToast('Voice input is not supported in this browser.', 'warning');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = preferredLanguage === 'HI' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        if (showToast) showToast('Voice captured!', 'success');
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start error:', err);
      setIsListening(false);
    }
  };

  // Handle Image File Selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      if (showToast) showToast('Please select an image file under 6MB', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage({
        dataUrl: event.target.result,
        name: file.name
      });
      if (showToast) showToast(`Attached: ${file.name}`, 'info');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Google Calendar Link
  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`HerEarn Mentorship with ${mentor.name}: ${booking?.topic || 'Strategy'}`);
    const details = encodeURIComponent(`1-on-1 Mentorship session on HerEarn with ${mentor.name} (${mentor.role} at ${mentor.company}).\nFocus: ${booking?.topic || 'Portfolio & Strategy'}\nDuration: ${booking?.duration || mentor.sessionDuration || '35 mins'}`);
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=HerEarn+Online+Workspace`;
    window.open(calUrl, '_blank');
  };

  // Direct Video Room Link
  const handleJoinVideoRoom = () => {
    const safeTopic = (booking?.topic || 'Mentorship').replace(/[^a-zA-Z0-9]/g, '');
    const meetUrl = `https://meet.jit.si/HerEarn-${mentor.id}-${safeTopic}`;
    window.open(meetUrl, '_blank');
  };

  const handleClearChat = () => {
    const initMsg = [
      {
        id: `msg-init-${Date.now()}`,
        sender: 'mentor',
        text: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 Welcome back. Feel free to ask any questions ahead of our session on ${booking?.slot || mentor.nextSlot || 'our scheduled time'}!`,
        time: 'Just now'
      }
    ];
    setMessages(initMsg);
    setAttachedImage(null);
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(initMsg));
    } catch {}
    if (showToast) showToast('Chat history cleared', 'info');
  };

  const handleSend = async (textToSend = inputText) => {
    const trimmed = (typeof textToSend === 'string' ? textToSend : inputText).trim();
    if ((!trimmed && !attachedImage) || isTyping) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed || (attachedImage ? `[Attached creative draft: ${attachedImage.name}]` : ''),
      image: attachedImage?.dataUrl || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const sentImage = attachedImage;
    setAttachedImage(null);
    setInputText('');
    setIsTyping(true);

    const sessionId = `mentor_${mentor.id}_${user?.id || 'guest'}`;
    const mentorContext = {
      name: mentor.name,
      role: mentor.role,
      company: mentor.company,
      experience: mentor.experience,
      domain: mentor.domain,
      skills: mentor.skills,
      bio: mentor.bio,
      topic: booking?.topic || 'Mentorship Strategy',
      slot: booking?.slot || mentor.nextSlot || 'Scheduled Session',
      userName: user?.name || 'Learner',
      preferredLanguage,
      hasImageAttachment: Boolean(sentImage)
    };

    try {
      const res = await api.sendChatMessage(
        trimmed || 'Can you review this attached visual draft?', 
        sessionId, 
        mentorContext
      );
      if (res && res.reply) {
        const mentorMsg = {
          id: `msg-${Date.now() + 1}`,
          sender: 'mentor',
          text: res.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, mentorMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Backend chat API failed, using intelligent fallback:', err);
    }

    // Dynamic, domain-aware fallback if backend is unreachable
    setTimeout(() => {
      const replyText = getClientMentorReply(
        trimmed || 'Review my design draft', 
        mentor, 
        booking, 
        user, 
        { hasImageAttachment: Boolean(sentImage), preferredLanguage }
      );
      const mentorMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mentorMsg]);
      setIsTyping(false);
    }, 700);
  };

  const quickPrompts = useMemo(() => {
    const d = (mentor.domain || '').toLowerCase();
    if (d.includes('marketing')) {
      return [
        'How to improve ROAS on social media ads?',
        'What monthly retainer should I charge clients?',
        'Can you review my marketing proposal draft?',
        'How should I prepare for our scheduled session?'
      ];
    } else if (d.includes('design') || d.includes('canva') || d.includes('ui')) {
      return [
        'What rate should I charge for Canva brand kits?',
        'Can you review my design portfolio draft?',
        'How do I pitch local retail business clients?',
        'How should I prepare for our scheduled session?'
      ];
    } else if (d.includes('shopify') || d.includes('commerce')) {
      return [
        'How do I setup Razorpay & WhatsApp checkout?',
        'What should I charge to build a Shopify store?',
        'How do I optimize store conversion rates?',
        'How should I prepare for our scheduled session?'
      ];
    } else if (d.includes('career') || d.includes('confidence') || d.includes('restart')) {
      return [
        'How do I explain a 3-year career break?',
        'How can I optimize my LinkedIn for remote work?',
        'How do I build confidence for client calls?',
        'How should I prepare for our scheduled session?'
      ];
    } else if (d.includes('web') || d.includes('tech') || d.includes('code')) {
      return [
        'Can you review my GitHub project repo?',
        'Which tech stack is best for freelance web gigs?',
        'How do I estimate project milestones and pricing?',
        'How should I prepare for our scheduled session?'
      ];
    }
    return [
      'Can you review my portfolio draft?',
      'What rates should I charge as a beginner in INR?',
      'How do I pitch my first freelance client?',
      'How should I prepare for our scheduled session?'
    ];
  }, [mentor.domain]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="relative bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 rounded-3xl w-full max-w-2xl h-[92vh] sm:h-[700px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Session Prep Sheet Modal Overlay */}
        {showPrepSheet && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 flex flex-col justify-between animate-fade-in">
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-purple-200/40 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Session Preparation Checklist</h4>
                    <p className="text-[11px] text-purple-600 dark:text-purple-400">Tailored for your 1-on-1 with {mentor.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrepSheet(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-slate-700 dark:text-slate-200 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Topic:</span>
                  <span className="text-purple-700 dark:text-purple-300">{booking?.topic || 'Portfolio & Strategy'}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Scheduled Time:</span>
                  <span className="text-purple-700 dark:text-purple-300">{booking?.slot || mentor.nextSlot || 'Confirmed Slot'}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Mentor Domain:</span>
                  <span className="text-purple-700 dark:text-purple-300">{mentor.domain}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Action Items to Prepare:</h5>
                <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>1. Curate 2-3 Best Work Samples:</strong> Have live links (Canva, GitHub, Behance, Shopify preview) open in browser tabs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>2. Define Your Pricing Goal:</strong> Know your target monthly freelance income (e.g. ₹8,000–₹20,000/mo) to validate with {mentor.name.split(' ')[0]}.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>3. Pinpoint Your #1 Bottleneck:</strong> Whether client outreach, proposal pitching, or career gap confidence.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>4. Test Audio & Video:</strong> Ensure your mic and browser camera permissions are enabled for the video room.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const checklistText = `HerEarn Mentorship Prep with ${mentor.name}\nTopic: ${booking?.topic || 'Strategy'}\nSlot: ${booking?.slot || mentor.nextSlot}\n\nChecklist:\n1. Curate 2-3 best work samples.\n2. Target income goal defined.\n3. Pinpoint #1 question/bottleneck.\n4. Mic and video tested.`;
                  navigator.clipboard.writeText(checklistText);
                  if (showToast) showToast('Checklist copied to clipboard!', 'success');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Checklist</span>
              </button>
              <button
                type="button"
                onClick={handleAddToCalendar}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:opacity-95 transition-opacity"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Google Cal</span>
              </button>
            </div>
          </div>
        )}

        {/* Lightbox zoom modal for attached image */}
        {previewZoomImage && (
          <div 
            className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 cursor-pointer" 
            onClick={() => setPreviewZoomImage(null)}
          >
            <div className="relative max-w-2xl max-h-[90vh]">
              <img src={previewZoomImage} alt="Zoomed preview" className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/20" />
              <button
                type="button"
                onClick={() => setPreviewZoomImage(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center cursor-pointer border border-white/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Chat Header */}
        <div className="p-3.5 sm:p-5 border-b border-purple-100 dark:border-slate-800 bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative">
              <img src={mentor.avatar} alt={mentor.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border-2 border-purple-400 shadow-md" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">{mentor.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  Mentor
                </span>
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold truncate max-w-[140px] sm:max-w-none">{mentor.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-purple-100/70 dark:bg-slate-800 p-0.5 rounded-xl border border-purple-200 dark:border-slate-700 text-[10px] font-bold">
              {['EN', 'HI', 'Hinglish'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setPreferredLanguage(lang)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-lg cursor-pointer transition-all ${
                    preferredLanguage === lang
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-purple-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Prep Checklist Button */}
            <button
              type="button"
              onClick={() => setShowPrepSheet(true)}
              title="Session preparation checklist"
              className="h-8 px-2 sm:px-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prep Sheet</span>
            </button>

            {/* Reset Chat Button */}
            <button
              type="button"
              onClick={handleClearChat}
              title="Reset conversation"
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meeting Banner with Live Calendar & Video Room buttons */}
        <div className="px-3 sm:px-4 py-2 bg-purple-100/70 dark:bg-purple-950/50 border-b border-purple-200/50 dark:border-purple-800/30 flex flex-wrap items-center justify-between gap-2 text-xs text-purple-900 dark:text-purple-200">
          <div className="flex items-center gap-1.5 truncate max-w-[60%] sm:max-w-none">
            <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-medium truncate">
              Topic: <strong className="font-bold">{booking?.topic || 'General Strategy'}</strong> ({booking?.slot || mentor.nextSlot || 'Upcoming'})
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleAddToCalendar}
              title="Add session to Google Calendar"
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/90 dark:bg-slate-900 hover:bg-white text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
            >
              <Calendar className="w-3 h-3 text-purple-600" />
              <span>Cal Sync</span>
            </button>
            <button
              type="button"
              onClick={handleJoinVideoRoom}
              title="Open video meeting room"
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
            >
              <Video className="w-3 h-3" />
              <span>Video Room</span>
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <img src={mentor.avatar} alt={mentor.name} className="w-7 h-7 rounded-xl object-cover border border-purple-300 shrink-0 mb-1" />
                )}
                <div
                  className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                  }`}
                >
                  {/* Attached image preview inside chat message */}
                  {m.image && (
                    <div 
                      className="mb-2 rounded-xl overflow-hidden border border-white/20 shadow-xs cursor-pointer max-w-[220px]" 
                      onClick={() => setPreviewZoomImage(m.image)}
                    >
                      <img src={m.image} alt="Attached draft" className="w-full h-auto object-cover max-h-40 hover:scale-105 transition-transform" />
                      <span className="block bg-slate-900/80 text-[9px] text-white px-2 py-0.5 text-center font-bold">🔍 Click to zoom</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap font-medium">{m.text}</p>
                  <span className={`block text-[9px] mt-1.5 font-bold ${isUser ? 'text-purple-200 text-right' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
              <img src={mentor.avatar} alt={mentor.name} className="w-6 h-6 rounded-lg object-cover" />
              <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl border border-purple-100 dark:border-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1 font-medium">{mentor.name.split(' ')[0]} is typing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="px-3 sm:px-4 py-2 border-t border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Quick Ask:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 whitespace-nowrap cursor-pointer transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Attached image preview banner */}
        {attachedImage && (
          <div className="px-3 sm:px-4 py-2 border-t border-purple-100 dark:border-slate-800 bg-purple-50/80 dark:bg-slate-950 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
            <div className="flex items-center gap-2">
              <img src={attachedImage.dataUrl} alt="Thumbnail" className="w-8 h-8 rounded-lg object-cover border border-purple-300" />
              <div className="truncate max-w-[200px] sm:max-w-xs">
                <span className="font-bold text-xs truncate block">{attachedImage.name}</span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400">Ready for review</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-500 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-2.5 sm:p-4 border-t border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 sm:gap-2"
        >
          {/* File attachment hidden input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Canva creative, mockup, or image"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Speak your question (Hindi / English)"}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to voice...'
                : `Message ${mentor.name.split(' ')[0]} about goals, rates, or attach draft...`
            }
            className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim() && !attachedImage}
            className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
