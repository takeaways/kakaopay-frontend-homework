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


module.exports = function (req, res, next) {
  if (!req.query)
    req.query = {};

  switch (req.method) {
    case 'GET':
      break;
    case 'POST':
      // Remove forbidden attributes
      delete req.body.createdBy;
      delete req.body.updatedBy;
      delete req.body.isDeleted;
      delete req.body.lastUpdatedAt;
      delete req.body.owner;

      break;
    case 'PUT':
      // Remove forbidden attributes
      delete req.body.createdBy;
      delete req.body.updatedBy;
      delete req.body.isDeleted;
      delete req.body.lastUpdatedAt;
      delete req.body.owner;
      break;
    case 'DELETE':
      break;
  }

  next();
};