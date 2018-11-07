"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(500);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'InternalServer',
      message: 'The server encountered an internal error or misconfiguration and was unable to complete your request.'
    });
};