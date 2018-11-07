'use strict';

let logger = CalendarServer.logger('EventController');
let moment = require('moment');

module.exports = {
  // public
  findForOrderStatus: findForOrderStatus,
  count: count,
  find: find,
  findOne: findOne,

  // 앱젯 사용자 (서버)
  create: create,
  update: update,
  remove: remove,
};


function findForOrderStatus(req, res) {
  let params = QueryService.buildQuery(req);
  params.ids = req.query.ids;

  params.query.startDate = {"$lt": moment().format()};
  let countPromise = Event.count(params.query);

  Promise.all([EventService.orderStatus(params), countPromise])
    .spread(function (events, count) {
      ++params.limit;
      // See if there's more
      let more = (events[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) events.splice(params.limit - 1, 1);

      return res.ok({events: events, more: more, total: count});
    })
    .catch(function (err) {
      logger.log('error', err);
      return res.internalServer();
    });
}

function count(req, res) {
  req.buildQuery()
    .then((params) => {
      return Event.count(params.query);
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

      // Find
      let queryPromise = Event.find(params.query);

      EventService.setQueryOptions(queryPromise, params);

      // Count
      let countPromise = Event.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread(function (events, count) {
      // See if there's more
      let more = (events[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) events.splice(params.limit - 1, 1);

      return res.ok({events: events, more: more, total: count});
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
      let queryPromise = Event.findOne(params.query);

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
    .then(function (event) {
      if (!event) throw new Error("EventNotFound");
      res.ok({event: event});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'EventNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}


function create(req, res) {
  req.getParams(["title"])
    .then((event) => {
      event.createdBy = req.user._id;
      event.updatedBy = req.user._id;
      event.owner = req.user._id;

      event.category = req.body.category;
      event.title = req.body.title;
      event.contentHtml = req.body.contentHtml;
      event.startDate = req.body.startDate;
      event.endDate = req.body.endDate;
      event.notification = req.body.notification;
      event.photos = req.body.photos;

      return Event.create(event);
    })
    .then(function (event) {
      return res.ok({event: event})
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
      return Event.findOne(query);
    })
    .then(event => {
      if (!event) throw new Error("EventNotFound");

      event.lastUpdatedAt = new Date();
      event.updatedBy = req.user._id;

      if (req.body.title)
        event.title = req.body.title;
      if (req.body.category)
        event.category = req.body.category;
      if (req.body.contentHtml)
        event.contentHtml = req.body.contentHtml;
      if (req.body.startDate)
        event.startDate = req.body.startDate;
      if (req.body.endDate)
        event.endDate = req.body.endDate;
      if (req.body.notification)
        event.notification = req.body.notification;
      if (req.body.photos)
        event.photos = req.body.photos;

      return event.save();
    })
    .then(function (result) {
      return res.ok(result);
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'EventNotFound')
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
      return Event.findOne(query);
    })
    .then(event => {
      if (!event) throw new Error("EventNotFound");

      event.isDeleted = true;
      return event.save();
    })
    .then(function (result) {
      return res.ok(result);
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter'
        || err.message === 'EventNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}
