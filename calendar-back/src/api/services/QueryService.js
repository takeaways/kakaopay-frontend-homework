'use strict';

/**
 * Created by Andy on 7/6/2015
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 7/6/2015
 *
 */


let logger = Bifido.logger('QueryService');

/**************************
 *     Public Interface
 **************************/

module.exports = {
  buildQuery: buildQuery,
  executeNative: executeNative,
};

/********************************************************
 *                      Public Methods
 ********************************************************/

function buildQuery(req) {
  let query = _.clone(req.query);
  let params = {
    query: {
      isDeleted: false
    }
  };
  params.populate = null;

  try {
    if (query && query.query && typeof query.query === 'string') {
      params.query = _.assign({}, JSON.parse(query.query), params.query);
    }

    if (query.limit)
      params.limit = parseInt(query.limit);

    if (query.skip)
      params.skip = parseInt(query.skip);

    if (query && query.sort && typeof query.sort === 'string')
      params.sort = JSON.parse(query.sort);

    if (query && query.populate && typeof query.populate === 'string') {
      if (isJsonString(query.populate))
        params.populate = JSON.parse(query.populate);
      else
        params.populate = query.populate;
    }

  } catch (e) {
    return res.badRequest();
  }

  return params;
}

function executeNative(Model, queryWrapper, projection) {

  //====================================================
  //                   Native Find
  //
  //              [sort, skip, limit]
  //====================================================

  var query = queryWrapper.query;
  var populate = queryWrapper.populate;

  var sort = query.sort;
  delete query.sort;
  var skip = query.skip;
  delete query.skip;
  var limit = query.limit;
  delete query.limit;

  var ModelNative = Promise.promisify(Model.native);

  return ModelNative()
    .then(function (collection) {

      var collectionQuery = collection
        .find(query, projection);

      // NOTE: count takes query conditions now
      var promise2 = new Promise(function (resolve, reject) {
        collectionQuery.count(function (err, count) {
          if (err) {
            reject(err);
          } else {
            resolve(count);
          }
        });
      });

      if (sort)
        collectionQuery.sort(sort ? JSON.parse(sort) : null);
      if (skip)
        collectionQuery.skip(skip ? parseInt(skip, 10) : 0);
      if (limit)
        collectionQuery.limit(limit ? parseInt(limit, 10) + 1 : 101);

      var promise1 = new Promise(function (resolve, reject) {
        collectionQuery.toArray(function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });

      });

      return [promise1, promise2];
    })
    .spread(function (results, count) {
      if (results && results.length > 0)
        var populatePromise = populateNativeCollection(Model, results, populate);

      return [results, count, populatePromise];
    })
    .spread(function (results, count, populatedResult) {

      var more = false;

      if (limit && results[limit]) {
        more = true;
        results.pop();
      }

      results = _.map(results, function (item) {
        return _.find(populatedResult, {id: item._id.toString()});
      });

      return [results, more, count];
    });
};

function populateNativeCollection(Model, collection, populates) {

  sails.log(collection);

  //====================================================
  //                   Populate Found
  //
  //              Model, collection, populates
  //====================================================

  return new Promise(function (resolve, reject) {

    var ids = _.pluck(collection, "_id");

    var populatePromise = Model.find({id: ids});

    if (populates) {
      _.each(populates, function (populate) {
        populatePromise = populatePromise.populate(populate);
      });
    }

    populatePromise
      .then(function (results) {
        resolve(results);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**************************
 *     Private Methods
 **************************/


