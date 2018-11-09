'use strict';
/**
 * Created by Yunseok Han on 09/02/2016
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Yunseok Han - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Yunseok Han <developer@applicat.co.kr>, 09/02/2016
 *
 * Originator 작성자 - Yunseok Han 2016/09/02
 * Updater    수정자 - MaengKwan Seo 2017/01/11
 * Updater    수정자 - JongIn Koo 2017/05/16
 */

let logger = Bifido.logger('OptionController');

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

      // Find
      let queryPromise = Option.find(params.query);

      // Limit
      if (params.limit && params.limit > 0) {
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
      let countPromise = Option.count(params.query);

      // TransactionService.rollback();
      return Promise.all([queryPromise, countPromise]);
    })
    .spread((options, count) => {
      // See if there's more
      let more = (options[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) options.splice(params.limit - 1, 1);

      return res.ok({options: options, more: more, total: count});
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
      let queryPromise = Option.findOne(params.query);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      // TransactionService.rollback();
      return queryPromise;
    })
    .then((option) => {
      if (!option) throw new Error("OptionNotFound");
      option.views++;

      return option.save();
    })
    .then((option) => {
      res.ok({option: option});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'OptionNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function create(req, res) {
  let option;
  req.getParams(["name", "price", "product"])
    .then((_option) => {
      option = _option;

      return Promise.all([Option.create(option), Product.findOne({_id: req.body.product})]);
    })
    .spread((option, product) => {
      product.options.push(option);
      product.save();

      return option;
    })
    .then((option) => {
      return res.ok({option: option})
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

function update(req, res) {
  req.getParams("_id")
    .then((query) => {
      return Option.findOne(query);
    })
    .then((option) => {
      if (!option) throw new Error("OptionNotFound");
      option.lastUpdatedAt = new Date();
      option.updatedBy = req.user._id;

      option.name = req.body.name;
      option.price = req.body.price;
      option.product = req.body.product;

      return option.save();
    })
    .then(function (result) {
      return res.ok(result);
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'OptionNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function remove(req, res) {
  let query;
  req.getParams("_id")
    .then((_query) => {
      query = _query;
      return Option.findOne(query);
    })
    .then((option) => {
      if (!option) throw new Error("OptionNotFound");
      option.isDeleted = true;

      return Promise.all([option.save(), Product.update({}, {$pullAll: {options: [query._id]}}, {multi: true})]);
    })
    .spread((option, product) => {
      return res.ok({option: option});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'OptionNotFound'
        || err.message === 'ProductNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}