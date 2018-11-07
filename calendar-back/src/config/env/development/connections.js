'use strict';

let nodemailer = require("nodemailer");

module.exports.connections = {

  /********************************
   *             DEV
   ********************************/

  mongoDb: {
    url: 'mongodb://localhost/calendar',
  },

  mailTemplates: [
    'support',
    'activate',
    'passwordreset',
    'refund'
  ],

  email: '',

  iamport: {
    impKey: '0416561883992773',
    impSecret: 'QAR5RdgWDqCb5L5Y51WkLDGKoOTfLBcCc4I3hY0VpD6vobttcqOY4uJsiCH4dUHqYqufpubO7hjwsN0F'
  },

  oauthBaseUrl: 'appName',

  google: {
    clientId: '',
    clientSecret: '',
    accessType: 'offline',
    scope: "email",
    response_type: 'code',
  },

  facebook: {
    clientId: '',
    clientSecret: '',
    scope: "email",
    response_type: 'code',
  },

  sms: {
    id: '',
    pwd: '',
    sender: ''
  },


  s3: {
    images: {
      bucket: 'images.applicat.co.kr',
      // folder:'haksik2'
    },
  },

};