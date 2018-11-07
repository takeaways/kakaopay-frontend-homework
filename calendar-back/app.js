'use strict';

let debug = require('debug')('server:server');

let http = require('http');
var https = require('https');


// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

let calendarServer = require('./src/calendarServer');

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


  let addr = CalendarServer.server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3000');

logger = CalendarServer.logger('App', true);

let createdServer;

calendarServer.loadCalendarServer()
  .then(function () {
    return calendarServer.setupHook();
  })
  .then(function () {
    return calendarServer.connectToDb();
  })
  .then(function () {
    return calendarServer.loadModels();
  })
  .then(function () {
    return calendarServer.loadRouters();
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

      if (CalendarServer.hookRunning.length == 0)
        return resolve(app);

      CalendarServer.event.on("hookDone", function (identity, error) {
        if (error) {
          logger.log('error', error.stack);
          return process.exit();
        }

        logger.debug('%s-Hook Done', identity);

        if (CalendarServer.hookRunning.length == 0)
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


    CalendarServer.server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    CalendarServer.server.listen(port);
    CalendarServer.server.on('error', onError);
    CalendarServer.server.on('listening', onListening);
    CalendarServer.server.timeout = CalendarServer.config.responses.requestTimeOut;

    // CalendarServer.socket = io(CalendarServer.server, CalendarServer.config.socket.options);


    return app;
  })
  .then(function (app) {

    CalendarServer.config.bootstrap(function callback(error) {
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



