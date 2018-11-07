'use strict';

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
  }
};