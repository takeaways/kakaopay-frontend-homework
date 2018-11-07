'use strict';

let logger = CalendarServer.logger('User');

module.exports = {
  indexes: [
    {field: {identifier: 1}, option: {unique: true}}
  ],
  options: {
    timestamps: {createdAt: 'createdAt'},
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.emailConfirmed;
        delete ret.activationCode;
        delete ret.activationRequestTime;

        delete ret.passwordResetCode;
        delete ret.passwordResetRequestTime;
      }
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.activationCode;
        delete ret.activationRequestTime;

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
    // 사용자 정보
    identifier: {
      type: String, required: true,
      validate: {
        validator: function (v) {
          return v !== 'null';
        },
        message: '{VALUE} is should not be null'
      }
    },

    emails: [{type: String, default: []}],


    phone: {
      type: String,
      match: [
        /^\d+$/,
        '{PATH} \'{VALUE}\' is not valid. Use only letters, numbers, underscore or dot.'
      ],
    },

    fullName: {type: String},
    firstName: {type: String},
    middleName: {type: String},
    lastName: {type: String},

    gender: {type: String, enum: ['', '남자', '여자'], default: ''},
    birthYear: {type: Number},
    height: {type: Number},
    weight: {type: Number},
    diabetes: {type: String, enum: ['', '예', '아니오'], default: ''},

    notes: {type: String},

    address: {type: String},
    addressDetail: {type: String},
    companyName: {type: String},


    age: {type: String, enum: ['10대', '20대', '30대', '40대', '50대', 'Unknown'], default: 'Unknown'},

    receiveEmail: {type: Boolean, default: true},
    receiveSms: {type: Boolean, default: true},
    receivePush: {type: Boolean, default: true}, // For future reference!!

    isPosUser: {type: Boolean, default: false},
    isWebUser: {type: Boolean, default: false},
    isPreviewUser: {type: Boolean, default: false},

    geoJSON: {type: Object},

    // Notification counts
    notificationCounts: {type: Number, default: 0},
    newNotification: {type: Boolean, default: false},

    // Auth properties
    // Email Activation
    emailConfirmed: {type: Boolean, default: false},    // 이메일 인증여부
    activationCode: {type: String},                     // 이메일 인증코드
    activationCounter: {type: Number, default: 0},      // 이메일 인증 요청 횟수 max = 5
    activationRequestTime: {type: Number, default: 0},  // 마지막 이메일 인증 요청 시간

    passwordResetCode: {type: String},                    // 비밀번호 찾기 코드
    passwordResetCounter: {type: Number, default: 0},     // 비밀번호 찾기 요청 횟수 max = 5
    passwordResetRequestTime: {type: Number, default: 0}, // 마지막 비밀번호 찾기 요청 시간

    accesscount: {type: Number, default: 0},

    // Application passcode
    passcodeTryCount: {type: Number, default: 0},
    passcodeTryRequestedAt: {type: Date, default: Date.now},
    passcodeTryLimit: {type: Number, default: 3 * 60},//second

    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Transactional request property
    transactionState: {type: String, enum: ['Ready', 'Pending'], default: 'Ready'},
    transactionLastModified: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
    photos: [{type: Number, ref: 'File'}],
    role: {type: String, ref: 'Role'},
  },
  virtuals: {
    clients: {ref: 'Client', localField: '_id', foreignField: 'owner'},
    notificationInboxes: {ref: 'NotificationInbox', localField: '_id', foreignField: 'owner'},
    addresses: {ref: 'Address', localField: '_id', foreignField: 'owner'},
    comments: {ref: 'Comment', localField: '_id', foreignField: 'owner'},
    couponIssueds: {ref: 'CouponIssued', localField: '_id', foreignField: 'owner'},
    creditCards: {ref: 'CreditCard', localField: '_id', foreignField: 'owner'},
    devices: {ref: 'Device', localField: '_id', foreignField: 'owner'},
    eventAdmissions: {ref: 'EventAdmission', localField: '_id', foreignField: 'owner'},
    orders: {ref: 'Order', localField: '_id', foreignField: 'owner'},
    passports: {ref: 'Passport', localField: '_id', foreignField: 'owner'},
    payments: {ref: 'Payment', localField: '_id', foreignField: 'owner'},
    permissions: {ref: 'Permission', localField: '_id', foreignField: 'user'},
    posts: {ref: 'Post', localField: '_id', foreignField: 'owner'},
    stampCollections: {ref: 'StampCollection', localField: '_id', foreignField: 'owner'},
    subscriptions: {ref: 'Subscription', localField: '_id', foreignField: 'owner'},
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