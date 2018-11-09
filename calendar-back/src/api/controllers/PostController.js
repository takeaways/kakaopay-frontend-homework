'use strict';

/**
 * Created by Andy on 7/8/2015
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 7/8/2015
 *
 */

let logger = Bifido.logger('PostController');

module.exports = {
  // public (서버)
  count: count,
  find: find,
  findOne: findOne,

  // 앱젯 사용자 주인
  create: create,
  update: update,
  remove: remove,
};

function count(req, res) {
  req.buildQuery()
    .then((params) => {
      return Post.count(params.query);
    })
    .then(function (count) {
      return res.ok({count: count});
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

function find(req, res) {
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;

      let queryPromise = Post.find(params.query);

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
      let countPromise = Post.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread(function (posts, count) {

      // See if there's more
      let more = (posts[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) posts.splice(params.limit - 1, 1);

      return res.ok({posts: posts, more: more, total: count});
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
      let queryPromise = Post.findOne(params.query);

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
    .then(function (post) {
      if (!post) throw new Error("PostNotFound");
      res.ok({post: post});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'PostNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}


function create(req, res) {
  let post;
  req.getParams(["category"])
    .then((_post) => {
      post = _post;

      post.createdBy = req.user._id;
      post.updatedBy = req.user._id;
      post.owner = req.user._id;

      if(req.body.title)
        post.title = req.body.title;
      if(req.body.content)
        post.content = req.body.content;

      /**
       * For News
       */
      if(req.body.source)
        post.source = req.body.source;
      if(req.body.reportedDate)
        post.reportedDate = req.body.reportedDate;

      /**
       * For Health Column
       */
      if(req.body.columnCategory)
        post.columnCategory = req.body.columnCategory;

      /**
       * For Common
       */
      if(req.body.useButton != null)
        post.useButton = req.body.useButton;
      if(req.body.buttonText)
        post.buttonText = req.body.buttonText;
      if(req.body.linkUrl)
        post.linkUrl = req.body.linkUrl;
      if(req.body.thumnail)
        post.thumnail = req.body.thumnail;
      if(req.body.photos)
        post.photos = req.body.photos;

      /**
       * For Contact
       */

      post.isSecret = req.body.isSecret;

      return Post.create(post);
    })
    .then((post) => {
      res.ok({post: post});
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
      return Post.findOne(query);
    })
    .then(post => {
      if (!post) throw new Error("PostNotFound");

      post.lastUpdatedAt = new Date();
      post.updatedBy = req.user._id;

      post.category = req.body.category;
      post.title = req.body.title;
      post.content = req.body.content;

      /**
       * For News
       */
      if(req.body.source)
        post.source = req.body.source;
      if(req.body.reportedDate)
        post.reportedDate = req.body.reportedDate;

      /**
       * For Health Column
       */
      if(req.body.columnCategory)
        post.columnCategory = req.body.columnCategory;

      /**
       * For Common
       */
      if(req.body.useButton != null)
        post.useButton = req.body.useButton;
      if(req.body.buttonText)
        post.buttonText = req.body.buttonText;
      if(req.body.linkUrl)
        post.linkUrl = req.body.linkUrl;
      if(req.body.thumnail)
        post.thumnail = req.body.thumnail;
      if(req.body.photos)
        post.photos = req.body.photos;

      /**
       * For Contact
       */
      if(req.body.answer)
        post.answer = req.body.answer;

      if(req.body.category == 'contact')
        post.isSecret = req.body.isSecret;

      return post.save();
    })
    .then((post) => {
      return res.ok({post: post});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'PostNotFound')
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
      return Post.findOne(query);
    })
    .then(post => {
      if (!post) throw new Error("PostNotFound");
      post.isDeleted = true;
      return post.save();
    })
    .then((post) => {
      return res.ok({post: post});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'PostNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}
