'use strict';

/**
 * Created by Andy on 7/6/2015
 * As part of Appzet
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 7/6/2015
 *
 */

module.exports = function (req, res, next) {
  if (req.user) {
    req.user
      .populate({
        path: "passports",
        match: {
          $or: [
            {protocol: 'local'},
            {provider: 'google'},
            {provider: 'facebook'},
          ],
        }
      })
      .populate("role")
      .execPopulate()
      .then((user) => {
        if (!user.passports || user.passports.length < 1)
          return res.forbidden();

        if (user.role && user.role._id == "관리자")
          return next();

        req.policyQuery = {owner: req.user._id};

        return next();
      });
  } else
    return res.forbidden();
};
