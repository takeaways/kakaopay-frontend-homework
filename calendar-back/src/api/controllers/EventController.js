'use strict';
let logger = CalendarServer.logger('EventController');

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
			
			let queryPromise = Event.find(params.query);
			
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
	let event;
	req.getParams(["title", "content", "startDate", "endDate", "thumbnail", "photo"])
		.then((_event) => {
			event = _event;
			
			event.createdBy = req.user._id;
			event.updatedBy = req.user._id;
			event.owner = req.user._id;
			
			if(req.body.useButton)
				event.useButton = req.body.useButton;
			
			if(req.body.buttonText)
				event.buttonText = req.body.buttonText;
			
			if(req.body.linkUrl)
				event.linkUrl = req.body.linkUrl;
			
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
