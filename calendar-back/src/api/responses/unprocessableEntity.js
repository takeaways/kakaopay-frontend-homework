"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(422);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'UnprocessableEntity',
      message: 'status code means the server understands the content type of the request entity.'
    });
};