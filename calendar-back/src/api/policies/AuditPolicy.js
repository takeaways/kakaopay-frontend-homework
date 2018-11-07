'use strict';

let fnv = require('fnv-plus');
let url = require('url');

let logger = CalendarServer.logger('AuditPolicy');

module.exports = function (req, res, next) {
  let ipAddress = req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress);
  req.requestId = fnv.hash(new Date().valueOf() + ipAddress, 128).str();

  let destinedController;
  let destinedApi;

  let urlParts = (req.originalUrl).split("/");
  if (urlParts[1])
    _.forEach(CalendarServer.config.routes.routers, (router) => {
      if (router.baseUrl.indexOf("/" + urlParts[1]) == 0) {
        let apiUrl = req.url.split("?");
        let key = req.method.toUpperCase() + " " + apiUrl[0];
        if (router.routes[key]) {
          let resolution = router.routes[key].split(".");
          destinedController = resolution[0];
          destinedApi = resolution[1];
        }
      }
    });
	
	next();
};

function sanitizeRequestUrl(req) {
  let requestUrl = url.format({
    protocol: req.protocol,
    host: req.hostname,
    pathname: req.originalUrl || req.url,
    query: req.query
  });

  return requestUrl.replace(/(password=).*?(&|$)/ig, '$1<hidden>$2');
}
