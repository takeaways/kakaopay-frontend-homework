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

let mongoose = require('mongoose');
let session = require('express-session');

module.exports = {
  Rx: require('rx'),
  Express: require('express'),
  io: require('socket.io'),
  Session: session,
  MongoStore: require('connect-mongo')(session),
  Mongoose: mongoose,
  Schema: mongoose.Schema,
  MongooseDouble: require('mongoose-double')(mongoose),
  Promise: require('bluebird'),
  Relationship: require("mongoose-relationship"),
  AutoIncrement: require('mongoose-auto-increment'),
  FindOrCreate: require('mongoose-findorcreate'),
  _: require('lodash'),
  Moment: require('moment'),
  Winston: require('winston'),
  Path: require('path'),
  FileSystem: require("fs"),
  Request: require('request'),
  Multiparty: require('multiparty')
};
