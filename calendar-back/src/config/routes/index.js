'use strict';

let ServerDomain = require("../../calendarServer/middlewares/ServerDomain");

let serverCors = require('cors');

let favicon = require('serve-favicon');
let bodyParser = require('body-parser');

let reqParam = require('../../calendarServer/middlewares/requestParam');

module.exports.routes = {
  routers: [
    // CalendarServer Clients Routes
    {
      baseUrl: '/',
      middlewares: [
        serverCors(CalendarServer.config.cors.server),
        Session(CalendarServer.config.sessions),
        bodyParser.json(),
        bodyParser.urlencoded({extended: false}),
        reqParam({order: ["params", "query", "body", "baseParams"]}),
        ServerDomain
      ],
      routes: require('./servers'),
      policies: CalendarServer.config.policies.index
    },
  ]
};