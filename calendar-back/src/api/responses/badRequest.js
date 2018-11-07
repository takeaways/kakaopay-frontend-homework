"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(400);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'BadRequest',
      message: 'The request cannot be fulfilled due to bad syntax.'
    });
};