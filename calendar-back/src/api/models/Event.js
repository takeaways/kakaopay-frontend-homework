'use strict';

let moment = require('moment');

module.exports = {
  options: {
    toJSON: {
      transform: function(doc, ret, options){
        ret.status = getEventStatus(doc.startDate, doc.endDate, doc.category, doc.winners);
        return ret;
      },
      virtuals: true
    },
    toObject: {
      transform: function(doc, ret, options){
        ret.status = getEventStatus(doc.startDate, doc.endDate, doc.category, doc.winners);
        return ret;
      },
      virtuals: true
    }
  },

  schema: {

    // Properties
    category: {type: String, enum: ['Normal', 'Admission'], default: 'Normal'},
    title: {type: String, required: true},
    contentHtml: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    notification: {type: String},

    commentsCount: {type: Number, default: 0},
    admissionsCount: {type: Number, default: 0},
    views: {type: Number, default: 0},

    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
    photos: [{type: Number, ref: 'File'}],
    result: {type: Number, ref: 'Post'},
    winners: [{type: Number, ref: 'EventAdmission'}]
  },
  virtuals: {
    applicants: {ref: 'EventAdmission', localField:'_id', foreignField: 'event'}
  },
  cycles: {
    beforeSave: function (next) {
      next();
    },
    beforeUpdate: function (next) {
      next();
    },
  },

  //mongoose에서 schema에 function을 사용하고 싶으면? --> statics와 methods 사용
  //methods와 statics은 자바의 일반 method와 static 메소드라 생각하면 됨.
  //--> 리턴받은 결과에서 function을 사용하고 싶다면 methods를 사용하고, 전역으로 사용하고 싶다면 statics를 사용 할 것.
  statics: {
    getEventStatus: getEventStatus
  },
  methods: {
    getEventStatus: instanceGetEventStatus
  }
};

function instanceGetEventStatus(){
  return getEventStatus(this.startDate, this.endDate, this.category, this.winners);
}

function getEventStatus(startDate, endDate, category, winners){
  let today = moment();

  if(endDate){
    if(category == 'Admission' && winners.length > 0){
      return 'End';
    } else {
      if(today.isAfter(moment(startDate))){
        if(today.isSameOrBefore(moment(endDate))){
          let beforeDays = moment(endDate).subtract(3, 'days');
          if(moment(today).isBetween(beforeDays, moment(endDate))){
            // 이벤트 종료임박
            return 'Ending Soon';
          } else {
            // 이벤트 진행중
            return 'Start';
          }
        } else {
          // 이벤트 기간 만료
          return 'Expired';
        }
      } else {
        // 이벤트 준비중
        return 'Ready';
      }
    }
  } else {
   if(category == 'Normal'){
     // 무기한 이벤트
     return 'Start';
   } else {
     return res.internalServer();
   }
  }
}