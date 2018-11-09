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

module.exports = function (req, res, next) {
  if (req.user) {
    req.user
      .populate({
        path: "passports",
        match: {
          $or: [
            {protocol: 'local'},
            {provider: 'naver'},
            {provider: 'kakao'},
          ],
        }
      })
      .execPopulate()
      .then((user) => {
        if (!user.passports || user.passports.length < 1)
          return res.forbidden();

        return next();
      });
  } else
    return res.forbidden();
};
