'use strict';

/**
 * Created by PHILIP on 27/06/2017
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & PHILIP - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 27/06/2017
 *
 */

module.exports = {
  autoPK: false,
  autoCreatedBy: false,
  autoUpdatedAt: false,
  disableGlobalSchema: true,
  schema: {
    ipAddress: {type: String},
    method: {type: String},
    url: {type: String},
    body: {type: Object},
    query: {type: Object},
    params: {type: Object},
    type: {type: String},
    duration: {type: Schema.Types.Double}, // in milliseconds

    statusCode: {type: Number},

    owner: {type: Number, ref: 'User'},

    controller: {type: String},
    api: {type: String},

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