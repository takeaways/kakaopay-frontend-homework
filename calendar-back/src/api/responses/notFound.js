"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(404);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'NotFound',
      message: 'The requested page could not be found but may be available again in the future.'
    });
};