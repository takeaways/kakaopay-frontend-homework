'use strict';

/**
 * Created by sungwookim on 27/02/2018
 * As part of bifidoServer
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by sungwookim <ksw1652@gmail.com>, 27/02/2018
 *
 * Updater    수정자 - 작성자이름 27/02/2018
 */

let logger = Bifido.logger('EventController');
let moment = require('moment');

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

      let queryPromise;
      
	    if(params.mode === 'month') {
		    //TODO: mode === 'month'이면 showDate 기준으로 월의 1일 부터 마지막 날까지 쿼링
	    	params.query.startTime = {
	    		"$gte": moment(params.query.showDate).startOf('month').toDate(),
			    "$lte": moment(params.query.showDate).endOf('month').toDate()
		    }
	    } else {
		    //TODO: mode === 'week'이면 showDate 기준으로 주의 첫째 날 부터 마지막 날까지 쿼링
		    params.query.startTime = {
			    $gte: moment(params.query.showDate).startOf('week').toDate(),
			    $lte: moment(params.query.showDate).endOf('week').toDate()
		    }
	    }
	    
	    delete params.query.mode;
	    delete params.query.showDate;
	
	    queryPromise = Event.find(params.query);

      return queryPromise;
    })
    .then(function (events) {
      return res.ok({events: events});
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
  let event;
  req.getParams(["title", "startTime"])
    .then((_event) => {
      event = _event;

      // event.createdBy = req.user._id;
      // event.updatedBy = req.user._id;
      // event.owner = req.user._id;

      return Event.create(event);
    })
    .then((event) => {
      res.ok({event: event});
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

      event.title = req.body.title;
      event.content = req.body.content;
      event.startDate = req.body.startDate;
      event.endDate = req.body.endDate;

      event.thumbnail = req.body.thumbnail;
      event.photo = req.body.photo;

      event.useButton = req.body.useButton;
      event.buttonText = req.body.buttonText;
      event.linkUrl = req.body.linkUrl;

      return event.save();
    })
    .then((event) => {
      return res.ok({event: event});
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
    .then((event) => {
      return res.ok({event: event});
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
