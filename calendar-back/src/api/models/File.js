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
 * url: 보안처리되지 않은 File Url
 * secure_url: 보안처리된 File Url
 * views: 조회수
 * fileType: 파일타입
 * fileName: 파일명
 * fileSize: 파일크기
 * tag: 태그명
 * views: 조회수
 * isDeleted: 삭제 여부
 * lastUpdatedAt: 최종수정일
 *
 */

module.exports = {
  schema: {
    url: {type: String},
    secure_url: {type: String},
    views: {type: Number, default: 0},
    fileType: {type: String},
    fileName: {type: String},
    fileSize: {type: Number},

    tag: {type: String},

    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    }
  },
  cycles: {
    beforeUpdate: function (next) {
      next();
    }
  }
};