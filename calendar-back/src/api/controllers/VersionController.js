'use strict';

/**
 * Created by PHILIP on 02/11/2016
 * As Part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 02/11/2016
 *
 */

let logger = Bifido.logger('VersionController');

module.exports = {
  // Public
  find: find,
  findOne: findOne,

  // Admin
  create: create,
  update: update
};

function find(req, res) {
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;

      let queryPromise = Version.find(params.query);

      // Limit
      if (!params.limit || params.limit > 50)
        params.limit = 50;
      params.limit++;
      queryPromise = queryPromise.limit(params.limit);

      // Skip
      if (params.skip)
        queryPromise = queryPromise.skip(params.skip);

      // Sort
      if (params.sort)
        queryPromise = queryPromise.sort(params.sort);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, function (populate) {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      // Count
      let countPromise = Version.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread(function (versions, count) {

      // See if there's more
      let more = (versions[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) versions.splice(params.limit - 1, 1);

      return res.ok({versions: versions, more: more, total: count});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      res.internalServer();
    });
}

function findOne(req, res) {
  req.buildQuery()
    .then((params) => {
      let queryPromise = Version.findOne(params.query);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, function (populate) {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      return queryPromise;
    })
    .then(function (version) {
      if (!version) throw new Error("VersionNotFound");
      res.ok({version: version});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'VersionNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function create(req, res) {
  let version;
  req.getParams(["platform", "version", "packageName"])
    .then((_version) => {
      version = _version;

      version.createdBy = req.user._id;
      version.updatedBy = req.user._id;
      version.owner = req.user._id;

      version.version = req.body.version;
      version.platform = req.body.platform;
      version.packageName = req.body.packageName;

      return Version.create(version);
    })
    .then((version) => {
      res.ok({version: version});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      res.internalServer();
    });
}

function update(req, res) {
  req.getParams("_id")
    .then((query) => {
      return Version.findOne(query);
    })
    .then(version => {
      if (!version) throw new Error("VersionNotFound");

      version.lastUpdatedAt = new Date();
      version.updatedBy = req.user._id;

      version.version = req.body.version;
      version.platform = req.body.platform;
      version.packageName = req.body.packageName;

      return version.save()

    })
    .then((updatedVersion) => {
      return res.ok({version: updatedVersion});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'VersionNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}