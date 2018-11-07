'use strict';

let logger = CalendarServer.logger('UserController');

module.exports = {
  // 앱젯 사용자 (서버)
  getCustomerStat: getCustomerStat,

  // 앱젯 사용자 (서버) or 앱젯 관리자
  count: count,
  find: find,
  findOne: findOne,

  // 앱젯 관리자
  resetLoginLimit: resetLoginLimit,
  resetEmailConfirmLimit: resetEmailConfirmLimit,
  resetPasswordResetLimit: resetPasswordResetLimit,

  create: create,
  update: update,
  remove: remove,
};

function getCustomerStat(req, res) {
  req.getParams("_id")
    .then((query) => {
      return User.findOne(query)
        .populate('devices');
    })
    .then((user) => {
      if (!user) throw new Error("UserNotFound");

      let lastMonth = Moment().subtract(1, 'months');
      let lastMonthQuery = {
        createdAt: {
          "$gte": lastMonth.startOf('month').toDate(),
          "$lte": lastMonth.endOf('month').toDate()
        }
      };

      let thisMonthQuery = {
        createdAt: {
          "$gte": Moment().startOf('month').toDate(),
          "$lte": Moment().endOf('month').toDate()
        }
      };

      let totalQuery = {};

      let deviceId = '';

      if (user.devices && user.devices[0])
        deviceId = user.devices[0]._id;

      return [
        AnalyticService.firstVisit(user._id),
        AnalyticService.visit(user._id, deviceId, lastMonthQuery),
        AnalyticService.visit(user._id, deviceId, thisMonthQuery),
        AnalyticService.visit(user._id, deviceId, totalQuery),
        Stamp.count({
          owner: user._id,
        }),
        CouponIssued.count({
          owner: user._id,
        })
      ]
    })
    .spread((firstVisit, lastMonthVisits, thisMonthVisits, totalVisits, totalStamps, couponUsed) => {

      let resData = {};

      resData.firstVisit = firstVisit;
      resData.lastMonthVisits = lastMonthVisits;
      resData.thisMonthVisits = thisMonthVisits;
      resData.totalVisits = totalVisits;
      resData.totalStamps = totalStamps;
      resData.couponUsed = couponUsed;

      return res.ok(resData);
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
          _.forEach(params.populate, function (populate) {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      // Count
      let countPromise = User.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread(function (users, count) {

      // See if there's more
      let more = (users[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) users.splice(params.limit - 1, 1);

      return res.ok({users: users, more: more, total: count});
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


function resetLoginLimit(req, res) {
  req.getParams("_id")
    .then((query) => {
      return User.findOne(query);
    })
    .then((user) => {
      if (!user) throw new Error("UserNotFound");

      user.lastUpdatedAt = new Date();
      user.accesscount = 0;

      return user.save();
    })
    .then(function (updatedUser) {
      return res.ok({user: updatedUser});
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

function resetEmailConfirmLimit(req, res) {
  req.getParams("_id")
    .then((query) => {
      return User.findOne(query);
    })
    .then((user) => {
      if (!user) throw new Error("UserNotFound");

      user.lastUpdatedAt = new Date();
      user.activationCounter = 0;

      return user.save();
    })
    .then(function (updatedUser) {
      return res.ok({user: updatedUser});
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
    .then(function (updatedUser) {
      return res.ok({user: updatedUser});
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

function create(req, res) {
  PassportService.protocols.local.register(req.body.identifier, req.body.password)
    .then((user) => {

      user.lastUpdatedAt = new Date();
      user.updatedBy = req.user._id;

      if (typeof req.body.phone != 'undefined')
        user.phone = req.body.phone;
      if (typeof req.body.fullName != 'undefined')
        user.fullName = req.body.fullName;
      if (typeof req.body.gender != 'undefined')
        user.gender = req.body.gender;
      if (typeof req.body.birthYear != 'undefined')
        user.birthYear = req.body.birthYear;
      if (typeof req.body.height != 'undefined')
        user.height = req.body.height;
      if (typeof req.body.weight != 'undefined')
        user.weight = req.body.weight;
      if (typeof req.body.diabetes != 'undefined')
        user.diabetes = req.body.diabetes;

      return user.save();
    })
    .then((user) => {
      res.ok({user: user});
    })
    .catch(err => {
      if (err.message === "NoPassword"
        || err.message === "InvalidPassword") return res.badRequest();

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

      if (typeof req.body.identifier != 'undefined')
        user.identifier = req.body.identifier;
      if (typeof req.body.phone != 'undefined')
        user.phone = req.body.phone;
      if (typeof req.body.fullName != 'undefined')
        user.fullName = req.body.fullName;
      if (typeof req.body.gender != 'undefined')
        user.gender = req.body.gender;
      if (typeof req.body.birthYear != 'undefined')
        user.birthYear = req.body.birthYear;
      if (typeof req.body.height != 'undefined')
        user.height = req.body.height;
      if (typeof req.body.weight != 'undefined')
        user.weight = req.body.weight;
      if (typeof req.body.diabetes != 'undefined')
        user.diabetes = req.body.diabetes;

      return user.save();
    })
    .then(function (updatedUser) {
      return res.ok({user: updatedUser});
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