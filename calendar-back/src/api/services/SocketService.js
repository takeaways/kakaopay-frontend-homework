/**
 * Created by andyshin on 13/04/2017.
 */

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

// Logger
let logger = Bifido.logger('SocketService');

const ROOM_ALL = "notification";

module.exports = {
  init: init,
  sendAll: sendAll,
  sendToUser: sendToUser,
};

function init() {
  Bifido.socket.on('connection', function (socket) {
    // if (socket.request.user && socket.request.user.logged_in) {
    //   console.log(socket.request.user.identifier);
    // }
    // disconnect(socket);
  });
}

function sendAll() {
  Bifido.socket.emit(ROOM_ALL);
}

function sendToUser(userId) {
  Bifido.socket.emit(userId);
}

function disconnect(socket) {
  // socket.on('disconnect', function () {
  // });
}




