'use strict'

/**
 * Created by andy on 3/08/15
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 3/08/15
 *
 */

let logger = Bifido.logger('SecurityHook');
let identity = 'Security';
const modelPath = "src/api/models";
const DATA = "src/config/data";


// TODO: need to add validation to only allow server model to be injected
const modelDependencyOrder = [
  "User",
  "Role",
	"Event"
  // "Version",
  //
  // "File",
  //
  // "Device",
  // "Passport",
  // "Post",
  // "RequestLog",
];


module.exports = {
  identity: identity,
  inactive: false,
  afterEvent: "mongoModelLoaded",
  initialise: initialise
};

function initialise(config, next) {
  config = config || {};
  if (typeof config === 'function') {
    next = config;
    config = Bifido.config.security;
  }

  let securityPromise;
  if (Bifido.config.models.drop)
    securityPromise = dropCycle()
    .then(() => {
      return injectModel();
    })
      .then(() => {
        return injectBifidoData();
      })
      .then(() => {
        return autoIncrementFix();
      });
  else
    securityPromise = new Promise.resolve();

  securityPromise
    .then(function () {
      Bifido.event.emit('SecurityHookDone');
      next();
    })
    .catch(function (err) {
      logger.log('error', 'failed to execute SecurityHook:', err);
      next(err);
    });
}

function dropCycle() {
  return new Promise((resolve, reject) => {
    logger.verbose('dropCycle');

    let promises = [];

    promises.push(new Promise((resolve, reject) => {
      Mongoose.connection.db.collection('identitycounters', function (err, collection) {
        if (err) reject(err);
        collection.remove(() => {
          resolve();
        });
      });
    }));

    FileSystem.readdirSync(Bifido.path + modelPath).forEach(function (file) {
      if (file.indexOf('DS_Store') > -1)return;

      let modelName = file.split('.')[0];

      promises.push(Bifido.models[modelName].remove());
    });

    Promise.all(promises)
      .spread(() => {
        resolve();
      })
      .catch((err) => {
        return reject(err);
      });

  });
}

function injectModel() {
  return new Promise((resolve, reject) => {
    logger.verbose('injectModel');

    let modelPromise = new Promise.resolve();
    let promises = [];

    FileSystem.readdirSync(Bifido.path + modelPath).forEach(function (file) {
      if (file.indexOf('DS_Store') > -1)return;

      let modelName = file.split('.')[0];

      let modelToCreate = _.assign({}, {attributes: Bifido.modelDefinitions[modelName].schema});

      promises.push(new Promise(function (resolve, reject) {
        Model.findOrCreate({identity: modelName}, modelToCreate, function (err, resultModel) {
          if (err)
            return reject(err);

          Bifido.modelDefinitions[modelName] = resultModel;
          return resolve(resultModel);
        });
      }));
    });

    modelPromise.then(() => {
      return Promise.all(promises)
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        return reject(err);
      });
  });
}


function injectBifidoData() {
  let dataHolder = {};

  return new Promise((resolve, reject) => {
    logger.verbose('injectServer');

    FileSystem.readdirSync(Bifido.path + DATA).forEach(function (modelConfig) {
      if (modelConfig.indexOf('DS_Store') > -1) return;

      let modelName = modelConfig.split('.')[0];
      dataHolder[modelName] = require(Bifido.path + DATA + '/' + modelConfig);

    });

    createData(dataHolder)
      .then(function () {
        return linkData(dataHolder);
      })
      .then(function () {
        resolve();
      })
      .catch((err) => {
        if (err && err.errors)
          return reject(err.errors);

        return reject(err);
      });
  });
}

function createData(data) {
  return new Promise((resolve, reject) => {

    let createPromise = [];

    _.forEach(modelDependencyOrder, (modelName) => {
      if (!data[modelName]) return;

      _.forEach(data[modelName], (datum) => {
        let dataToCreate = datum.document;

        if (modelName === 'Permission') {
          if (!Bifido.modelDefinitions[datum.document.model])
            logger.log('error', 'Permission data에 model은 필수 입니다.');
          dataToCreate.model = Bifido.modelDefinitions[datum.document.model]._id;
        }

        if (modelName !== 'User') {
          createPromise.push(
            global[modelName].create(dataToCreate)
              .then(createdDatum => datum.document = createdDatum));
        } else {
          createPromise
            .push(PassportService.protocols.local.createUser(dataToCreate)
              .then(createdDatum => datum.document = createdDatum));
        }
      });
    });

    Promise.all(createPromise)
      .spread(() => {
        resolve(data);
      })
      .catch(err => {
        if (err instanceof Mongoose.Error.ValidationError) {
          logger.log('debug', err.message);
          logger.log('debug', JSON.stringify(err.errors));
        } else logger.log('error', err);

        reject(err);
      });
  });
}

function linkData(data) {
  return new Promise((resolve, reject) => {

    let updateLinkPromises = Promise.resolve();

    _.forEach(data, (collection, modelName) => {
      _.forEach(collection, (datum) => {
        _.forEach(datum.vRef, (vRefItem) => {
          if (!data[vRefItem.modelName])
            throw new Error("In Model: " + modelName + " , Item:" + datum.document + " of RefModel: " + vRefItem.modelName + " does not exist");

          let realId;

          if (Array.isArray(vRefItem.vRefValue)) {
            let foundItems = [];

            _.forEach(vRefItem.vRefValue, (vRefValue) => {
              let item = _.find(data[vRefItem.modelName], {vId: vRefValue});
              if (!item)
                throw new Error("In Model: " + modelName + " , Item: " + datum.document + " of RefModel: " + vRefItem.modelName + " with vId: " + vRefValue + " does not exist");
              foundItems.push(item);
              realId = _.map(foundItems, (foundItem) => {
                return foundItem.document._id;
              });
            });

          } else {
            let foundItem = _.find(data[vRefItem.modelName], {vId: vRefItem.vRefValue});
            if (!foundItem)
              throw new Error("In Model: " + modelName + " , Item: " + datum.document + " of RefModel: " + vRefItem.modelName + " with vId: " + vRefItem.vRefValue + " does not exist");
            realId = foundItem.document._id;
          }


          logger.log('silly', "Linking Model:", modelName, "of _id:", datum.document._id, "with RefModel:", vRefItem.modelName, "_id:", realId.toString(), "in Server:", datum.document.server);

          datum.document[vRefItem.propName] = realId;
          updateLinkPromises = updateLinkPromises.then(datum.document.save);
        });
      });
    });

    updateLinkPromises
      .then(() => {
        resolve();
      })
      .catch(err => {
        if (err instanceof Mongoose.Error.ValidationError) {
          logger.log('debug', err.message);
          logger.log('debug', JSON.stringify(err.errors));
        } else {
          logger.log('error', err);
        }

        reject(err);
      });
  });
}


function autoIncrementFix() {
  return new Promise((resolve, reject) => {
    Mongoose.models['IdentityCounter'].find({})
      .then((counters) => {
        let fixPromises = [];

        _.forEach(counters, (counter) => {
          fixPromises.push(Bifido.models[counter.model].findOne().sort({_id: -1})
            .then(data => {
              if (data) {
                counter.count = data._id;

                if (counter.model == "Domain")
                  counter.count += 152941;

                return counter.save();
              }

              return null;
            }));
        });

        return Promise.all(fixPromises);
      })
      .then((result) => {
        resolve();
      })
      .catch(err => {
        return reject(err);
      });
  });
}