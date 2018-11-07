'use strict';

module.exports = function (err, req, res, next) {
  if (!err) err = new Error("Not found");

  next(err);
};