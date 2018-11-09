'use strict';

/**
 * Created by Andy on 7/6/2015
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 7/6/2015
 *
 */

let logger = Bifido.logger('Cross-Origin-Configuration');


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
    // PROD
    // TODO: need to fix this
    logger.log('debug', 'Production');
    // return [
    //   "url",
    // ];
    return true;

  } else {
    logger.log('debug', 'Development');
    return true;
  }
}
