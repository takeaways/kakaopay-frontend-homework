'use strict';

/**
 * Created by Andy on 7/6/2015
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 7/6/2015
 *
 */


let responseTime = require('response-time');
let logger = Bifido.logger('RequestLogger');

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