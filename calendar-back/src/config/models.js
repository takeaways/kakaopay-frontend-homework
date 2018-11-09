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

module.exports.models = {
  // drop: true,
  drop: false,

  options: {
    timestamps: {createdAt: 'createdAt'},
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  },

  //GLOBAL SCHEMA
  schema: {
    owner: {type: Number, ref: 'User'},
    createdBy: {type: Number, ref: 'User'},
    updatedBy: {type: Number, ref: 'User'}
  }
};
