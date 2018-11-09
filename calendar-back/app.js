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

let debug = require('debug')('server:server');

let http = require('http');
var https = require('https');


// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

let bifido = require('./src/bifido');

let logger;

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {


  let addr = Bifido.server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3000');

logger = Bifido.logger('App', true);

let createdServer;

bifido.loadBifido()
  .then(function () {
    return bifido.setupHook();
  })
  .then(function () {
    return bifido.connectToDb();
  })
  .then(function () {
    return bifido.loadModels();
  })
  .then(function () {
    return bifido.loadRouters();
  })
  .then(function (app) {

    createdServer = app;

    // Health checker
    createdServer.get('/health', (req, res) => {
      res.status(200).send();
    });

    /**
     * Resolve hooks.
     */

    return new Promise(function (resolve, reject) {

      if (Bifido.hookRunning.length == 0)
        return resolve(app);

      Bifido.event.on("hookDone", function (identity, error) {
        if (error) {
          logger.log('error', error.stack);
          return process.exit();
        }

        logger.debug('%s-Hook Done', identity);

        if (Bifido.hookRunning.length == 0)
          return resolve(app);
      });
    });
  })
  .then(function (app) {
    logger.debug('Start server listening to port: ', port);

    app.set('port', port);

    /**
     * Create HTTP server.
     */


    Bifido.server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    Bifido.server.listen(port);
    Bifido.server.on('error', onError);
    Bifido.server.on('listening', onListening);
    Bifido.server.timeout = Bifido.config.responses.requestTimeOut;

    Bifido.socket = io(Bifido.server, Bifido.config.socket.options);


    return app;
  })
  // .then(function (app) {
  //   return bifido.setupSocket();
  // })
  .then(function (app) {
    Bifido.config.bootstrap(function callback(error) {
      if (error) {
        logger.log('error', err.stack);
        return process.exit();
      }

      logger.debug('Bootstrap done');
    });
  })
  .catch(function (err) {
    logger.log('error', err.stack);
    process.exit();
  });



