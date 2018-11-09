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

let localProtocol = require('./local');

let logger = Bifido.logger('BasicProtocol');

module.exports = function (req, username, password, next) {
  logger.debug( 'using basic auth strategy for user', username, ', password', password);

  return localProtocol.login(req, username, password, next);
};
