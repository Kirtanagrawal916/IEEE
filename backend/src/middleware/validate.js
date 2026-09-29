/**
 * Request Validation Middleware Helper
 * Validates request body, query, or params against expected schema rules
 */

/**
 * Validate that required fields exist in req.body
 * @param {Array<string>} requiredFields - List of field names that must be present and non-empty
 */
export const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = [];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missing.join(', ')}`,
        missingFields: missing,
      });
    }

    next();
  };
};

/**
 * Validate email format helper
 */
export const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email) return next();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email address format.',
    });
  }

  next();
};

export default {
  validateBody,
  validateEmail,
};
