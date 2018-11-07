"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(402);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'PaymentRequired',
      message: 'This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.'
    });
};