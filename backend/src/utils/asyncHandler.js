/**
 * Async Route Handler Wrapper
 * Eliminates repetitive try/catch blocks in Express route handlers and controllers
 *
 * @param {Function} fn - Asynchronous Express middleware/controller function
 * @returns {Function} Express middleware that catches and forwards errors to next()
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
