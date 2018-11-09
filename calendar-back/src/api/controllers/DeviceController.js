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

let logger = Bifido.logger('DeviceController');

module.exports = {
  // User Or Admin
  register: register,
  update: update,

  // Admin
  pushToDevices: pushToDevices
};

function register(req, res){
  req.getParams(['deviceId', 'platform', 'pushId', 'appVersion'])
    .then((_device) => {
      _device.createdBy = req.user._id;
      _device.updatedBy = req.user._id;
      _device.owner = req.user._id;

      return new Promise((resolve, reject) => {
        Device.findOrCreate({
          deviceId: _device.deviceId,
          owner: req.user._id,
        }, _device, (err, device) => {
          if(err)
            return reject(err);
          else
            return resolve(device);
        });
      })
    })
    .then((device) => {
      device.pushId = req.body.pushId;
      device.appVersion = req.body.appVersion;

      return [device.save(), User.findOne({_id: req.user._id})];
    })
    .spread((device, user) => {
      let index = _.findIndex(user.devices, (deviceId) => {
        return deviceId == device._id;
      });
      if(index <= -1){
        user.devices.push(device._id);
        return Promise.all([device, user.save()]);
      } else {
        return Promise.all([device]);
      }
    })
    .spread((device) => {
      return res.ok({device: device});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'DeviceNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function update(req, res) {
  req.getParams(['deviceId'])
    .then((query) => {
      query.owner = req.user._id;
      return Device.findOne(query);
    })
    .then(function (device) {
      if (!device) throw new Error("DeviceNotFound");

      device.lastUpdatedAt = new Date();
      device.updatedBy = req.user._id;

      device.pushId = req.body.pushId;
      device.platform = req.body.platform;
      device.appVersion = req.body.appVersion;
      device.adminNotification = req.body.adminNotification;
      device.petNotification = req.body.petNotification;
      device.deviceNotification = req.body.deviceNotification;

      return device.save();
    })
    .then(function (device) {
      return res.ok({device: device});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'DeviceNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function pushToDevices(req, res) {
  let title = req.param("title");
  let message = req.param("message");
  let data = req.param("data");
  title = JSON.parse(title);
  message = JSON.parse(message);
  data = JSON.parse(data);

  if (!title || !message) return res.badRequest();

  let params = QueryService.buildQuery(req);
  params.query.adminNotification = true;

  Device.find(params.query)
    .then((devices) => {
      return PushService.sendToDevices(devices, title, message, data);
    })
    .then((result) => {
      return res.ok({message: "Message sent."});
    })
    .catch((err) => {
      logger.log('error', err);
      return res.internalServer();
    });
}