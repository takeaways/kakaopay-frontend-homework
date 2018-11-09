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


/*******************************************************************************
 * MyFitMate
 *
 * orBearerAuth Policy
 *
 ******************************************************************************/

module.exports = function (req, res, next) {

  if(req.user)
    return next();

  let auth = req.headers.authorization;
  if (!auth || auth.search('Bearer ') !== 0) {
    return next();
  }

  return PassportService.authenticate('bearer', {session: true})(req, res, next);
};
