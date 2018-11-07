'use strict'

let logger = CalendarServer.logger('SecurityHook');
let identity = 'Security';
const modelPath = "src/api/models";
const APPZET_DATA = "src/config/data";


// TODO: need to add validation to only allow server model to be injected

const modelInsert = [
  // "User",
  // "Role",
  //
  // "File",
  //
  // "Device",
  // "Passport",
  // "Post",
  // "RequestLog",
  "BodyType",
];

const modelDependencyOrder = [
  // "User",
  // "Role",
  //
  // "File",
  //
  // "Device",
  // "Passport",
  // "Post",
  // "RequestLog",
  "BodyType",
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
    config = CalendarServer.config.security;
  }

  let securityPromise;
  if (CalendarServer.config.models.drop) {
    securityPromise = dropCycle()
      .then(() => {
        return injectCalendarServerData();
      })
      .then(() => {
        return autoIncrementFix();
      });

    // securityPromise = injectCalendarServerData()
    //   .then(() => {
    //     return autoIncrementFix();
    //   });
  } else {
    securityPromise = new Promise.resolve();
  }

  securityPromise
    .then(function () {
      CalendarServer.event.emit('SecurityHookDone');
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

    FileSystem.readdirSync(CalendarServer.path + modelPath).forEach(function (file) {
      if (file.indexOf('DS_Store') > -1)return;

      let modelName = file.split('.')[0];

      promises.push(CalendarServer.models[modelName].remove());
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


function injectCalendarServerData() {
  let dataHolder = {};

  return new Promise((resolve, reject) => {
    logger.verbose('injectServer');

    FileSystem.readdirSync(CalendarServer.path + APPZET_DATA).forEach(function (modelConfig) {
      if (modelConfig.indexOf('DS_Store') > -1) return;

      let modelName = modelConfig.split('.')[0];

      if (modelInsert.indexOf(modelName) < 0) return;

      dataHolder[modelName] = require(CalendarServer.path + APPZET_DATA + '/' + modelConfig);

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
          if (!CalendarServer.modelDefinitions[datum.document.model])
            logger.log('error', 'Permission data에 model은 필수 입니다.');
          dataToCreate.model = CalendarServer.modelDefinitions[datum.document.model]._id;
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


          logger.log('silly', "Linking Model:", modelName, "of _id:", datum.document._id, "with RefModel:", vRefItem.modelName, "_id:", realId.toString());

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
          if (CalendarServer.modelDefinitions[counter.model].disabledPlugin) return;

          fixPromises.push(CalendarServer.models[counter.model].findOne().sort({_id: -1})
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