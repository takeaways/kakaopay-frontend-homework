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
 * platform: 등록된 핸드폰 OS 'iOS' 또는 'Android'
 * deviceId: 등록된 핸드폰 ID
 * appVersion: 등록된 핸드폰에서 최종 앱버전
 * pushId: FCM을 통하여 PushMessage 전송시 쓰여지는 PushID
 * adminNotification: 관리자 PushMessage 허용 여부
 * petNotification: 반려견 PushMessage 허용 여부
 * deviceNotification: 노즈워크기기 관련 PushMessage 허용 여부
 * isDeleted: 삭제 여부
 * lastUpdatedAt: 최종수정일
 * owner: 주인
 * createdBy: 생성자
 * updatedBy: 수정자
 *
 */

module.exports = {
  schema: {
    // Device Info
    platform: {type: String, enum: ['iOS', 'Android']},
    deviceId: {type: String, required: true},
    appVersion: {type: String},

    // Push
    pushId: {type: String},
    adminNotification: {type: Boolean, default: true},
    petNotification: {type: Boolean, default: true},
    deviceNotification: {type: Boolean, default: true},

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