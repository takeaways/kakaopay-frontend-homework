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
      
	    if(params.query.mode === 'month') {
		    //TODO: mode === 'month'이면 showDate 기준으로 월의 1일 부터 마지막 날까지 쿼링
	    	params.query.startTime = {
	    		"$gte": moment(params.query.showDate).startOf('month').toDate(),
			    "$lte": moment(params.query.showDate).endOf('month').toDate()
		    }
	    } else {
		    //TODO: mode === 'week'이면 showDate 기준으로 주의 첫째 날 부터 마지막 날까지 쿼링
		    params.query.startTime = {
			    "$gte": moment(params.query.showDate).startOf('week').toDate(),
			    "$lte": moment(params.query.showDate).endOf('week').toDate()
		    }
	    }
	    
	    delete params.query.mode;
	    delete params.query.showDate;
	
	    queryPromise = Event.find(params.query).sort({startTime: 1});

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
  req.getParams(["title", "startTime", "endTime"])
	  .then((_event) => {
		  event = _event;
		  let query = {
			  startTime: {
				  "$gte": event.startTime,
				  "$lt": event.endTime
			  }
		  };
		  return Event.find(query);
	  })
	  .then((events) => {
		  if(events.length === 0) {
		  	var diff = moment(event.endTime).diff(moment(event.startTime), 'hours');
			  if(diff > 1) {
			  	let eventPromises = [];
			    
			    var time = moment(event.startTime);
			    for(let i = 0; i < diff; i++) {
			    	eventPromises.push(Event.create({
					    title: event.title,
					    startTime: time.toDate()
				    }));
			    	time.add(1, 'hours');
			    }
			    
			    return eventPromises;
			  } else  {
			  	delete event.endTime;
			  	return Event.create(event);
			  }
		  } else
		    throw new Error("EventExist");
	  })
    .then((result) => {
      res.ok({result: result});
    })
    .catch(function (err) {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);
      
      if(err.message === 'EventExist')
      	return res.conflict();

      logger.log('error', err);
      res.internalServer();
    });
}


function update(req, res) {
	let eventParam;
  req.getParams(["_id", "title", "startTime", "endTime"])
    .then((_event) => {
	    eventParam = _event;
    	let query = {
		    startTime: {
			    "$gte": eventParam.startTime,
			    "$lt": eventParam.endTime
		    }
	    };
	    return Event.find(query);
    })
	  .then((events) => {
		  if(events.length === 0) {
			  var diff = moment(eventParam.endTime).diff(moment(eventParam.startTime), 'hours');
			  if(diff > 1) {
				  let eventPromises = [];
				
				  var time = moment(eventParam.startTime);
				  for(let i = 0; i < diff; i++) {
					  eventPromises.push(Event.create({
						  title: eventParam.title,
						  startTime: time.toDate()
					  }));
					  time.add(1, 'hours');
				  }
				
				  return [Event.findOne({_id: eventParam._id}), eventPromises];
			  } else  {
				  return [Event.findOne({_id: eventParam._id}), undefined];
			  }
		  } else
			  throw new Error("EventExist");
	  })
    .spread((event, createdEvents) => {
    	if(createdEvents) {
    		event.isDeleted = true;
		    return event.save();
	    } else {
		    //1시간 단위로 update 한 경우
		    event.title = eventParam.title;
		    event.startTime = eventParam.startTime
		    return event.save();
	    }
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
	
	    if(err.message === 'EventExist')
		    return res.conflict();

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
