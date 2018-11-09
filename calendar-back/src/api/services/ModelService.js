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

let pluralize = require('pluralize');

module.exports = {
  /**
   * Return the type of model acted upon by this request.
   */
  getTargetModelName: function (req) {
    //
    // TODO there has to be a more sails-y way to do this without including
    // external modules
    if (_.isString(req.options.alias)) {
      logger.silly('singularizing', req.options.alias, 'to use as target model');
      return pluralize.singular(req.options.alias);
    } else if (_.isString(req.options.model)) {
      return req.options.model;
    } else {
      return req.model && req.model.identity;
    }
  }
};
