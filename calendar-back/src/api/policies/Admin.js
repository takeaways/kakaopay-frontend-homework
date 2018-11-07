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
      .populate("role")
      .execPopulate()
      .then((user) => {
        if (!user.passports || user.passports.length < 1 || user.role._id != "관리자")
          return res.forbidden();

        return next();
      });
  } else
    return res.forbidden();
};
