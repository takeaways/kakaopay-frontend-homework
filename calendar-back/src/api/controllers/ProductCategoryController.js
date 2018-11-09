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

let logger = Bifido.logger('ProductCategoryController');

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
      let queryPromise = ProductCategory.find(params.query);

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
      let countPromise = ProductCategory.count(params.query);

      // TransactionService.rollback();
      return Promise.all([queryPromise, countPromise]);
    })
    .spread((productCategories, count) => {
      // See if there's more
      let more = (productCategories[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) productCategories.splice(params.limit - 1, 1);

      return res.ok({productCategories: productCategories, more: more, total: count});
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
      let queryPromise = ProductCategory.findOne(params.query);

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
    .then((productCategory) => {
      if (!productCategory) throw new Error("ProductCategoryNotFound");
      productCategory.views++;

      return productCategory.save();
    })
    .then((productCategory) => {
      res.ok({productCategory: productCategory});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'ProductCategoryNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function create(req, res) {
  let productCategory;
  req.getParams(["name"])
    .then((_productCategory) => {
      productCategory = _productCategory;

      productCategory.createdBy = req.user._id;
      productCategory.updatedBy = req.user._id;
      productCategory.owner = req.user._id;

      return ProductCategory.create(productCategory);
    })
    .then((productCategory) => {
      return res.ok({productCategory: productCategory})
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
      return ProductCategory.findOne(query);
    })
    .then((productCategory) => {
      if (!productCategory) throw new Error("ProductCategoryNotFound");
      productCategory.lastUpdatedAt = new Date();
      productCategory.updatedBy = req.user._id;

      productCategory.name = req.body.name;

      return productCategory.save();
    })
    .then(function (result) {
      return res.ok(result);
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'ProductCategoryNotFound')
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
      return ProductCategory.findOne(query);
    })
    .then(productCategory => {
      if (!productCategory) throw new Error("ProductCategoryNotFound");
      productCategory.isDeleted = true;
      return productCategory.save();
    })
    .then((productCategory) => {
      return res.ok({productCategory: productCategory});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'ProductCategoryNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}