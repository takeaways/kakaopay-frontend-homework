'use strict';

module.exports.models = {
  drop: false,
  // drop: true,

  options: {
    timestamps: {createdAt: 'createdAt'},
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  },

  //GLOBAL SCHEMA
  schema: {
    owner: {type: Number, ref: 'User'},
    createdBy: {type: Number, ref: 'User'},
    updatedBy: {type: Number, ref: 'User'}
  }
};
