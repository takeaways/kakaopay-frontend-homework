'use strict';

let Query = require('../request/Query');

let logger = CalendarServer.logger('Bind');

module.exports = function bind(req, res, next) {

  let method = req.method = req.method.toUpperCase();
  let accessUrl = req.originalUrl.split('?')[0] || req.url.split('?')[0];
  let key = method + " " + accessUrl;

  if (!req.options)
    req.options = {};

  req.buildQuery = Query.buildQuery.bind(req);
  req.getParams = Query.getParams.bind(req);

  _.each(CalendarServer.responses, function (responseFn, name) {
    res[name] = _.bind(responseFn, {
      req: req,
      res: res
    });
  });

  return next();
};