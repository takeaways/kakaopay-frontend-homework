"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(409);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'Conflict',
      message: 'The request could not be completed because of a conflict in the request.'
    });
};