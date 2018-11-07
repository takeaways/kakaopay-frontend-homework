'use strict';

let logger = CalendarServer.logger('Cross-Origin-Configuration');


module.exports.cors = {
  server: {
    "origin": serverWhitelist(),
    "methods": ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    "preflightContinue": false,
    "allowedHeaders": ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    "credentials": true,
    // exposedHeaders: '*',
    // maxAge: '*',
    // preflightContinue: '*',
  }
};

function serverWhitelist() {
  if (process.env.NODE_ENV === 'production') {
    logger.log('debug', 'Production');
    return true;
  } else {
    logger.log('debug', 'Development');
    return true;
  }
}
