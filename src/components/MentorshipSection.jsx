import React, { useState, useEffect, useMemo } from 'react';
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
  Video, 
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
  Info 
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';

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

  // Confirm booking handler
  const handleConfirmBooking = () => {
    if (!bookingModalMentor || !selectedSlot) return;

    setIsSubmittingBooking(true);

    const bookingId = `book-${Date.now()}`;
    const meetId = `meet-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
    const meetUrl = `https://meet.google.com/${meetId}`;

    const newBooking = {
      id: bookingId,
      mentorId: bookingModalMentor.id,
      mentorName: bookingModalMentor.name,
      mentorRole: bookingModalMentor.role,
      mentorAvatar: bookingModalMentor.avatar,
      slot: selectedSlot,
      topic: selectedTopic,
      notes: bookingNotes,
      meetUrl,
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
        showToast("🎉 Session Booked!", `Free strategy call confirmed with ${bookingModalMentor.name} for ${selectedSlot}.`);
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
      showToast("Booking Cancelled", `Session with ${mentorName} has been cancelled.`);
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
        showToast("🎟️ Seat Reserved!", `Your free pass for "${masterclass.title}" is confirmed. Check email for link.`);
      }
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (booking) => {
    const title = encodeURIComponent(`HerEarn 1-on-1 Mentorship: ${booking.mentorName} & You`);
    const details = encodeURIComponent(`1-on-1 Session via HerEarn Mentorship Network.\nTopic: ${booking.topic}\nMeeting Link: ${booking.meetUrl}\nDuration: ${booking.duration}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${encodeURIComponent(booking.meetUrl)}`;
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
              Learn 1-on-1 From Accomplished <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300">Women in Tech & Business</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Connect directly with verified female leaders across India. Receive tailored feedback on your portfolio, overcome career break hesitation, learn freelance rate negotiation, and land your next micro-gig.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Cost Strategy Calls</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Career Break Friendly</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-purple-300" />
                <span>Verifiable Google Meet Sessions</span>
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
                <p className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">Completed Calls</p>
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
          2. NAVIGATION TABS (1-on-1 vs Masterclasses vs Bookings)
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
            <span>1-on-1 Strategy Mentors ({mentors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('masterclasses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              activeTab === 'masterclasses'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 border border-purple-100 dark:border-purple-900/30'
            }`}
          >
            <Video className="w-4 h-4 text-pink-500" />
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
            <span>My Booked Calls ({bookings.length})</span>
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
                              <span>Session Confirmed ({activeBooking?.slot || m.nextSlot})</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {activeBooking && (
                              <a
                                href={activeBooking.meetUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Join Call</span>
                              </a>
                            )}
                            <button
                              onClick={() => handleCancelBooking(activeBooking?.id, m.name)}
                              className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-100 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => openBookingModal(m)}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-md shadow-purple-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Book Free 1-on-1 Call</span>
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
          5. TAB 3: MY BOOKED CALLS
         ======================================================== */}
      {activeTab === 'my-bookings' && (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-purple-200 dark:border-purple-500/30 space-y-4 max-w-xl mx-auto shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">No active mentorship bookings</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You haven't reserved any 1-on-1 calls yet. All strategy sessions are 100% free and sponsored by HerEarn mentors.
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
                            Confirmed
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
                      <span className="text-slate-500">Call Duration:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{b.duration || '35 mins'}</span>
                    </div>
                    {b.notes && (
                      <div className="pt-2 border-t border-purple-200/50 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 italic">
                        Notes: "{b.notes}"
                      </div>
                    )}
                  </div>

                  {/* Actions: Join Call + Add to Calendar */}
                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={b.meetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Google Meet</span>
                    </a>

                    <a
                      href={getGoogleCalendarUrl(b)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-purple-50 dark:hover:bg-slate-700 shadow-xs cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Add to Calendar</span>
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
                  <span>{bookingModalMentor.sessionDuration} Free Strategy Call</span>
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
                <span>2. Choose Live Strategy Call Time:</span>
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
                    <span>Reserving Slot...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Free 1-on-1 Session</span>
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

            <h3 className="text-2xl font-black">Session Confirmed!</h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your free 1-on-1 strategy call with <strong className="text-purple-600 dark:text-purple-400">{confirmedBooking.mentorName}</strong> has been scheduled for:
            </p>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-slate-950 border border-purple-200 dark:border-slate-800 text-xs space-y-1">
              <p className="font-extrabold text-base text-slate-900 dark:text-white">{confirmedBooking.slot}</p>
              <p className="text-purple-600 dark:text-purple-400 font-bold">{confirmedBooking.topic}</p>
              <p className="text-[11px] text-slate-400 font-medium">Platform: Google Meet (Video Call)</p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={getGoogleCalendarUrl(confirmedBooking)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                onClick={() => { setConfirmedBooking(null); setActiveTab('my-bookings'); }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                View in "My Booked Calls"
              </button>
            </div>
          </div>
        </div>
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
