'use strict';

let logger = CalendarServer.logger('EventService');
let moment = require('moment');

module.exports = {
  orderStatus: orderStatus,
  setQueryOptions: setQueryOptions
};

/**
 * 이벤트는 응모이벤트와 일반이벤트가 있으며, 임박/진행중/만료/종료순으로 정렬해야합니다.
 * 아래 orderStatus는 위 내용에 맞게 작성되었습니다.
 */
function orderStatus(params){
  return new Promise((resolve, reject) => {
    let today = moment().format();
    let endingSoon = moment(today).add(3, 'days').format();
    let ids = [];
    let query = params.query;
    query.endDate = {"$gt": today, "$lt": endingSoon};

    if(params.ids){
      if(typeof params.ids === 'string'){
        params.ids = params.ids.split(',');
      }
      ids = params.ids;
      query._id = {$nin: params.ids}
    }

    let queryPromise = Event.find(query);
    setQueryOptions(queryPromise, params);

    queryPromise
      .then(function(events){

        if(events.length < params.limit){
          ids = _.concat(ids, _.map(events, '_id'));
          query._id = {$nin: ids};
          query.endDate = {"$gt": today};
          queryPromise = Event.find(query);
          setQueryOptions(queryPromise, params);

          return Promise.all([events, queryPromise])
        } else {
          return Promise.all([events]);
        }
      })
      .spread(function(events, startEvents){
        if(events.length < params.limit){
          if(startEvents) {
            events = _.concat(events, startEvents);
          }

          ids = _.concat(ids, _.map(events, '_id'));
          query._id = {$nin: ids};
          query.endDate = {"$lt": today};
          queryPromise = Event.find(query);
          setQueryOptions(queryPromise, params);

          return Promise.all([events, queryPromise]);
        } else {
          return Promise.all([events]);
        }
      })
      .spread(function(events, expiredEvents){
        if(events.length < params.limit){
          if(expiredEvents) {
            events = _.concat(events, expiredEvents);
          }

          ids = _.concat(ids, _.map(events, '_id'));
          query._id = {$nin: ids};
          query.winners = {$not: {$size: 0}};
          delete query.endDate;
          queryPromise = Event.find(query);
          setQueryOptions(queryPromise, params);

          return Promise.all([events, queryPromise]);
        } else {
          return Promise.all([events]);
        }
      })
      .spread(function(events, endEvents){
        if(events.length < params.limit){
          if(endEvents){
            events = _.concat(events, endEvents);
          }
        }
        resolve(events);
      })
      .catch(function(err){
        logger.log('error',err);
        reject(err);
      });
  })
}

function setQueryOptions(queryPromise, params){

  // Limit
  if (!params.limit || params.limit > 50){
    params.limit = 50;
  }
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
}