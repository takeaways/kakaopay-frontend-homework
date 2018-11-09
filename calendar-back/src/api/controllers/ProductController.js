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

let logger = Bifido.logger('ProductController');

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
      let queryPromise = Product.find(params.query);

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
      let countPromise = Product.count(params.query);

      // TransactionService.rollback();
      return Promise.all([queryPromise, countPromise]);
    })
    .spread((products, count) => {
      // See if there's more
      let more = (products[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) products.splice(params.limit - 1, 1);

      return res.ok({products: products, more: more, total: count});
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
      let queryPromise = Product.findOne(params.query);

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
    .then((product) => {
      if (!product) throw new Error("ProductNotFound");
      product.views++;

      return product.save();
    })
    .then((product) => {
      res.ok({product: product});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'ProductNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function create(req, res) {
  let product;
  req.getParams(["name", "summary", "soldOut", "price", "thumnail", "photos"])
    .then((_product) => {
      product = _product;

      if(req.body.category)
        product.category = req.body.category;

      if (req.body.salePrice)
        product.salePrice = req.body.salePrice;

      if (req.body.employeePrice)
        product.employeePrice = req.body.employeePrice;

      if (req.body.isRecommend)
        product.isRecommend = req.body.isRecommend;

      if (req.body.isHot)
        product.isHot = req.body.isHot;

      //Associations
      product.thumnail = req.body.thumnail;
      product.photos = req.body.photos;
      product.owner = req.user._id;
      product.createdBy = req.user._id;
      product.updatedBy = req.user._id;

      return Product.create(product);
    })
    .then((product) => {
      return res.ok({product: product})
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
      return Product.findOne(query);
    })
    .then((product) => {
      if (!product) throw new Error("ProductNotFound");
      product.lastUpdatedAt = new Date();
      product.updatedBy = req.user._id;

      product.category = req.body.category;

      product.name = req.body.name;
      product.summary = req.body.summary;
      product.soldOut = req.body.soldOut;
      product.price = req.body.price;
      // product.options = req.body.options;

      if (req.body.salePrice)
        product.salePrice = req.body.salePrice;

      if (req.body.employeePrice)
        product.employeePrice = req.body.employeePrice;

      if (req.body.isRecommend)
        product.isRecommend = req.body.isRecommend;

      if (req.body.isHot)
        product.isHot = req.body.isHot;

      //Associations
      product.thumnail = req.body.thumnail;
      product.photos = req.body.photos;

      return product.save();
    })
    .then(function (result) {
      return res.ok(result);
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'ProductNotFound')
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
      return Product.findOne(query);
    })
    .then(product => {
      if (!product) throw new Error("ProductNotFound");
      product.isDeleted = true;
      return product.save();
    })
    .then((product) => {
      return res.ok({product: product});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'ProductNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}