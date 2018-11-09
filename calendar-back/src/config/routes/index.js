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

let ServerDomain = require("../../bifido/middlewares/ServerDomain");

let serverCors = require('cors');

let favicon = require('serve-favicon');
let bodyParser = require('body-parser');
let passport = require("../../api/services/PassportService");
let reqParam = require('../../bifido/middlewares/requestParam');

module.exports.routes = {
  routers: [
    // Bifido Clients Routes
    {
      baseUrl: '/',
      middlewares: [
        serverCors(Bifido.config.cors.server),
        Session(Bifido.config.sessions),
        passport.initialize(),
        passport.session(),
        bodyParser.json(),
        bodyParser.urlencoded({extended: false}),
        reqParam({order: ["params", "query", "body", "baseParams"]}),
        ServerDomain
      ],
      routes: require('./servers'),
      policies: Bifido.config.policies.index
    },
  ]
};