import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Scroll Progress Bar
 * Sits at the very top of the window and fills proportionally as the user scrolls.
 * Optimized with requestAnimationFrame for silky 60 FPS scrolling without layout thrashing.
 */
export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 transition-[width] duration-150 ease-out shadow-xs"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

/**
 * Back To Top Floating Action Button
 * Smoothly transitions into view when scrolled down past 300px.
 * Features rAF throttle and smooth transform/opacity easing.
 */
export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to Top"
      className={`fixed bottom-6 right-20 z-40 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 shadow-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md group focus:outline-none focus:ring-2 focus:ring-purple-400/50 ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
    </button>
  );
}
