import { useEffect } from 'react';

/**
 * Lightweight, 60 FPS viewport reveal utility using IntersectionObserver.
 * Observes elements with the `.reveal-on-scroll` class and marks them `.is-revealed` once in view.
 * Immediately unobserves after revealing to avoid recurring overhead and keep scrolling smooth.
 * Respects `prefers-reduced-motion` and gracefully falls back to instant display if JS/IntersectionObserver is unavailable.
 */
export function initScrollReveal() {
  if (typeof window === 'undefined') return () => {};

  // If user prefers reduced motion, immediately reveal all elements without motion
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach(el => {
      el.classList.add('is-revealed');
    });
    return () => {};
  }

  const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
  if (elements.length === 0) return () => {};

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.08
  });

  elements.forEach(el => observer.observe(el));

  return () => {
    observer.disconnect();
  };
}

export function useScrollReveal(deps = []) {
  useEffect(() => {
    // Short requestAnimationFrame delay to allow newly rendered route DOM elements to mount
    const rafId = requestAnimationFrame(() => {
      initScrollReveal();
    });

    return () => cancelAnimationFrame(rafId);
  }, deps);
}

export default useScrollReveal;
