'use strict';

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

      // Remove server domain (not allowed to change server domain)
      break;
    case 'DELETE':
      break;
  }

  next();
};