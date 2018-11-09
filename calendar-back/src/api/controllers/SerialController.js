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

let logger = Bifido.logger('SerialController');

module.exports = {
  // User
  count: count,
  find: find,
  findOne: findOne,
  registered: registered,
  cancelRegistered: cancelRegistered,

  // Admin
  create: create,
  multipleCreate: multipleCreate,
  update: update,
  remove: remove
};

function count(req, res) {
  req.buildQuery()
    .then((params) => {
      return Serial.count(params.query);
    })
    .then((count) => {
      return res.ok({count: count});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      res.internalServer();
    });
}

function find(req, res) {
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;

      let queryPromise = Serial.find(params.query);

      // Limit
      if (params.limit && params.limit > 0){
        params.limit++;
        queryPromise = queryPromise.limit(params.limit);
      }

      // Skip
      if (params.skip)
        queryPromise = queryPromise.skip(params.skip);

      // Sort
      if (params.sort)
        queryPromise = queryPromise.sort(params.sort);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      // Count
      let countPromise = Serial.count(params.query);

      return Promise.all([queryPromise, countPromise]);
    })
    .spread((serials, count) => {
      // See if there's more
      let more = (serials[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) serials.splice(params.limit - 1, 1);

      return res.ok({serials: serials, more: more, total: count});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      res.internalServer();
    });
}

function findOne(req, res) {
  req.buildQuery()
    .then((params) => {
      let queryPromise = Serial.findOne(params.query);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      return queryPromise;
    })
    .then((serial) => {
      if (!serial) throw new Error("SerialNotFound");
      res.ok({serial: serial});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'SerialNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function registered(req, res) {
  req.getParams(["serialNumber", "productName"])
    .then((query) => {
      return Serial.findOne(query);
    })
    .then((serial) => {
      if (!serial) throw new Error("SerialNotFound");
      if (serial.registered) throw new Error("AlreadyRegistered");

      serial.lastUpdatedAt = new Date();
      serial.updatedBy = req.user._id;

      serial.status = 'Registered';
      serial.registeredAt = new Date();

      serial.registered = req.user._id;

      return serial.save();
    })
    .then((serial) => {
      return res.ok({serial: serial});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'SerialNotFound')
        return res.badRequest();

      if(err.message === 'AlreadyRegistered') return res.conflict();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function cancelRegistered(req, res){
  req.getParams(["serialNumber", "productName", "registered"])
    .then((query) => {
      return Serial.findOne(query);
    })
    .then((serial) => {
      if (!serial) throw new Error("SerialNotFound");

      serial.lastUpdatedAt = new Date();
      serial.updatedBy = req.user._id;

      serial.status = 'Ready';
      serial.registeredAt = null;
      serial.registered = null;

      return serial.save();
    })
    .then((serial) => {
      return res.ok({serial: serial});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'SerialNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });

}

function create(req, res){
  let serial;
  req.getParams(["serialNumber", "productName"])
    .then((_serial) => {
      serial = _serial;

      serial.createdBy = req.user._id;
      serial.updatedBy = req.user._id;
      serial.owner = req.user._id;

      serial.serialNumber = req.body.serialNumber;
      serial.productName = req.body.productName;
      serial.status = 'Ready';

      return Serial.create(serial);
    })
    .then((createdSerial) => {
      res.ok({serial: createdSerial});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    })
}

function multipleCreate(req, res){
  let serials;
  serials = req.body.serials;

  if(serials.length <= 0) return res.badRequest();

  let createPromises = [];

  _.forEach(serials, (serial) => {
    serial.createdBy = req.user._id;
    serial.updatedBy = req.user._id;
    serial.owner = req.user._id;

    serial.serialNumber = serial.serialNumber;
    serial.productName = serial.productName;
    serial.status = 'Ready';

    createPromises.push(Serial.create(serial));
  });

  Promise.all(createPromises)
    .spread((serials) => {
      return res.ok({message: 'Upload Done'});
    })
    .catch((err) => {
      logger.error(err);

      if(err.message.indexOf('duplicate key'))
        return res.badRequest();

      return res.internalServer();
    })
}

function update(req, res) {
  req.getParams("_id")
    .then((query) => {
      return Serial.findOne(query);
    })
    .then((serial) => {
      if (!serial) throw new Error("SerialNotFound");

      serial.lastUpdatedAt = new Date();
      serial.updatedBy = req.user._id;

      serial.serialNumber = req.body.serialNumber;
      serial.productName = req.body.productName;

      return serial.save();
    })
    .then((serial) => {
      return res.ok({serial: serial});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'SerialNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function remove(req, res) {
  req.getParams("_id")
    .then((query) => {
      return Serial.findOne(query);
    })
    .then((serial) => {
      if (!serial) throw new Error("SerialNotFound");
      serial.isDeleted = true;
      return serial.save();
    })
    .then((serial) => {
      return res.ok({serial: serial});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'SerialNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}