"use strict";

module.exports = function (data) {

  // Get access to `req`, `res`, & `sails`
  let req = this.req;
  let res = this.res;

  // Set status code
  res.status(412);

  // If appropriate, serve data as JSON(P)
  return res.send(data || {
      name: 'PreconditionFailed',
      message: 'The server does not meet one of the preconditions that the requester put on the request.'
    });
};