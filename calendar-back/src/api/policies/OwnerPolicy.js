'use strict';

let logger = CalendarServer.logger('OwnerPolicy');

module.exports = function OwnerPolicy(req, res, next) {
  if (req.user) {
    req.policyQuery = {owner: req.user._id};
    return next();
  }

  // User is not allowed
  return res.forbidden();
}

