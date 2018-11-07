'use strict';

let notFound = require("../calendarServer/middlewares/notFound");
let errorHandler = require("../calendarServer/middlewares/errorHandler");
let bind = require("../calendarServer/middlewares/Bind");
let cookieParser = require('cookie-parser');

module.exports.http = {
  middlewares: [
    {path: '/', middleware: require("../calendarServer/middlewares/RequestLogger")},
    {path: '/', middleware: cookieParser()},
    {path: '/', middleware: bind}, // CalendarServer middleware
    {path: '/', middleware: CalendarServer.loader.setupRouters()},
    {path: '/', middleware: notFound},
    {path: '/', middleware: errorHandler},
  ]
};

