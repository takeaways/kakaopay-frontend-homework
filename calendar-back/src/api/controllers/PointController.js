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

module.exports = {
  count: count,
  find: find,
  findOne: findOne,
  getMyPoint: getMyPoint,

  create: create,
  update: update,
  remove: remove,
};

function count(req, res) {
  req.buildQuery()
    .then((params) => {
      return User.count(params.query);
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
      return res.internalServer();
    });
}

function find(req, res) {
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;

      // Find
      let queryPromise = Point.find(params.query);

      // Limit
      if (params.limit > 50)
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
      let countPromise = Point.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread(function (pointers, count) {

      // See if there's more
      let more = (pointers[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) pointers.splice(params.limit - 1, 1);

      return res.ok({pointers: pointers, more: more, total: count});
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
      let queryPromise = Point.findOne(params.query);

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
    .then(function (point) {
      if (!point) throw new Error("PointNotFound");
      return res.ok({point: point});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        ||err.message === 'PointNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function getMyPoint(req, res) {
  req.getParams([])
    .then(() => {
      return PointTransaction.find({owner: req.user._id, isDeleted: false}).populate('point');
    })
    .then(function (pointTransactions) {
      let myPoint = 0;

      _.forEach(pointTransactions, transaction => {
        myPoint += transaction.point.score;
      });

      res.ok({myPoint: myPoint});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      res.internalServer();
    });
}

function create(req, res) {
  let point;
  //TODO: getParams의 파라미터로 owner는 안됨. 왜죠??
  req.getParams(["action", "score", "user"])
    .then((_point) => {
      point = _point;

      //TODO: 아래 action 이외의 것들은 서버에서 직접 Point.create하기 때문에 분기 필요 없음.
      if(point.action === 'PointByAdmin') {
        //PointByAdmin : 관리자 임의 지급
        point.score = req.body.score;
        point.owner = req.body.user;
      }

      return Promise.all([Point.create(point), User.findOne({_id: req.body.user})]);
    })
    .spread(function(point, user) {
      user.currentPoint += point.score;

      let pointTransaction = {
        point : point._id,
        owner : user._id
      };

      return Promise.all([point, PointTransaction.create(pointTransaction), user.save()]);
    })
    .spread(function (point, pointTransaction, user) {
      res.ok({point: point});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      res.internalServer();
    });
}

function update(req, res) {
  req.getParams(["_id", "score"])
    .then((query) => {
      console.log(query);
      return Point.findOne({_id:query._id});
    })
    .then((point) => {
      if (!point) throw new Error("PointNotFound");
      point.lastUpdatedAt = new Date();
      point.score += req.body.score;

      return point.save();
    })
    .then(function (point) {
      return res.ok({point: point});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'PointNotFound')
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
      return User.findOne(query);
    })
    .then((user) => {
      if (!user) throw new Error("UserNotFound");
      user.isDeleted = true;
      return user.save();
    })
    .then(function (removedUser) {
      return res.ok(removedUser);
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'UserNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}