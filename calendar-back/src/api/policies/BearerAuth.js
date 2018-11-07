'use strict';

module.exports = function (req, res, next) {
  let auth = req.headers.authorization;
  if (!auth || auth.search('Bearer ') !== 0) {
    return next();
  }

  return PassportService.authenticate('bearer', {session: true})(req, res, next);
};
