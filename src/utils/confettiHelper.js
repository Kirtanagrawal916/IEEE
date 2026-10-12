import confetti from 'canvas-confetti';

/**
 * Trigger celebratory confetti animation across the screen
 */
export const triggerCelebrationConfetti = () => {
  try {
    // Burst 1: Center explosion
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333ea', '#ec4899', '#3b82f6', '#10b981', '#f59e0b']
    });

    // Burst 2: Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#a855f7', '#ec4899', '#38bdf8']
      });
    }, 200);

    // Burst 3: Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f43f5e', '#8b5cf6', '#10b981']
      });
    }, 400);
  } catch (err) {
    console.warn('[Confetti] Failed to trigger:', err);
  }
};

/**
 * Trigger soft stars confetti for minor milestones like completing a lesson
 */
export const triggerStarBurst = () => {
  try {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      ticks: 200,
      gravity: 1.2,
      colors: ['#eab308', '#ec4899', '#a855f7']
    });
  } catch (err) {
    console.warn('[Confetti] Failed to trigger:', err);
  }
};
