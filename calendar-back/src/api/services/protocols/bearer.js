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

module.exports = function (req, token, done) {

  AuthService.verifyToken(token, function (err, userInfo) {

    if (err)
      return done(null, false);


    User.findOne({_id: userInfo._id}).exec(function (err, user) {
      if (err) {
        return done(null, false);
      }

      if (!user) {
        return done(null, false);
      }

      // delete access_token from params
      // to avoid conflicts with blueprints query builder
      return done(null, user);
    });
  });

};