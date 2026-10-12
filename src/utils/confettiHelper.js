/**
 * Pure lightweight Canvas confetti animation helper with zero external dependencies.
 * Ensures 100% build reliability without requiring external CJS/ESM canvas-confetti modules.
 */

const runConfettiBurst = (opts = {}) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const particleCount = opts.particleCount || 60;
  const colors = opts.colors || ['#9333ea', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];
  const origin = opts.origin || { x: 0.5, y: 0.6 };
  const spread = (opts.spread || 70) * (Math.PI / 180);
  const baseAngle = ((opts.angle !== undefined ? opts.angle : 90) * Math.PI) / 180;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    return;
  }
  ctx.scale(dpr, dpr);

  const startX = (origin.x !== undefined ? origin.x : 0.5) * window.innerWidth;
  const startY = (origin.y !== undefined ? origin.y : 0.6) * window.innerHeight;

  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const angle = baseAngle + (Math.random() - 0.5) * spread;
    const speed = 6 + Math.random() * 9;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 14,
      opacity: 1,
      gravity: 0.32 + Math.random() * 0.15,
      decay: 0.012 + Math.random() * 0.008,
      w: 8 + Math.random() * 6,
      h: 5 + Math.random() * 5,
    });
  }

  let animationFrame;
  const update = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let hasAlive = false;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity > 0) {
        hasAlive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
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
      animationFrame = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animationFrame);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  animationFrame = requestAnimationFrame(update);
};

/**
 * Trigger celebratory confetti animation across the screen
 */
export const triggerCelebrationConfetti = () => {
  try {
    // Burst 1: Center explosion
    runConfettiBurst({
      particleCount: 70,
      spread: 75,
      angle: 90,
      origin: { x: 0.5, y: 0.55 },
      colors: ['#9333ea', '#ec4899', '#3b82f6', '#10b981', '#f59e0b']
    });

    // Burst 2: Left cannon
    setTimeout(() => {
      runConfettiBurst({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#a855f7', '#ec4899', '#38bdf8']
      });
    }, 180);

    // Burst 3: Right cannon
    setTimeout(() => {
      runConfettiBurst({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#f43f5e', '#8b5cf6', '#10b981']
      });
    }, 360);
  } catch (err) {
    console.warn('[Confetti] Failed to trigger celebration:', err);
  }
};

/**
 * Trigger soft star confetti for minor milestones like completing a lesson
 */
export const triggerStarBurst = () => {
  try {
    runConfettiBurst({
      particleCount: 35,
      spread: 60,
      angle: 90,
      origin: { x: 0.5, y: 0.65 },
      colors: ['#eab308', '#ec4899', '#a855f7']
    });
  } catch (err) {
    console.warn('[Confetti] Failed to trigger starburst:', err);
  }
};
