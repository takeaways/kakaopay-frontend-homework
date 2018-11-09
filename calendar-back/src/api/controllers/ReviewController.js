'use strict';

/**
 * Created by sungwookim on 11/01/2018
 * As part of bifidoServer
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by sungwookim <ksw1652@gmail.com>, 11/01/2018
 *
 * Updater    수정자 - 작성자이름 11/01/2018
 */

let logger = Bifido.logger('ReviewController');

module.exports = {
  // Public
  find: find,
  findOne: findOne,

  findMyUnwriteReivews: findMyUnwriteReivews,

  // Admin
  create: create,
  update: update,
  remove: remove,
};

function find(req, res) {
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;
      // Find
      let queryPromise = Review.find(params.query);

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
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else {
          queryPromise = queryPromise.populate(params.populate);
        }
      }

      // Count
      let countPromise = Review.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread((reviews, count) => {

      // See if there's more
      let more = (reviews[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) reviews.splice(params.limit - 1, 1);

      return res.ok({reviews: reviews, more: more, total: count});
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
      let queryPromise = Review.findOne(params.query);

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
    .then((review) => {
      if (!review) throw new Error("ReviewNotFound");

      review.views++;
      review.save();
      res.ok({review: review});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'ReviewNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function findMyUnwriteReivews(req, res) {
  req.buildQuery()
    .then((_params) => {
      return ReviewTransaction.find({
        owner: req.user._id,
        // $or: [
        //   {normalReview: {$exists: false}},
        //   {photoReview: {$exists: false}}
        // ]
      }).populate(['invoice', 'product']);
    })
    .then((reviewTransactions) => {
      let filteredReviewTransactions = _.filter(reviewTransactions, (reviewTransaction) => {
        return reviewTransaction.invoice.orderDoneAt &&
          (!reviewTransaction.normalReview || !reviewTransaction.photoReview);
      });

      res.ok({reviewTransactions: filteredReviewTransactions});
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

function create(req, res) {
  let review;
  req.getParams(["content", "reviewType"])
    .then((_review) => {
      review = _review;

      review.createdBy = req.user._id;
      review.updatedBy = req.user._id;
      review.owner = req.user._id;

      if(req.body.title)
        review.title = req.body.title;

      if (req.body.photo)
        review.photo = req.body.photo;

      review.product = req.body.reviewTransaction.product._id;
      review.invoice = req.body.reviewTransaction.invoice._id;

      //TODO: 1. Review.create
      return Promise.all([Review.create(review), ReviewTransaction.findOne({_id: req.body.reviewTransaction._id})]);
    })
    .spread((review, reviewTransaction) => {
      //TODO: 2. ReviewTransaction update
      if(review.reviewType == 'Normal')
        reviewTransaction.normalReview = review._id;
      else
        reviewTransaction.photoReview = review._id;

      return Promise.all([review, reviewTransaction.save()]);
    })
    .spread((review, reviewTransaction) => {
      //TODO: 3. Point.create
      let point = {};
      if(review.reviewType == 'Normal') {
        point = {
          action : 'NormalReview',
          score: 500,
          owner : req.user._id
        };
      } else if(review.reviewType == 'Photo') {
        point = {
          action : 'PhotoReview',
          score: 1000,
          owner : req.user._id
        };
      }

      return Promise.all([review, Point.create(point), User.findOne({_id: req.user._id})])
    })
    .spread((review, point, user) => {
      //TODO: 4. PointTransaction.create
      user.currentPoint += point.score;

      let pointTransaction = {
        point : point._id,
        owner : req.user._id,
        product : review.product,
        invoice: review.invoice
      };

      return Promise.all([review, PointTransaction.create(pointTransaction), user.save()])
    })
    .spread((review, pointTransaction, user) => {
      res.ok({review: review});
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
      return Review.findOne(query);
    })
    .then(review => {
      if (!review) throw new Error("ReviewNotFound");

      review.lastUpdatedAt = new Date();
      review.updatedBy = req.user._id;

      review.title = req.body.title;
      review.content = req.body.content;
      review.rating = req.body.rating;

      if (req.body.photo)
        review.photo = req.body.photo;

      return review.save();
    })
    .then((review) => {
      return res.ok({review: review});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'ReviewNotFound')
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
      return Review.findOne(query)
    })
    .then(review => {
      if (!review) throw new Error("ReviewNotFound");
      review.isDeleted = true;
      return review.save();
    })
    .then((review) => {
      return res.ok({review: review});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'ReviewNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}