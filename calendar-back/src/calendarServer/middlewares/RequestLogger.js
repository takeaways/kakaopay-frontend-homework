'use strict';

let responseTime = require('response-time');
let logger = CalendarServer.logger('RequestLogger');

module.exports = responseTime(timerHandler);

function timerHandler(req, res, time) {
  logger.log('info', '%s %s %s %s ms', req.method, req.originalUrl, res.statusCode, time, res.getHeader('Content-Length'));
  if (req.requestLog) {
    req.requestLog.statusCode = res.statusCode;
    req.requestLog.duration = time;
    if (req.user && req.user._id)req.requestLog.owner = req.user._id;
    req.requestLog.save();
  }


}