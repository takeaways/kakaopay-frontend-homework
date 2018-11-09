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

let logger = Bifido.logger('ErrorHandler');

module.exports = function (err, req, res, next) {
  if (Bifido.express.get('env') === 'development') {
    logger.log('error',err);
    if (err.stack) logger.log('error',err.stack);
    return res.internalServer();
  } else {
    logger.log('error',err);
    if (err.stack) logger.log('error',err.stack);
    return res.internalServer();
  }
};