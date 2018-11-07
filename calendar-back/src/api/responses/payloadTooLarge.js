"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(413);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'PayloadTooLarge',
      message: 'The request is larger than the server is willing or able to process.'
    });
};