'use strict';

module.exports = {
  initialise: function () {
    mongoose.Promise = Promise;
  }
};
