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
 *
 *
 * Script description:
 *
 *  Order of instantiation
 *    1.  Bifido - Create and Initialise server And Initialise Globals
 *               - Setup API
 *               - Setting Log
 *               - Initialise Service
 *               - Initialise Model
 *               - Initialise Policy
 *               - Initialise Response
 *               - Initialise Controller
 *               - Initialise Hook
 *               - Setup Config
 *               - Set-up Hook
 *
 *    2. Mongoose - Connect
 *        - Setup Bifido Model
 *        - Setup DB Connect
 *
 *    3. Express - Initialise
 *        - Setup Middleware
 *
 *
 *    4. Bifido - Start
 *              - Bootstrap
 *
 */


/**********************************************************************
 *              Bifido - Create and Initialise server
 **********************************************************************/

const EventEmitter = require('events');
const helmet = require('helmet');

let sources = require('./globals');

for (let key in sources) {
  global[key] = sources[key];
}

require('mongoose-big-decimal')(Mongoose);

const configPath = "src/config/";
const servicePath = "src/api/services/";
const hookPath = "src/api/hooks/";
const modelPath = "src/api/models/";
const policyPath = "src/api/policies/";
const responsePath = "src/api/responses/";
const controllerPath = "src/api/controllers/";
const errorPath = "src/api/errors";
const configLoadOrder = [
  'bootstrap.js',
  'connections.js',
  'hooks.js',
  'sessions.js',
  'models.js',
  'responses.js',
  'security.js',
  'passport.js',
  'cors.js',
  'routes',
  'http.js',
  'socket.js'
];

global.Bifido = {
  config: {},
  models: {},
  modelDefinitions: {},
  path: Path.join(__dirname, '../../'),
  event: new EventEmitter(),
  hookRunning: [],
  loader: {},
  socket: null
};


/**********************************************************************
 *                        - Setup API
 **********************************************************************/


Bifido.loader.setupRouters = function () {
  let bifidoRouter = Express.Router();

  _.forEach(Bifido.config.routes.routers, function (routerConfig) {
    logger.silly("Router:", routerConfig.baseUrl);

    if (routerConfig.middlewares && Array.isArray(routerConfig.middlewares) && routerConfig.middlewares.length > 0)
      bifidoRouter.use(routerConfig.baseUrl, routerConfig.middlewares);

    bifidoRouter.use(routerConfig.baseUrl, Bifido.loader.getApiRouter(routerConfig, routerConfig.baseUrl));
  });
  return bifidoRouter;
};


Bifido.loader.getApiRouter = function (routerConfig, baseUrl) {
  let route, resolution, method, url, controller, api;
  let router = Express.Router();

  _.forEach(routerConfig.routes, function (value, key) {
    route = key.split(' ');
    resolution = value.split('.');
    method = route[0].toLowerCase();
    url = route[1];

    // Controller not exist
    if (!Bifido.controllers[resolution[0]])
      return logger.log('warn', "Controller does not exist Route: ", key, " does not exist");

    controller = Bifido.controllers[resolution[0]];

    if (!controller[resolution[1]])
      return logger.log('warn', "baseUrl:", baseUrl, "Api doest not exist Route: ", key, " does not exist");

    api = controller[resolution[1]];


    if (api) {
      logger.silly('Express route: %s - %s resolved to: %s - %s', route[0], route[1], resolution[0], resolution[1]);

      if (routerConfig.policies[resolution[0]]) {
        if (routerConfig.policies[resolution[0]][resolution[1]]) {
          Bifido.loader.policyConfigSetup(Bifido.express, router, Bifido.policies, method, url, api, routerConfig.policies[resolution[0]][resolution[1]]);
        } else if (routerConfig.policies[resolution[0]]['*']) {
          Bifido.loader.policyConfigSetup(Bifido.express, router, Bifido.policies, method, url, api, routerConfig.policies[resolution[0]]['*']);
        } else {
          Bifido.loader.policyConfigSetup(Bifido.express, router, Bifido.policies, method, url, api, routerConfig.policies[resolution[0]]);
        }
      } else if (routerConfig.policies['*']) {
        Bifido.loader.policyConfigSetup(Bifido.express, router, Bifido.policies, method, url, api, routerConfig.policies['*']);
      }
    }
  });

  return router;
};

Bifido.loader.policyConfigSetup = function (express, router, policies, method, url, api, config) {

  if (typeof config === 'boolean') {
    if (config)
      router[method](url, api);
  }

  if (typeof config === 'string') {
    if (policies[config]) {
      router[method](url, policies[config]);
      router[method](url, api);
    }
  }

  if (Array.isArray(config)) {
    _.forEach(config, function (identity) {
      if (typeof identity === 'string')
        if (policies[identity])
          router[method](url, policies[identity]);
    });
    router[method](url, api);
  }
};

/**********************************************************************
 *                         Setting Log Level
 **********************************************************************/

/**
 *  Usage:
 *        let logger = Bifido.logger('Bifido');
 *        logger.debug('Bifido Initialisation Done');
 *
 */

_.assignIn(Bifido.config, require(Bifido.path + configPath + 'log.js'));
_.assignIn(Bifido.config, require(Bifido.path + configPath + 'models.js'));

Winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

let folders = ['logs'];

folders.forEach((folder) => {
  if (!FileSystem.existsSync(folder)) {
    FileSystem.mkdirSync(folder);
  }
});

Bifido.logger = function (tag, errorHandle) {

  let config = {
    level: Bifido.config.log.level,
    exitOnError: true,
    transports: [
      new (Winston.transports.Console)(
        {
          colorize: true,
          timestamp: true,
          prettyPrint: true
        }
      ),
      new (Winston.transports.DailyRotateFile)({
        name: 'debug-file',
        filename: Bifido.config.log.logFilePath || 'logs/bifido.debug',
        level: 'debug',
        datePattern: '.yyyy-MM-dd.log',
        maxsize: 10000000,
        json: false
      })
    ]
  };

  if (errorHandle)
    config.exceptionHandlers = [
      new Winston.transports.Console({
        colorize: true,
        handleExceptions: false,
        humanReadableUnhandledException: true
      }),
      new (Winston.transports.DailyRotateFile)({
        name: 'debug-file',
        filename: Bifido.config.log.exceptionFilePath || 'logs/bifido.exceptions',
        level: 'debug',
        datePattern: '.yyyy-MM-dd.log',
        maxsize: 10000000,
        json: false
      })
    ];

  let logger = new (Winston.Logger)(config);

  logger.log = function () {
    let args = arguments;
    if (tag)
      args[1] = '[' + tag + ']' + ' - ' + args[1];
    Winston.Logger.prototype.log.apply(this, args);
  }

  return logger;
};

let logger = Bifido.logger('Bifido');
Bifido.event.emit('loggerLoaded');
logger.debug('Bifido Initialisation Done');


function loadBifido() {
  return new Promise(function (resolve, reject) {

    /**********************************************************************
     *                      Bifido - Initialise Service
     **********************************************************************/

    Bifido.services = {};
    FileSystem.readdirSync(Bifido.path + servicePath).forEach(function (file) {
      if (file.indexOf('DS_Store') > -1)return;


      let service = require(Bifido.path + servicePath + file);
      let serviceName = file.split('.')[0];
      Bifido.services[serviceName] = service;
      global[serviceName] = service;
    });

    Bifido.event.emit('serviceLoaded');
    logger.debug('Bifido Initialise Services Done');
    logger.silly('Bifido Services:', Bifido.services);


    /**********************************************************************
     *                      Bifido - Initialise Model
     **********************************************************************/

    Bifido.modelDefinitions = {};
    FileSystem.readdirSync(Bifido.path + modelPath).forEach(function (file) {
      let model = require(Bifido.path + modelPath + file);
      let modelName = file.split('.')[0];

      if (!model.disableGlobalSchema)
        model.schema = _.assign({}, Bifido.config.models.schema, model.schema);

      Bifido.modelDefinitions[modelName] = model;
    });

    Bifido.event.emit('modelLoaded');
    logger.debug('Bifido Initialise Models Done');
    logger.silly('Bifido Models:', Bifido.modelDefinitions);


    /**********************************************************************
     *                      Bifido - Initialise Policy
     **********************************************************************/

    Bifido.policies = {};
    FileSystem.readdirSync(Bifido.path + policyPath).forEach(function (file) {
      let policy = require(Bifido.path + policyPath + file);
      let policyName = file.split('.')[0];
      Bifido.policies[policyName] = policy;
      Bifido.policies[policyName.toLowerCase()] = policy;
    });

    Bifido.event.emit('policyLoaded');
    logger.debug('Bifido Initialise policies Done');
    logger.silly('Bifido policies:', Bifido.policies);


    /**********************************************************************
     *                      Bifido - Initialise Response
     **********************************************************************/

    Bifido.responses = {};
    FileSystem.readdirSync(Bifido.path + responsePath).forEach(function (file) {
      let response = require(Bifido.path + responsePath + file);
      let responseName = file.split('.')[0];
      Bifido.responses[responseName] = response;
    });

    Bifido.event.emit('responseLoaded');
    logger.debug('Bifido Initialise responses Done');
    logger.silly('Bifido responses:', Bifido.responses);


    /**********************************************************************
     *                      Bifido - Initialise Controller
     **********************************************************************/

    Bifido.controllers = {};
    FileSystem.readdirSync(Bifido.path + controllerPath).forEach(function (file) {
      let controller = require(Bifido.path + controllerPath + file);
      let controllerName = file.split('.')[0];
      Bifido.controllers[controllerName] = controller;
    });

    Bifido.event.emit('controllerLoaded');
    logger.debug('Bifido Initialise Controllers Done');
    logger.silly('Bifido Controllers:', Bifido.controllers);

    /**********************************************************************
     *                      Bifido - Initialise Hook
     **********************************************************************/

    Bifido.hooks = {};
    FileSystem.readdirSync(Bifido.path + hookPath).forEach(function (file) {
      let hook = require(Bifido.path + hookPath + file);
      // let hookName = file.split('.')[0];
      Bifido.hooks[hook.identity] = hook;
    });

    Bifido.event.emit('hookLoaded');
    logger.debug('Bifido Initialise Hooks Done');
    logger.silly('Bifido Hooks:', Bifido.hooks);


    /**********************************************************************
     *                        Bifido - Setup Config
     **********************************************************************/

    // Load policies first

    Bifido.config.policies = {};

    FileSystem.readdirSync(Bifido.path + configPath + 'policies').forEach(function (file) {
      let policyConfig = require(Bifido.path + configPath + 'policies/' + file);
      let policyConfigName = file.split('.')[0];
      Bifido.config.policies[policyConfigName] = policyConfig;
      Bifido.config.policies[policyConfigName.toLowerCase()] = policyConfig;
    });

    _.forEach(configLoadOrder, function (file) {
      _.assignIn(Bifido.config, require(Bifido.path + configPath + file));
    });


    resolve();
  });
}

/**********************************************************************
 *                        Bifido - Set-up Hook
 **********************************************************************/

function setupHook() {
  return new Promise(function (resolve, reject) {
    if (Bifido.config.hooks.inactive)
      return resolve();

    _.forEach(Bifido.hooks, function (hook) {

      if (!hook.identity instanceof String || !hook.afterEvent instanceof String || !hook.initialise instanceof Function)
        return logger.log("error", "hook must have identity:String, afterEvent:String, initialise:Function");

      if (Bifido.hookRunning.indexOf(hook.identity) !== -1)
        return logger.log("error", "hook identity:String must be unique");

      if (!hook.inactive) {
        Bifido.hookRunning.push(hook.identity);
        return Bifido.event.once(hook.afterEvent, function () {
          hook.initialise(hookComplete.bind(null, hook.identity));
        });
      }
    });

    return resolve();
  });
}

function hookComplete(identity, error) {
  let index = Bifido.hookRunning.indexOf(identity);
  Bifido.hookRunning.splice(index, 1);
  Bifido.event.emit('hookDone', identity, error);
}

/**********************************************************************
 *                        Mongoose - connect
 **********************************************************************/

function connectToDb(url) {
  return new Promise(function (resolve, reject) {
    Mongoose.Promise = Promise;
    let dbUrl = url || Bifido.config.connections.mongoDb.url;
    let option = Bifido.config.connections.mongoDb.option || {};
    logger.debug('Mongoose connecting to MongoDB: %s', dbUrl);
    Mongoose.connect(dbUrl, option);

    Mongoose.connection.on('error', function (err) {
      logger.debug('Mongoose connection to MongoDB Failed');
      reject(err);
    });

    Mongoose.connection.once('open', function () {
      Bifido.event.emit('dbConnected');
      logger.debug('Mongoose connected to MongoDB');

      resolve();
    });
  });
}


function loadModels() {
  return new Promise(function (resolve, reject) {
    AutoIncrement.initialize(Mongoose.connection);
    logger.debug('Mongoose plugin loaded');

    _.forEach(Bifido.modelDefinitions, function (model, modelName) {
      logger.silly('Loading mongoose schema:', modelName);

      let schema = model.schema;

      let options = _.assign({}, Bifido.config.models.options, model.options);

      let modelSchema = Schema(schema, options);

      // indexing model
      if (model.indexes) {
        _.forEach(model.indexes, index => {
          modelSchema.index(index.field, index.option);
        });
      }

      logger.silly('Applying mongoose plugin to schema: %s', modelName);
      if (!model.disabledPlugin || !model.disabledPlugin.AutoIncrement) {
        if (model.plugins && model.plugins.AutoIncrement && model.plugins.AutoIncrement.options) {
          modelSchema.plugin(AutoIncrement.plugin, _.assign({}, {model: modelName}, model.plugins.AutoIncrement.options));
        } else
          modelSchema.plugin(AutoIncrement.plugin, {model: modelName, startAt: 1});
      }


      modelSchema.plugin(FindOrCreate);

      // Create life-cycle
      _.forEach(model.cycles, (val, key) => {
        if (_.isArray(val)) {
          _.forEach(val, function (sequence) {
            assignMongooseMiddleware(modelSchema, key, sequence);
          });
        } else if (_.isFunction(val)) {
          assignMongooseMiddleware(modelSchema, key, val);
        }
      });

      // Create static methods
      _.assign(modelSchema.statics, model.statics);

      // Create instance methods
      _.assign(modelSchema.methods, model.methods);

      _.forEach(model.virtuals, (value, key) => {
        modelSchema.virtual(key, value);
      });

      global[modelName] = Bifido.models[modelName] = Mongoose.model(modelName, modelSchema);
    });

    Bifido.event.emit('mongoModelLoaded');
    logger.debug('Mongo Initialisation Done');
    resolve();
  });
}

function assignMongooseMiddleware(schema, key, fn) {
  let operation = key.replace('before', '');
  operation = operation.replace('after', '');
  operation = operation.charAt(0).toLowerCase() + operation.slice(1);
  if (key.indexOf('before') == 0)
    schema['pre'](operation, fn);
  else
    schema['post'](operation, fn);
}


/**********************************************************************
 *                        Express - Initialise
 **********************************************************************/

function loadRouters() {


  return new Promise(function (resolve, reject) {
    logger.debug('Express Initialisation Start');

    Bifido.express = Express();

    // Security framework
    Bifido.express.use(helmet());


    /**********************************************************************
     *                      - Setup Middleware
     **********************************************************************/

    _.forEach(Bifido.config.http.middlewares, function (item) {
      Bifido.express.use(item.path, item.middleware);
    });

    Bifido.event.emit('expressLoaded');
    logger.debug('Express Initialisation Done');
    resolve(Bifido.express);
  });
}


function setupSocket() {

  if (Bifido.config.socket.adapter)
    Bifido.socket.adapter(Bifido.config.socket.adapter);

  _.forEach(Bifido.config.socket.middlewares, function (item) {
    Bifido.socket.use(item);
  });
}

module.exports = {
  loadBifido: loadBifido,
  setupHook: setupHook,
  connectToDb: connectToDb,
  loadModels: loadModels,
  loadRouters: loadRouters,
  setupSocket: setupSocket
};




