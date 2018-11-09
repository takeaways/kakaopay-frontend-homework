/** * Created by Andy on 6/5/2015
 * As part of ServerStarter
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 6/5/2015
 *
 */

/*******************************************************************************
 * ServerStarter
 *
 * orBearerAuth Policy
 *
 ******************************************************************************/

"use strict";

module.exports = function (req, res, next) {

  var token;

  // Move on if already authenticated.

  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0], credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      next();
    }

    // sails.log("passport policy");



    Passport.findOne({accessToken: token}, function (err, passport) {

      // sails.log("passport before: ", passport);

      if (err) {
        return next();
      }

      if (!passport) {
        return next();
      }

      // sails.log("passport after: ", passport);
      User.findOne({_id: passport.owner})
        .populate('roles')
        .exec(function (err, user) {
          if (err) {
            return next();
          }
          if (!user) {
            return next();
          }

          req.token = token;
          req.user = user;
          req.session.authenticated = true;
          return next();
        });
    });

  }else {
    next();
  }

};