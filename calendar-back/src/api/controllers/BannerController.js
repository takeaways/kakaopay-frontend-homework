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

let logger = Bifido.logger('BannerController');

module.exports = {
  // Public
  find: find,
  findOne: findOne,

  // Admin
  create: create,
  update: update,
  remove: remove
};

function find(req, res) {
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;

      let queryPromise = Banner.find(params.query);

      // Limit
      if (params.limit && params.limit > 0){
        params.limit++;
        queryPromise = queryPromise.limit(params.limit);
      }

      // Skip
      if (params.skip)
        queryPromise = queryPromise.skip(params.skip);

      // Sort
      if (params.sort)
        queryPromise = queryPromise.sort(params.sort);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      // Count
      let countPromise = Banner.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread((banners, count) => {
      return res.ok({banners: banners, total: count});
    })
    .catch((err) => {
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
      let queryPromise = Banner.findOne(params.query);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      return queryPromise;
    })
    .then((banner) => {
      if (!banner) throw new Error("BannerNotFound");

      banner.views++;
      banner.save();
      res.ok({banner: banner});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'BannerNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function create(req, res) {
  let banner;
  req.getParams(["category", "bannerList"])
    .then((_banner) => {
      banner = _banner;

      banner.createdBy = req.user._id;
      banner.updatedBy = req.user._id;
      banner.owner = req.user._id;

      return Banner.create(banner);
    })
    .then((createdBanner) => {
      res.ok({banner: createdBanner});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function update(req, res) {
  req.getParams("_id")
    .then((query) => {
      return Banner.findOne(query);
    })
    .then((banner) => {
      if (!banner) throw new Error("BannerNotFound");

      banner.lastUpdatedAt = new Date();
      banner.updatedBy = req.user._id;

      banner.bannerList = req.body.bannerList;

      return banner.save();
    })
    .then((banner) => {
      return res.ok({banner: banner});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'BannerNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function remove(req, res) {
  req.getParams("_id")
    .then((query) => {
      return Banner.findOne(query);
    })
    .then((banner) => {
      if (!banner) throw new Error("BannerNotFound");
      banner.isDeleted = true;
      return banner.save();
    })
    .then((banner) => {
      return res.ok({banner: banner});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'BannerNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}
