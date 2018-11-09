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
  disabledPlugin: {
    AutoIncrement: true
  },
  disableGlobalSchema: true,
  schema: {
    _id: {type: String, required: true},
    name: {type: String},

    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },
  },
  virtuals: {
    users: {ref: 'User', localField: '_id', foreignField: 'roles'},
  },
  cycles: {
    beforeUpdate: function (next) {
      next();
    }
  }
};