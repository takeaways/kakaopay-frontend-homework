'use strict';

module.exports = function (req, token, done) {

  AuthService.verifyToken(token, function (err, userInfo) {

    if (err)
      return done(null, false);


    User.findOne({_id: userInfo._id}).exec(function (err, user) {
      if (err) {
        return done(null, false);
      }

      if (!user) {
        return done(null, false);
      }

      // delete access_token from params
      // to avoid conflicts with blueprints query builder
      return done(null, user);
    });
  });

};