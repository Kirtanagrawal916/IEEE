import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Sparkles, 
  ArrowRight, 
  X, 
  Briefcase, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  IndianRupee,
  Lock
} from 'lucide-react';

export default function OpportunityNotificationBar({ opportunities = [] }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('herearn_dismiss_notif_bar') !== 'true';
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter active opportunities that are accepting applications
  const activeOpps = opportunities && opportunities.length > 0 
    ? opportunities 
    : [
        {
          id: 'gig-1',
          title: 'Social Media Content Creator',
          company: 'CreativeSpark Media',
          stipend: '₹8,000 / month',
          category: 'Marketing & Ads'
        },
        {
          id: 'gig-2',
          title: 'Canva Graphic & Banner Designer',
          company: 'Artisan Bloom',
          stipend: '₹5,000 / project',
          category: 'Design & Canva'
        },
        {
          id: 'gig-3',
          title: 'Shopify Store Product Manager',
          company: 'DesiCrafts Hub',
          stipend: '₹12,000 / month',
          category: 'E-Commerce & Shopify'
        }
      ];

  // Auto-rotate every 7 seconds
  useEffect(() => {
    if (!isVisible || activeOpps.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeOpps.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isVisible, activeOpps.length]);

  if (!isVisible || activeOpps.length === 0) return null;

  const currentOpp = activeOpps[currentIndex] || activeOpps[0];

  const handleApplyClick = () => {
    if (currentOpp?.id) {
      navigate(`/opportunities/${currentOpp.id}`);
    } else {
      navigate('/opportunities');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeOpps.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeOpps.length) % activeOpps.length);
  };

  return (
    <aside 
      aria-label="Opportunity alert"
      className="bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-950 border-b border-purple-500/30 text-white text-xs relative z-50 shadow-md transition-all animate-fade-in"
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Live Opportunity Badge & Carousel */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs shrink-0 animate-pulse">
            <Flame className="w-3.5 h-3.5" />
            <span>New Opportunity</span>
          </span>

          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="font-extrabold text-white truncate text-xs">
              {currentOpp.title}
            </span>
            <span className="hidden md:inline text-purple-300">•</span>
            <span className="hidden md:inline text-purple-200 font-semibold text-[11px] truncate">
              {currentOpp.company}
            </span>
            <span className="hidden sm:inline-flex items-center gap-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-md shrink-0">
              <IndianRupee className="w-2.5 h-2.5" />
              {currentOpp.stipend?.replace('₹', '') || 'Stipend Verified'}
            </span>
            <span className="hidden lg:inline text-amber-300 text-[11px] font-bold">
              — Apply to unlock matching course lectures!
            </span>
          </div>
        </div>

        {/* Right: Actions (Cycle, Apply CTA, Dismiss) */}
        <div className="flex items-center gap-2 shrink-0">
          {activeOpps.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 text-purple-300">
              <button 
                type="button"
                onClick={handlePrev}
                className="p-1 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                title="Previous opportunity"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-purple-300">
                {currentIndex + 1}/{activeOpps.length}
              </span>
              <button 
                type="button"
                onClick={handleNext}
                className="p-1 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                title="Next opportunity"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleApplyClick}
            className="bg-white hover:bg-purple-50 text-purple-900 font-black text-[11px] px-3 py-1 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer hover:scale-105"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3 h-3 text-purple-700" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-1"
            title="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
}
