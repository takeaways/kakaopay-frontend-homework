'use strict';

/**
 * Created by PHILIP on 02/11/2016
 * As Part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 02/11/2016
 *
 */

/**
 *
 * category: 배너 카테고리로 'WEB' 또는 'STORE' 지정하여 사용
 * url: 배너클릭시 오픈할 웹사이트 url
 * views: 조회수
 * isDeleted: 삭제여부
 * lastUpdatedAt: 최종수정일
 * photo: 배너 이미지
 * owner: 주인
 * createdBy: 생성자
 * updatedBy: 수정자
 */

module.exports = {
  schema: {
    // Properties
    category: {
      type: String,
      required: true,
      enum: ['MAIN_WEB', 'MAIN_MOBILE', 'STORE']
    },

    bannerList: [{
      photo: {type: Number, ref: 'File'},
      linkUrl: {type: String}
    }],

    views: {type: Number, default: 0},
    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
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