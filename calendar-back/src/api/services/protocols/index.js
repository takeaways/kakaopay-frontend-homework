'use strict';

module.exports = {
  local: require('./local'),
  basic: require('./basic'),
  bearer: require('./bearer'),
  oauth: require('./oauth'),
  oauth2: require('./oauth2'),
  openid: require('./openid')
};
