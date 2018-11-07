'use strict';

module.exports = function (req, identifier, profile, next) {
  let query    = {
    identifier : identifier
  , protocol   : 'openid'
  };

  sails.services.passport.connect(req, query, profile, next);
};
