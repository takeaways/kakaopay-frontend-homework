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

let passport = require("../api/services/PassportService");
let passportSocketIo = require('passport.socketio');
let cookieParser = require('cookie-parser');
let sessionConfig = require('./sessions');
let connectionConfig = require('./connections');
let ioAdapter = require('socket.io-adapter-mongo');

let middle = passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'connect.sid',
  secret: sessionConfig.sessions.secret,
  store: sessionConfig.sessions.store,
  passport: passport,
  // success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
  // fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
});


module.exports.socket = {
  options: {
    origins:
    'localhost:* ' +
    'http://localhost:3333:* ' +
    'http://localhost:3334:* ' +
    'http://localhost:3335:* ' +
    'http://localhost:8002:*'
    // origins: '*.*'
  },
  // adapter: ioAdapter(connectionConfig.connections.mongoDb.url),
  middlewares: [
    middle
  ]
};


function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');

  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);

  // OR

  // If you use socket.io@1.X the callback looks different
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  if (error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);

  // We use this callback to log all of our failed connections.
  accept(null, false);

  // OR

  // If you use socket.io@1.X the callback looks different
  // If you don't want to accept the connection
  if (error)
    accept(new Error(message));
  // this error will be sent to the user as a special error-package
  // see: http://socket.io/docs/client-api/#socket > error-object
}

