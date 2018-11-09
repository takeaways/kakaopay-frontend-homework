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

let logger = Bifido.logger('UserController');

module.exports = {
  // User Or Admin
  count: count,
  find: find,
  findOne: findOne,
  update: update,
  remove: remove,
  setSmartBifidoSleepInfo: setSmartBifidoSleepInfo,
  toggleActivateUser: toggleActivateUser,

  // Admin
  toggleActivateUserOnlyAdmin: toggleActivateUserOnlyAdmin,
  getUserList: getUserList,
  resetPasswordResetLimit: resetPasswordResetLimit
};

function count(req, res) {
  req.buildQuery()
    .then((params) => {
      return User.count(params.query);
    })
    .then((count) => {
      return res.ok({count: count});
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

function find(req, res) {
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;

      // Find
      let queryPromise = User.find(params.query);

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
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      // Count
      let countPromise = User.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread((users, count) => {

      // See if there's more
      let more = (users[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) users.splice(params.limit - 1, 1);

      return res.ok({users: users, more: more, total: count});
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
      let queryPromise = User.findOne(params.query);

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
    .then(function (user) {
      if (!user) throw new Error("UserNotFound");
      return res.ok({user: user});
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

function update(req, res) {
  req.getParams("_id")
    .then((query) => {
      return User.findOne(query);
    })
    .then((user) => {
      if (!user) throw new Error("UserNotFound");

      user.lastUpdatedAt = new Date();
      user.updatedBy = req.user._id;

      user.role = req.body.role;

      return user.save();
    })
    .then((updatedUser) => {
      return res.ok({user: updatedUser});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'UserNotFound')
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
    .then((removedUser) => {
      return res.ok(removedUser);
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'UserNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function setSmartBifidoSleepInfo(req, res){
  req.user.lastUpdatedAt = new Date();
  req.user.updatedBy = req.user._id;
  req.user.smartBifidoSleepInfo = req.body.smartBifidoSleepInfo;

  req.user.save()
    .then((user) => {
      return res.ok({user: user});
    })
    .catch((err) => {
      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function toggleActivateUser(req, res){
  let identifier = req.body.identifier;
  let currentPassword = req.body.currentPassword;

  User.findOne({identifier: identifier})
    .then((user) => {
      if(!user) throw new Error('UserNotFound');

      return Passport.findOne({owner: user._id, protocol: 'local'})
    })
    .then((passport) => {
      if (!passport) throw new Error("PassportNotFound");

      return Promise.promisify(
        passport.validatePassword.bind(passport))(currentPassword);
    })
    .then((result) => {
      if (!result) throw new Error("InvalidPassword");

      user.lastUpdatedAt = new Date();
      user.updatedBy = req.user._id;

      user.isDeleted = true;
      return user.save();
    })
    .then((updatedUser) => {
      return res.ok({user: updatedUser});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter' || err.message === 'UserNotFound') return res.badRequest();
      if (err.message === 'InvalidPassword') return res.unprocessableEntity();
      if (err.name === 'MongoError' || err instanceof Mongoose.Error) return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function toggleActivateUserOnlyAdmin(req, res){
  let identifier = req.body.identifier;

  User.findOne({identifier: identifier})
    .then((user) => {
      if(!user) throw new Error('UserNotFound');

      user.lastUpdatedAt = new Date();
      user.updatedBy = req.user._id;

      user.isDeleted = !user.isDeleted;
      return user.save();
    })
    .then((updatedUser) => {
      return res.ok({user: updatedUser});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter' || err.message === 'UserNotFound') return res.badRequest();
      if (err.name === 'MongoError' || err instanceof Mongoose.Error) return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function getUserList(req, res){
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;
      delete params.query.isDeleted;

      // Find
      let queryPromise = User.find(params.query);

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
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      // Count
      let countPromise = User.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread((users, count) => {

      // See if there's more
      let more = (users[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) users.splice(params.limit - 1, 1);

      return res.ok({users: users, more: more, total: count});
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

function resetPasswordResetLimit(req, res) {
  req.getParams("_id")
    .then((query) => {
      return User.findOne(query);
    })
    .then((user) => {
      if (!user) throw new Error("UserNotFound");

      user.lastUpdatedAt = new Date();
      user.passwordResetCounter = 0;

      return user.save();
    })
    .then((updatedUser) => {
      return res.ok({user: updatedUser});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'UserNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}