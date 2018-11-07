"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(508);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'LoopDetected',
      message: 'The server detected an infinite loop while processing the request.'
    });
};