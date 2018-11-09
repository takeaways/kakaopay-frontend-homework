'use strict';

/**
 * Created by sungwooKIM on 7/25/2016
 * As part of Appzet
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & sungwooKIM - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy sungwooKIM <ksw1652@gmail.com>, 7/25/2016
 *
 */

module.exports = {
  schema: {

    // Properties
    // 뉴스, 공지사항, 자주 묻는 질문, 1:1 문의, 1:1 문의 답변, 헬스 칼럼, 영상 컨텐츠
    // news, notice, faq, contact, answer, article, playg
    category: {type: String},
    title: {type: String},
    content: {type: String},

    /**
     * For News
     */
    source: {type: String},       //뉴스 출처
    reportedDate: {type: Date},   //뉴스 작성일

    /**
     * For Health Column
     */
    columnCategory: {type: String},     //헬스 칼럼 카테고리

    /**
     * For Common
     */
    useButton: {type: Boolean},
    buttonText: {type: String},
    linkUrl: {type: String},      //뉴스 링크 or PLAY-G 유투브 링크

    /**
     * For Contact
     */
    isSecret: {type: Boolean},

    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
    thumnail: {type: Number, ref: 'File'},     //헬스 칼럼 아이콘 or PLAY-G 썸네일
    photos: [{type: Number, ref: 'File'}],
    answer: {type: Number, ref: 'Post'},    //1:1문의 답변
    owner: {type: Number, ref:'User'},
  },
  beforeUpdate: function (next) {
    next();
  }
};