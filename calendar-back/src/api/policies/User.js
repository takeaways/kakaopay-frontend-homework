'use strict';

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
      .execPopulate()
      .then((user) => {
        if (!user.passports || user.passports.length < 1)
          return res.forbidden();

        return next();
      });
  } else
    return res.forbidden();
};
