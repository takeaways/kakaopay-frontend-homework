'use strict';

let logger = CalendarServer.logger('ErrorHandler');

module.exports = function (err, req, res, next) {
  if (CalendarServer.express.get('env') === 'development') {
    logger.log('error',err);
    if (err.stack) logger.log('error',err.stack);
    return res.internalServer();
  } else {
    logger.log('error',err);
    if (err.stack) logger.log('error',err.stack);
    return res.internalServer();
  }
};