/**
 * Utility to calculate skill match percentage and breakdown between user skills and opportunity required skills.
 */

// Available skills dictionary for user profile skill selector
export const AVAILABLE_SKILLS = [
  "Canva",
  "Canva Design",
  "Instagram Marketing",
  "Instagram Management",
  "Content Writing",
  "SEO",
  "SEO Blogging",
  "Photoshop",
  "Graphic Design",
  "Digital Marketing",
  "Shopify",
  "E-Commerce",
  "Video Editing",
  "Instagram Reels",
  "Copywriting",
  "Banner Design",
  "Poster Layout",
  "Packaging Design",
  "Data Entry",
  "Product Writing"
];

export const DEFAULT_USER_SKILLS = [
  "Canva",
  "Instagram Marketing",
  "Content Writing"
];

/**
 * Normalizes skill strings for matching comparison
 */
function normalizeSkill(skill) {
  if (!skill) return '';
  return skill.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

/**
 * Checks if a user skill matches a required skill using flexible string matching
 */
function isSkillMatched(userSkill, requiredSkill) {
  const u = normalizeSkill(userSkill);
  const r = normalizeSkill(requiredSkill);
  
  if (!u || !r) return false;
  if (u === r) return true;
  if (u.includes(r) || r.includes(u)) return true;

  // Custom alias mappings
  if ((u.includes('canva') && r.includes('canva')) ||
      (u.includes('instagram') && r.includes('instagram')) ||
      (u.includes('writing') && r.includes('writing')) ||
      (u.includes('content') && r.includes('content')) ||
      (u.includes('seo') && r.includes('seo')) ||
      (u.includes('design') && r.includes('design')) ||
      (u.includes('shopify') && r.includes('shopify')) ||
      (u.includes('video') && r.includes('video')) ||
      (u.includes('reels') && r.includes('reels')) ||
      (u.includes('banner') && r.includes('banner')) ||
      (u.includes('poster') && r.includes('poster')) ||
      (u.includes('ecommerce') && r.includes('ecommerce'))) {
    return true;
  }

  return false;
}

/**
 * Calculates match percentage and detailed breakdown
 * @param {Array<string>} userSkills 
 * @param {Array<string>} requiredSkills 
 * @returns {Object} { matchPercentage, matchedSkills, missingSkills, totalRequired }
 */
export function calculateSkillMatch(userSkills = [], requiredSkills = []) {
  const activeUserSkills = (userSkills && userSkills.length > 0) 
    ? userSkills 
    : DEFAULT_USER_SKILLS;

  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      totalRequired: 0
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((reqSkill) => {
    const matched = activeUserSkills.some((uSkill) => isSkillMatched(uSkill, reqSkill));
    if (matched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    totalRequired: requiredSkills.length
  };
}
