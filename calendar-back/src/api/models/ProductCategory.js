'use strict';

/**
 * Created by sungwookim on 14/03/2018
 * As part of bifidoServer
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by sungwookim <ksw1652@gmail.com>, 14/03/2018
 *
 * Updater    수정자 - 작성자이름 14/03/2018
 */

module.exports = {
  schema: {
    name: {type: String, required: true},

    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },
  },
  cycles: {
    beforeUpdate: function (next) {
      next();
    }
  }
};