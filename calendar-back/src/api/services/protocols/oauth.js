'use strict';

module.exports = function (req, token, tokenSecret, profile, next) {
  let query    = {
      identifier : profile._id
    , protocol   : 'oauth'
    , tokens     : { token: token }
    };

  if (tokenSecret !== undefined) {
    query.tokens.tokenSecret = tokenSecret;
  }

  sails.services.passport.connect(req, query, profile, next);
};
