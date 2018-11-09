'use strict';

/**
 * Created by Andy on 7/6/2015
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 7/6/2015
 *
 */

let Query = require('../request/Query');

let logger = Bifido.logger('Bind');

module.exports = function bind(req, res, next) {

  let method = req.method = req.method.toUpperCase();
  let accessUrl = req.originalUrl.split('?')[0] || req.url.split('?')[0];
  let key = method + " " + accessUrl;

  if (!req.options)
    req.options = {};

  req.buildQuery = Query.buildQuery.bind(req);
  req.getParams = Query.getParams.bind(req);

  _.each(Bifido.responses, function (responseFn, name) {
    res[name] = _.bind(responseFn, {
      req: req,
      res: res
    });
  });

  return next();
};