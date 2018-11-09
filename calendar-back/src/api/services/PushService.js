'use strict';

/**
 * Created by PHILIP on 02/11/2016
 * As Part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 02/11/2016
 *
 */

let FCM = require('fcm-push');

let logger = Bifido.logger('PushService');
let Promise = require('bluebird');
let async = require('async');

module.exports = {
  sendToTopic: sendToTopic,
  sendToDevices: sendToDevices,
};

function sendToTopic(client, topic, title, message) {
  return new Promise(function (resolve, reject) {
    let fcm = new FCM(Bifido.config.connections.fcm);

    let message = {
      condition: topic, // e.g) 'dogs' in topics || 'cats' in topics
      data: {
        message: title,
        title: title,
        body: message,
        sound: 'default',
        icon: "icon"
      },
      notification: {
        title: title,
        body: message,
        sound: 'default',
        icon: "icon"
      }
    };

    fcm.send(message, function (err, response) {
      if (err)
        reject(err);
      resolve(response);
    })
  });
}

function sendToDevices(devices, title, message, data, collapseKey) {
  return new Promise(function (resolve, reject) {
    collapseKey = collapseKey || 'NEWS_TO_USER';
    let fcm = new FCM(Bifido.config.connections.fcm);
    let pushMessage = {
      collapse_key: collapseKey,
      data: {
        title: title,
        message: message,
        sound: 'default',
        icon: "pushicon"
      },
      notification: {
        title: title,
        body: message,
        sound: 'default',
        icon: "pushicon"
      }
    };
    pushMessage.data = _.assign(pushMessage.data, data);

    let deviceLists = _.groupBy(devices, function (element, index) {
      return Math.floor(index / 1000);
    });

    let pushTask = [];

    _.forEach(deviceLists, function (devices) {
      pushTask.push(devicePushTask.bind(null, fcm, devices, pushMessage));
    });

    async.parallel(pushTask,
      function (err, results) {
        if (err){
          logger.debug(err);
          return reject(err);
        } else {
          logger.debug(results);
          return resolve(results);
        }
      });
  });
}

function devicePushTask(sender, devices, message, callback) {
  message.registration_ids = _.compact(_.map(devices, data => {
    return data.pushId
  }));

  if(message.registration_ids.length <1)
    return callback(null, {});

  sender.send(message,
    (err, response) => {
      if (err)
        return callback(err);

      callback(null, response);
    }
  );
}
