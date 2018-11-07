'use strict';

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
  Multiparty: require('multiparty'),
  AWS: require('aws-sdk')
};
