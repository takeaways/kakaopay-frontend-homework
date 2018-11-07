"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(431);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'ManyRequest',
      message: 'The user has sent too many requests in a given amount of time.'
    });
};