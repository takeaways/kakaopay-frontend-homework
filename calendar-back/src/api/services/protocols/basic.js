'use strict';

let localProtocol = require('./local');

let logger = CalendarServer.logger('BasicProtocol');

module.exports = function (req, username, password, next) {
  logger.debug( 'using basic auth strategy for user', username, ', password', password);

  return localProtocol.login(req, username, password, next);
};
