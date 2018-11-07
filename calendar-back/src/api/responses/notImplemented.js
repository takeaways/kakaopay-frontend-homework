"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(501);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'NotImplemented',
      message: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.'
    });
};