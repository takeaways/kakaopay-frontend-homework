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
    title: {type: String},
    content: {type: String, required: true},
    rating: {type: Number, required: true, default: 0, min: 0, max: 5},
    //후기 타입 (Normal, Photo)
    reviewType: {type: String},
    views: {type: Number, default: 0},
    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
    product: {type: Number, ref: 'Product'},
    //후기에서 어떤 상품의 어떤 옵션 구매하였는지 표시하기 위함 (invoice의 itemList 사용)
    invoice: {type: Number, ref: 'Invoice'},
    photo: {type: Number, ref: 'File'},

    owner: {type: Number, ref: 'User'},
    createdBy: {type: Number, ref: 'User'},
    updatedBy: {type: Number, ref: 'User'}
  },
  cycles: {
    beforeUpdate: function (next) {
      next();
    }
  }
};