/**
 * Pure ultra-lightweight Canvas confetti animation helper with zero external dependencies.
 * Engineered for sub-millisecond execution and 60fps rendering without latency or main-thread blocking.
 */

let activeCanvas = null;
let activeAnimFrame = null;
let autoCleanupTimer = null;

export const cancelActiveConfetti = () => {
  if (activeAnimFrame) {
    cancelAnimationFrame(activeAnimFrame);
    activeAnimFrame = null;
  }
  if (autoCleanupTimer) {
    clearTimeout(autoCleanupTimer);
    autoCleanupTimer = null;
  }
  if (activeCanvas && activeCanvas.parentNode) {
    activeCanvas.parentNode.removeChild(activeCanvas);
    activeCanvas = null;
  }
};

const runSingleFastBurst = (opts = {}) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Clean up any ongoing burst so canvases never stack
  cancelActiveConfetti();

  const particleCount = opts.particleCount || 24;
  const colors = opts.colors || ['#9333ea', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
  const origin = opts.origin || { x: 0.5, y: 0.5 };
  const spread = (opts.spread || 65) * (Math.PI / 180);
  const baseAngle = ((opts.angle !== undefined ? opts.angle : 90) * Math.PI) / 180;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);
  activeCanvas = canvas;

  // Render at 1x resolution to avoid giant 4K/Retina framebuffer allocations
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    cancelActiveConfetti();
    return;
  }

  const startX = origin.x * window.innerWidth;
  const startY = origin.y * window.innerHeight;

  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const angle = baseAngle + (Math.random() - 0.5) * spread;
    const speed = 5 + Math.random() * 8;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
      color: colors[i % colors.length],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10,
      opacity: 1,
      gravity: 0.38,
      decay: 0.024 + Math.random() * 0.012, // Finishes fast in ~400-500ms
      w: 7 + Math.random() * 4,
      h: 4 + Math.random() * 4,
    });
  }

  const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let hasAlive = false;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity > 0) {
        hasAlive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.97;
        p.rotation += p.vRotation;
        p.opacity -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    if (hasAlive) {
      activeAnimFrame = requestAnimationFrame(update);
    } else {
      cancelActiveConfetti();
    }
  };

  activeAnimFrame = requestAnimationFrame(update);

  // Safety timer to prevent canvas leak even if tab loses focus
  autoCleanupTimer = setTimeout(() => {
    cancelActiveConfetti();
  }, 700);
};

/**
 * Trigger lightweight, latency-free celebratory confetti animation
 */
export const triggerCelebrationConfetti = () => {
  try {
    runSingleFastBurst({
      particleCount: 26,
      spread: 70,
      angle: 90,
      origin: { x: 0.5, y: 0.55 },
      colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b']
    });
  } catch (err) {
    // Non-blocking fail-safe
  }
};

/**
 * Trigger soft micro-star confetti for milestones
 */
export const triggerStarBurst = () => {
  try {
    runSingleFastBurst({
      particleCount: 14,
      spread: 50,
      angle: 90,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#eab308', '#ec4899', '#a855f7']
    });
  } catch (err) {
    // Non-blocking fail-safe
  }
};
