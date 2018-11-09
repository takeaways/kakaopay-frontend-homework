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

let logger = Bifido.logger('OwnerPolicy');

module.exports = function OwnerPolicy(req, res, next) {
  if (req.user) {
    req.policyQuery = {owner: req.user._id};
    return next();
  }

  // User is not allowed
  return res.forbidden();
}

