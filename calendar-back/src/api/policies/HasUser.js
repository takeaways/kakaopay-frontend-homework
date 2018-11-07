'use strict';

module.exports = function (req, res, next) {
  if (req.user)
    return next();

  // User is not allowed
  return res.forbidden();
};
