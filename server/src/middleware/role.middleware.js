const ApiError = require('../utils/ApiError');

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: You do not have permissions for this action.'));
    }
    next();
  };
};

module.exports = roleMiddleware;
