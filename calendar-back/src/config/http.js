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


let notFound = require("../bifido/middlewares/notFound");
let errorHandler = require("../bifido/middlewares/errorHandler");
let bind = require("../bifido/middlewares/Bind");
let cookieParser = require('cookie-parser');

module.exports.http = {
  middlewares: [
    {path: '/', middleware: require("../bifido/middlewares/RequestLogger")},
    {path: '/', middleware: cookieParser()},
    {path: '/', middleware: bind}, // Bifido middleware
    {path: '/', middleware: Bifido.loader.setupRouters()},
    {path: '/', middleware: notFound},
    {path: '/', middleware: errorHandler},
  ]
};

