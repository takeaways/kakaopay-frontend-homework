"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(503);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'ServiceUnavaliable',
      message: 'The server is currently unavailable (because it is overloaded or down for maintenance).'
    });
};