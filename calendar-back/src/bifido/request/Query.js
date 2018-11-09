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


let logger = Bifido.logger('Query');

/**************************
 *     Public Interface
 **************************/

module.exports = {
  buildQuery: buildQuery,
  getParams: getParams,
};

/********************************************************
 *                      Public Methods
 ********************************************************/

function buildQuery() {
  let params;

  return new Promise((resolve, reject) => {
    let query = _.clone(this.query);

    params = {
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
      return reject(new Error("InvalidParameter"));
    }

    params.query = applyPolicy.bind(this)(params.query);

    return resolve(params);
  });
}

function getParams(keys) {
  let query = {};

  return new Promise((resolve, reject) => {
    if (keys) {
      if (typeof keys === "string") {
        if (!this.param(keys)) {
          return reject(new Error("InvalidParameter"));
        }
        query[keys] = this.param(keys);
      } else if (Array.isArray(keys)) {
        _.forEach(keys, (key) => {
          if (!this.param(key)) {
            return reject(new Error("InvalidParameter"));
          }
          query[key] = this.param(key);
        });
      }
    }

    query = applyPolicy.bind(this)(query);

    return resolve(query);
  });
}

function applyPolicy(query) {

  if (this.policyQuery)
    query = _.assign({}, query, this.policyQuery);

  query.isDeleted = false;

  return query;
}

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


