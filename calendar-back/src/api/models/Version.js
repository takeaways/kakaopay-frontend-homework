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
 * platform: OS
 * packageName: 패키지명
 * version: 버전
 * isDeleted: 삭제 여부
 * lastUpdatedAt: 최종수정일
 * owner: 주인
 * createdBy: 생성자
 * updatedBy: 수정자
 *
 */

module.exports = {
  disableGlobalSchema: true,
  schema: {

    platform: {type: String, enum: ['Android', 'iOS'], required: true},
    packageName: {type: String, required: true},
    version: {type: String, required: true},

    isDeleted: {type: Boolean, index: true, default: false},

    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

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