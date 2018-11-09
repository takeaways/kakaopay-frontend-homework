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
    {field: {owner: 1}}
  ],

  schema: {

    // Properties
    /**
     * Point Action Type
     * - AfterPayment : 구매 후 등급에 따라 적립
     * - NormalReview : 상품후기(일반)
     * - PhotoReview : 상품후기(포토)
     * - RecommendGiver : 아이디 추천(추천한 사람)
     * - RecommendTaker : 아이디 추천(추천 받은 사람)
     * - Register : 회원가입
     * - PointByAdmin : 관리자 임의 지급
     * - UsePoint : 포인트 사용
     */
    action: {
      type: String,
      enum: ['AfterPayment', 'NormalReview', 'PhotoReview', 'RecommendGiver', 'RecommendTaker', 'Register', 'PointByAdmin', 'UsePoint'],
      required: true
    },
    description: {type: String},
    score: {type: Number, required: true},
    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
    owner: {type: Number, ref: 'User'},
    giver: {type: Number, ref: 'User'}, //추천한 사람
    taker: {type: Number, ref: 'User'}
  },
  virtuals: {},
  cycles: {
    beforeSave: function (next) {
      getDescription(this, next)
    },
    beforeUpdate: function (next) {
      next();
    }
  }
};

function getDescription(model, next) {
  switch (model.action) {
    case 'AfterPayment' :
      model.description = '구매 후 적립';
      break;
    case 'NormalReview' :
      model.description = '상품후기(일반)';
      break;
    case 'PhotoReview' :
      model.description = '상품후기(포토)';
      break;
    case 'RecommendGiver':
      model.description = '아이디 추천(추천한 사람)';
      break;
    case 'RecommendTaker':
      model.description = '아이디 추천(추천 받은 사람)';
      break;
    case 'Register':
      model.description = '회원가입';
      break;
    case 'PointByAdmin':
      model.description = '관리자 임의 지급';
      break;
    case 'UsePoint' :
      model.description = '포인트 사용';
      break;
    default :
      break;
  }

  next(null, model);
}