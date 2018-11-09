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

let logger = Bifido.logger('Bootstrap');
let mosca = require('mosca');
let moment = require('moment');

module.exports.bootstrap = function (callback) {
  SocketService.init();
  MailService.init();
  TransactionService.init();

  let folders = ['uploads'];

  folders.forEach((folder) => {
    if (!FileSystem.existsSync(folder)) {
      FileSystem.mkdirSync(folder);
    }
  });

  callback();
};