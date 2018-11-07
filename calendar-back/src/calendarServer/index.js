'use strict';

/**
 * Script description:
 *
 *  Order of instantiation
 *    1.  CalendarServer - Create and Initialise server And Initialise Globals
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
 *        - Setup CalendarServer Model
 *        - Setup DB Connect
 *
 *    3. Express - Initialise
 *        - Setup Middleware
 *
 *
 *    4. CalendarServer - Start
 *              - Bootstrap
 *
 */


/**********************************************************************
 *              CalendarServer - Create and Initialise server
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
  'hooks.js',
  'sessions.js',
  'models.js',
  'responses.js',
  'security.js',
  'passport.js',
  'routes',
  'http.js'
];
const envConfigLoadOrder = [
  'connections.js',
  'cors.js'
];


global.CalendarServer = {
  config: require(Path.join(__dirname, '../../') + configPath + "env/env.js"),
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


CalendarServer.loader.setupRouters = function () {
  let appZetrouter = Express.Router();

  _.forEach(CalendarServer.config.routes.routers, function (routerConfig) {
    logger.silly("Router:", routerConfig.baseUrl);

    if (routerConfig.middlewares && Array.isArray(routerConfig.middlewares) && routerConfig.middlewares.length > 0)
      appZetrouter.use(routerConfig.baseUrl, routerConfig.middlewares);

    appZetrouter.use(routerConfig.baseUrl, CalendarServer.loader.getApiRouter(routerConfig, routerConfig.baseUrl));
  });
  return appZetrouter;
};


CalendarServer.loader.getApiRouter = function (routerConfig, baseUrl) {
  let route, resolution, method, url, controller, api;
  let router = Express.Router();

  _.forEach(routerConfig.routes, function (value, key) {
    route = key.split(' ');
    resolution = value.split('.');
    method = route[0].toLowerCase();
    url = route[1];

    // Controller not exist
    if (!CalendarServer.controllers[resolution[0]])
      return logger.log('warn', "Controller does not exist Route: ", key, " does not exist");

    controller = CalendarServer.controllers[resolution[0]];

    if (!controller[resolution[1]])
      return logger.log('warn', "baseUrl:", baseUrl, "Api doest not exist Route: ", key, " does not exist");

    api = controller[resolution[1]];


    if (api) {
      logger.silly('Express route: %s - %s resolved to: %s - %s', route[0], route[1], resolution[0], resolution[1]);

      if (routerConfig.policies[resolution[0]]) {
        if (routerConfig.policies[resolution[0]][resolution[1]]) {
          CalendarServer.loader.policyConfigSetup(CalendarServer.express, router, CalendarServer.policies, method, url, api, routerConfig.policies[resolution[0]][resolution[1]]);
        } else if (routerConfig.policies[resolution[0]]['*']) {
          CalendarServer.loader.policyConfigSetup(CalendarServer.express, router, CalendarServer.policies, method, url, api, routerConfig.policies[resolution[0]]['*']);
        } else {
          CalendarServer.loader.policyConfigSetup(CalendarServer.express, router, CalendarServer.policies, method, url, api, routerConfig.policies[resolution[0]]);
        }
      } else if (routerConfig.policies['*']) {
        CalendarServer.loader.policyConfigSetup(CalendarServer.express, router, CalendarServer.policies, method, url, api, routerConfig.policies['*']);
      }
    }
  });

  return router;
};

CalendarServer.loader.policyConfigSetup = function (express, router, policies, method, url, api, config) {

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
 *        let logger = CalendarServer.logger('CalendarServer');
 *        logger.debug('CalendarServer Initialisation Done');
 *
 */

_.assignIn(CalendarServer.config, require(CalendarServer.path + configPath + 'log.js'));
_.assignIn(CalendarServer.config, require(CalendarServer.path + configPath + 'models.js'));

Winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

let folders = ['logs'];

folders.forEach((folder) => {
  if (!FileSystem.existsSync(folder)) {
    FileSystem.mkdirSync(folder);
  }
});

CalendarServer.logger = function (tag, errorHandle) {

  let config = {
    level: CalendarServer.config.log.level,
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
        filename: CalendarServer.config.log.logFilePath,
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
        filename: CalendarServer.config.log.exceptionFilePath,
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

let logger = CalendarServer.logger('CalendarServer');
CalendarServer.event.emit('loggerLoaded');
logger.debug('CalendarServer Initialisation Done');


function loadCalendarServer() {
  return new Promise(function (resolve, reject) {

    /**********************************************************************
     *                      CalendarServer - Initialise Service
     **********************************************************************/

    CalendarServer.services = {};
    FileSystem.readdirSync(CalendarServer.path + servicePath).forEach(function (file) {
      if (file.indexOf('DS_Store') > -1)return;


      let service = require(CalendarServer.path + servicePath + file);
      let serviceName = file.split('.')[0];
      CalendarServer.services[serviceName] = service;
      global[serviceName] = service;
    });

    CalendarServer.event.emit('serviceLoaded');
    logger.debug('CalendarServer Initialise Services Done');
    logger.silly('CalendarServer Services:', CalendarServer.services);


    /**********************************************************************
     *                      CalendarServer - Initialise Model
     **********************************************************************/

    CalendarServer.modelDefinitions = {};
    FileSystem.readdirSync(CalendarServer.path + modelPath).forEach(function (file) {
      let model = require(CalendarServer.path + modelPath + file);
      let modelName = file.split('.')[0];

      if (!model.disableGlobalSchema)
        model.schema = _.assign({}, CalendarServer.config.models.schema, model.schema);

      CalendarServer.modelDefinitions[modelName] = model;
    });

    CalendarServer.event.emit('modelLoaded');
    logger.debug('CalendarServer Initialise Models Done');
    logger.silly('CalendarServer Models:', CalendarServer.modelDefinitions);


    /**********************************************************************
     *                      CalendarServer - Initialise Policy
     **********************************************************************/

    CalendarServer.policies = {};
    FileSystem.readdirSync(CalendarServer.path + policyPath).forEach(function (file) {
      let policy = require(CalendarServer.path + policyPath + file);
      let policyName = file.split('.')[0];
      CalendarServer.policies[policyName] = policy;
      CalendarServer.policies[policyName.toLowerCase()] = policy;
    });

    CalendarServer.event.emit('policyLoaded');
    logger.debug('CalendarServer Initialise policies Done');
    logger.silly('CalendarServer policies:', CalendarServer.policies);


    /**********************************************************************
     *                      CalendarServer - Initialise Response
     **********************************************************************/

    CalendarServer.responses = {};
    FileSystem.readdirSync(CalendarServer.path + responsePath).forEach(function (file) {
      let response = require(CalendarServer.path + responsePath + file);
      let responseName = file.split('.')[0];
      CalendarServer.responses[responseName] = response;
    });

    CalendarServer.event.emit('responseLoaded');
    logger.debug('CalendarServer Initialise responses Done');
    logger.silly('CalendarServer responses:', CalendarServer.responses);


    /**********************************************************************
     *                      CalendarServer - Initialise Controller
     **********************************************************************/

    CalendarServer.controllers = {};
    FileSystem.readdirSync(CalendarServer.path + controllerPath).forEach(function (file) {
      let controller = require(CalendarServer.path + controllerPath + file);
      let controllerName = file.split('.')[0];
      CalendarServer.controllers[controllerName] = controller;
    });

    CalendarServer.event.emit('controllerLoaded');
    logger.debug('CalendarServer Initialise Controllers Done');
    logger.silly('CalendarServer Controllers:', CalendarServer.controllers);

    /**********************************************************************
     *                      CalendarServer - Initialise Hook
     **********************************************************************/

    CalendarServer.hooks = {};
    FileSystem.readdirSync(CalendarServer.path + hookPath).forEach(function (file) {
      let hook = require(CalendarServer.path + hookPath + file);
      // let hookName = file.split('.')[0];
      CalendarServer.hooks[hook.identity] = hook;
    });

    CalendarServer.event.emit('hookLoaded');
    logger.debug('CalendarServer Initialise Hooks Done');
    logger.silly('CalendarServer Hooks:', CalendarServer.hooks);


    /**********************************************************************
     *                        CalendarServer - Setup Config
     **********************************************************************/

    // Load policies first

    CalendarServer.config.policies = {};

    FileSystem.readdirSync(CalendarServer.path + configPath + 'policies').forEach(function (file) {
      let policyConfig = require(CalendarServer.path + configPath + 'policies/' + file);
      let policyConfigName = file.split('.')[0];
      CalendarServer.config.policies[policyConfigName] = policyConfig;
      CalendarServer.config.policies[policyConfigName.toLowerCase()] = policyConfig;
    });

    _.forEach(envConfigLoadOrder, function (file) {
      _.assignIn(CalendarServer.config, require(CalendarServer.path + configPath + "env/" + CalendarServer.config.env + "/" + file));
    });

    _.forEach(configLoadOrder, function (file) {
      _.assignIn(CalendarServer.config, require(CalendarServer.path + configPath + file));
    });

    global.s3 = new AWS.S3();
    global.route53 = new AWS.Route53();
    global.cloudfront = new AWS.CloudFront();

    resolve();
  });
}

/**********************************************************************
 *                        CalendarServer - Set-up Hook
 **********************************************************************/

function setupHook() {
  return new Promise(function (resolve, reject) {
    if (CalendarServer.config.hooks.inactive)
      return resolve();

    _.forEach(CalendarServer.hooks, function (hook) {

      if (!hook.identity instanceof String || !hook.afterEvent instanceof String || !hook.initialise instanceof Function)
        return logger.log("error", "hook must have identity:String, afterEvent:String, initialise:Function");

      if (CalendarServer.hookRunning.indexOf(hook.identity) !== -1)
        return logger.log("error", "hook identity:String must be unique");

      if (!hook.inactive) {
        CalendarServer.hookRunning.push(hook.identity);
        return CalendarServer.event.once(hook.afterEvent, function () {
          hook.initialise(hookComplete.bind(null, hook.identity));
        });
      }
    });

    return resolve();
  });
}

function hookComplete(identity, error) {
  let index = CalendarServer.hookRunning.indexOf(identity);
  CalendarServer.hookRunning.splice(index, 1);
  CalendarServer.event.emit('hookDone', identity, error);
}

/**********************************************************************
 *                        Mongoose - connect
 **********************************************************************/

function connectToDb(url) {
  return new Promise(function (resolve, reject) {
    Mongoose.Promise = Promise;
    let dbUrl = url || CalendarServer.config.connections.mongoDb.url;
    let option = CalendarServer.config.connections.mongoDb.option || {};
    logger.debug('Mongoose connecting to MongoDBb: %s', dbUrl);
    Mongoose.connect(dbUrl, option);

    Mongoose.connection.on('error', function (err) {
      logger.debug('Mongoose connection to MongoDBb Failed');
      reject(err);
    });

    Mongoose.connection.once('open', function () {
      CalendarServer.event.emit('dbConnected');
      logger.debug('Mongoose connected to MongoDBb');

      resolve();
    });
  });
}


function loadModels() {
  return new Promise(function (resolve, reject) {
    AutoIncrement.initialize(Mongoose.connection);
    logger.debug('Mongoose plugin loaded');

    _.forEach(CalendarServer.modelDefinitions, function (model, modelName) {
      logger.silly('Loading mongoose schema:', modelName);

      let schema = model.schema;

      let options = _.assign({}, CalendarServer.config.models.options, model.options);

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

      global[modelName] = CalendarServer.models[modelName] = Mongoose.model(modelName, modelSchema);
    });

    CalendarServer.event.emit('mongoModelLoaded');
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

    CalendarServer.express = Express();

    // Security framework
    CalendarServer.express.use(helmet());


    /**********************************************************************
     *                      - Setup Middleware
     **********************************************************************/

    _.forEach(CalendarServer.config.http.middlewares, function (item) {
      CalendarServer.express.use(item.path, item.middleware);
    });

    CalendarServer.event.emit('expressLoaded');
    logger.debug('Express Initialisation Done');
    resolve(CalendarServer.express);
  });
}

module.exports = {
  loadCalendarServer: loadCalendarServer,
  setupHook: setupHook,
  connectToDb: connectToDb,
  loadModels: loadModels,
  loadRouters: loadRouters
};




