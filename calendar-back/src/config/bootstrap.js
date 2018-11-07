'use strict';

let logger = CalendarServer.logger('Bootstrap');

module.exports.bootstrap = function (callback) {
	let folders = ['uploads'];

  folders.forEach((folder) => {
    if (!FileSystem.existsSync(folder)) {
      FileSystem.mkdirSync(folder);
    }
  });

  callback();
};