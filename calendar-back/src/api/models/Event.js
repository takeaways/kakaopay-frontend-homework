'use strict';

let moment = require('moment');

module.exports = {
  schema: {
    // Properties
    title: {type: String, required: true},
    
	  
    
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
    },
  }
};