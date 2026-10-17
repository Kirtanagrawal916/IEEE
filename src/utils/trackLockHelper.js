import { skillTracks, initialOpportunities } from '../data/mockData';

/**
 * Maps an opportunity/gig to its corresponding certified skill track
 * @param {Object} opportunity - The opportunity object (with category, title, skillsRequired)
 * @param {Array} tracks - Array of skill tracks
 * @returns {Object} Matching skill track
 */
export const getMatchingTrackForOpportunity = (opportunity, tracks = skillTracks) => {
  if (!opportunity) return tracks[0] || null;

  const cat = (opportunity.category || '').toLowerCase();
  const title = (opportunity.title || '').toLowerCase();
  const skills = (opportunity.skillsRequired || []).map(s => String(s).toLowerCase());
  const combined = `${cat} ${title} ${skills.join(' ')}`;

  // 1. Digital Marketing & Social Media Growth -> track-1
  if (
    combined.includes('marketing') ||
    combined.includes('social media') ||
    combined.includes('instagram') ||
    combined.includes('meta ads') ||
    combined.includes('whatsapp')
  ) {
    const t = tracks.find(item => item.id === 'track-1');
    if (t) return t;
  }

  // 2. Graphic Design & Brand Asset Creation -> track-2
  if (
    combined.includes('design') ||
    combined.includes('canva') ||
    combined.includes('graphic') ||
    combined.includes('logo') ||
    combined.includes('packaging') ||
    combined.includes('flyer') ||
    combined.includes('banner')
  ) {
    const t = tracks.find(item => item.id === 'track-2');
    if (t) return t;
  }

  // 3. E-Commerce & Shopify Store Mastery -> track-3
  if (
    combined.includes('e-commerce') ||
    combined.includes('ecommerce') ||
    combined.includes('shopify') ||
    combined.includes('catalog') ||
    combined.includes('razorpay') ||
    combined.includes('store')
  ) {
    const t = tracks.find(item => item.id === 'track-3');
    if (t) return t;
  }

  // 4. Freelance Copywriting & Content Marketing -> track-4
  if (
    combined.includes('writing') ||
    combined.includes('copywriting') ||
    combined.includes('content') ||
    combined.includes('blog') ||
    combined.includes('seo')
  ) {
    const t = tracks.find(item => item.id === 'track-4');
    if (t) return t;
  }

  // 5. Short-form Video & Reel Editing -> track-5
  if (
    combined.includes('video') ||
    combined.includes('reel') ||
    combined.includes('shorts') ||
    combined.includes('capcut') ||
    combined.includes('youtube')
  ) {
    const t = tracks.find(item => item.id === 'track-5');
    if (t) return t;
  }

  // 6. Virtual Assistance & Remote Business Ops -> track-6
  if (
    combined.includes('virtual') ||
    combined.includes('assistant') ||
    combined.includes('operations') ||
    combined.includes('admin') ||
    combined.includes('notion') ||
    combined.includes('calendar')
  ) {
    const t = tracks.find(item => item.id === 'track-6');
    if (t) return t;
  }

  // Fallback by category substring
  const fallback = tracks.find(t =>
    t.category.toLowerCase().includes(cat) ||
    cat.includes(t.category.toLowerCase()) ||
    t.title.toLowerCase().includes(cat)
  );

  return fallback || tracks[0];
};

/**
 * Returns all unlocked track IDs for the given user, combining stored IDs
 * and any tracks unlocked via applied opportunities.
 * @param {Object} user - User object
 * @returns {Array<string>} List of unlocked track IDs
 */
export const getUnlockedTrackIds = (user) => {
  const ids = new Set();

  // 1. Explicit array on user object
  if (user && Array.isArray(user.unlockedTrackIds)) {
    user.unlockedTrackIds.forEach(id => ids.add(id));
  }

  // 2. LocalStorage persistence
  try {
    const stored = JSON.parse(localStorage.getItem('herearn_unlocked_tracks') || '[]');
    if (Array.isArray(stored)) {
      stored.forEach(id => ids.add(id));
    }
  } catch {}

  // 3. Derive from applied opportunities (user.appliedGigIds or localStorage)
  const appliedGigIds = new Set(user?.appliedGigIds || []);
  try {
    const storedApps = JSON.parse(localStorage.getItem('herearn_applied_gigs') || '[]');
    if (Array.isArray(storedApps)) {
      storedApps.forEach(id => appliedGigIds.add(id));
    }
  } catch {}

  appliedGigIds.forEach(gigId => {
    const gig = initialOpportunities.find(g => g.id === gigId);
    if (gig) {
      const matchingTrack = getMatchingTrackForOpportunity(gig);
      if (matchingTrack) {
        ids.add(matchingTrack.id);
      }
    }
  });

  return Array.from(ids);
};

/**
 * Checks whether a specific track is unlocked for the user.
 * @param {string} trackId - Skill Track ID
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isTrackUnlocked = (trackId, user) => {
  if (!trackId) return false;
  const unlocked = getUnlockedTrackIds(user);
  return unlocked.includes(trackId);
};

/**
 * Returns full track objects that are unlocked for the user.
 * @param {Object} user - User object
 * @param {Array} tracks - Array of skill tracks
 * @returns {Array<Object>}
 */
export const getUnlockedTracksForUser = (user, tracks = skillTracks) => {
  const unlockedIds = getUnlockedTrackIds(user);
  return tracks.filter(t => unlockedIds.includes(t.id));
};

/**
 * Total count of opportunities the user has applied to
 * @param {Object} user - User object
 * @param {Array} apiApplications - List from backend if available
 * @returns {number}
 */
export const getTotalOpportunitiesApplied = (user, apiApplications = []) => {
  const ids = new Set(user?.appliedGigIds || []);
  try {
    const stored = JSON.parse(localStorage.getItem('herearn_applied_gigs') || '[]');
    if (Array.isArray(stored)) {
      stored.forEach(id => ids.add(id));
    }
  } catch {}
  if (Array.isArray(apiApplications)) {
    apiApplications.forEach(app => {
      if (app.opportunityId) ids.add(app.opportunityId);
      else if (app.id) ids.add(app.id);
    });
  }
  return ids.size;
};
