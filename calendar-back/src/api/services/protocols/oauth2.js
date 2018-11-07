'use strict';

module.exports = function (req, accessToken, refreshToken, profile, next) {
  let query    = {
      identifier : profile._id
    , protocol   : 'oauth2'
    , tokens     : { accessToken: accessToken }
    };

  if (refreshToken !== undefined) {
    query.tokens.refreshToken = refreshToken;
  }

  PassportService.connect(req, query, profile, next);
};
