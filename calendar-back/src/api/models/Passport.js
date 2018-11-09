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

let bcrypt = require('bcryptjs');
let logger = Bifido.logger('Passport');

function hashPassword(passport, next) {
  if (passport.password) {
    let t0 = new Date().valueOf();
    bcrypt.hash(passport.password, 13, function (err, hash) {
      if (err) {
        logger.log('error', err);
        throw err;
      }
      passport.password = hash;
      let t1 = new Date().valueOf();
      logger.silly('hashed password for user in', (t1 - t0), 'ms');
      next(null, passport);
    });
  }
  else {
    next(null, passport);
  }
}

module.exports = {
  // Extend with custom logic here by adding additional fields, methods, etc.
  options: {
    timestamps: {createdAt: 'createdAt'},
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.accessToken;
        delete ret.password;
        delete ret.deviceId;
        delete ret.tokens;
        return ret;
      }
    }
  },
  schema: {
    accessToken: {type: String},
    protocol: {type: String},
    password: {type: String, minLength: 4},
    deviceId: {
      type: String,
      validate: {
        validator: function (v) {
          return v !== 'null';
        },
        message: '{VALUE} is should not be null'
      }
    },

    // bifido
    provider: {type: String, default: "bifido"},
    identifier: {type: String},
    tokens: {type: Object},
    refreshToken: {type: String},

    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
  },

  cycles: {
    beforeSave: [function (next) {
      hashPassword(this, next);
    }],
    beforeUpdate: function (next) {
      hashPassword(this, next);
    }
  },

  methods: {
    validatePassword: function (password, next) {
      bcrypt.compare(password, this.password, next);
    },
  },

};
