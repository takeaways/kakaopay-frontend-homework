'use strict';

/**
 * Created by sungwookim on 09/01/2018
 * As part of bifidoServer
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by sungwookim <ksw1652@gmail.com>, 09/01/2018
 *
 * Updater    수정자 - 작성자이름 09/01/2018
 */

module.exports = {
  schema: {
    // Properties
    name: {type: String, required: true},
    summary: {type: String, required: true},
    soldOut: {type: Boolean, required: true, default: false},
    price: {type: Number, required: true, default: 0},

    salePrice: {type: Number},
    employeePrice: {type: Number},
    isRecommend: {type: Boolean, default: false},
    isHot: {type: Boolean, default: false},

    views: {type: Number, default: 0},
    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
    category: {type: Number, ref: 'ProductCategory'},
    options: [{type: Number, ref: 'Option'}],
    thumnail: {type: Number, ref: 'File'},
    photos: [{type: Number, ref: 'File'}],
    owner: {type: Number, ref: 'User'},
    createdBy: {type: Number, ref: 'User'},
    updatedBy: {type: Number, ref: 'User'}
  },
  virtuals: {
    invoices: {ref: 'Invoice', localField: '_id', foreignField: 'products'},
    // reviews: {ref: 'Review', localField: '_id', foreignField: 'product'}
  },
  cycles: {
    beforeUpdate: function (next) {
      next();
    }
  }
};