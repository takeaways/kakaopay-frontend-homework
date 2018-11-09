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
  indexes: [
    {field: {identifier: 1}, option: {unique: true}}
  ],
  options: {
    timestamps: {createdAt: 'createdAt'},
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.passwordResetCode;
        delete ret.passwordResetRequestTime;
      }
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.passwordResetCode;
        delete ret.passwordResetRequestTime;

        delete ret.transactionState;
        delete ret.transactionLastModified;

        _.forEach(doc.$$populatedVirtuals, (val, key) => {
          ret[key] = val;
        });
      }
    }
  },
  schema: {
    identifier: {
      type: String, required: true,
      validate: {
        validator: function (v) {
          return v !== 'null';
        },
        message: '{VALUE} is should not be null'
      }
    },

    //카카오 로그인 할 경우
    kakao_id: {type: String},

    //배송지 정보 이외에 일반 회원정보 따로 받기 (네이버아이디로 로그인, 카카오 로그인 고려)
    mobile: {type: String},
    name: {type: String, required: true},
    phone: {type: String},

    /**
     *  deliveryInfo: {
     *    addressInfo: {},
     *    detailAddress: ''
     *  }
     */
    deliveryInfo: {type: Object},
    birth: {type: Date},

    marketingMailAgree: {type: Boolean, default: false},
    marketingSmsAgree: {type: Boolean, default: false},

    termsCheck: {type: Boolean, default: false},
    privacyCheck: {type: Boolean, default: false},

    //샘플 이벤트 응모 여부
    getSampleCheck: {type: Boolean, default: false},
    //추천인 이메일
    recommendUser: {type: String},

    //적립금 percentage --> 일반 회원은 3% //TODO: aftersave로 뺄까?
    accumulatePercentage: {type: Number, default: 3},

    currentPoint: {type: Number, default: 0},

    shoppingCart: [{
      product: {type: Number, ref: 'Product'},
      selectedOptions: {type: Schema.Types.Mixed}
    }],

    // Auth properties
    passwordResetCode: {type: String},
    passwordResetCounter: {type: Number, default: 0},
    passwordResetRequestTime: {type: Number, default: 0},

    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
    role: {type: String, ref: 'Role'},
  },
  virtuals: {
    points: {ref: 'Point', localField: '_id', foreignField: 'owner'},
    passports: {ref: 'Passport', localField: '_id', foreignField: 'owner'},
    requestLogs: {ref: 'RequestLog', localField: '_id', foreignField: 'owner'},
  },

  cycles: {
    beforeSave: function (next) {
      next();
    },
    beforeUpdate: function (next) {
      next();
    },
    afterSave: [],
  }

};