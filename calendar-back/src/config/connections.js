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
let nodemailer = require("nodemailer");

module.exports.connections = {

  /********************************
   *             DEV
   ********************************/

  mongoDb: {
    url: 'mongodb://localhost/calendar'
  },

  mailTemplates: [
    'support',
    'passwordreset'
  ],

  fcm: 'AAAAYuv4L34:APA91bE4-V0Cw0UtYyMbU-WgVuvSRbeYA5-oEnqHCVvJyGpjENXYJklnuc2L9M7Z2NcVLmXt4wxYoyB8uwynrt9AynvaK75az1mg5foFG_zUkf0C6WV_kip3tOPf31014JawjPzuoop4',

  email: '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',

  iamport: {
    impKey: '2875335581887612',
    impSecret: 'Rua1BjYRaJrw425XbWNUyUcFRgTaSn1JRbLtvJkGsLdxOjuZfiUOd6u4mnefKgZCsK6YurFWcSt1bY1r'
  },

  s3: {
    images: {
      bucket: 'images.applicat.co.kr',
    }
  },

  naver : {
    clientId : 'vI9QXyWixnQQISXibCAC',
    clientSecret : '_9tOMPVMQC',
    serviceUrl: 'http://localhost:4200',
    callbackUrl: 'http://localhost:4200/oauth?provider=naver'
  },

  oauthBaseUrl: 'bifido'

  /********************************
   *             PRODUCTION
   ********************************/

  // mongoDb: {
  //   url: 'mongodb://bifidoDbUser:asdlfkj124@13.124.94.223:27017/bifido',
  // },
  //
  // mqtt: {
  //   type: 'mongo',
  //   url: 'mongodb://bifidoDbUser:asdlfkj124@13.124.94.223:27017/bifido',
  //   pubsubCollection: 'pubsub',
  //   mongo: {}
  // },
  //
  // mailTemplates: [
  //   'support',
  //   'passwordreset'
  // ],
  //
  // fcm: 'AAAAYuv4L34:APA91bE4-V0Cw0UtYyMbU-WgVuvSRbeYA5-oEnqHCVvJyGpjENXYJklnuc2L9M7Z2NcVLmXt4wxYoyB8uwynrt9AynvaK75az1mg5foFG_zUkf0C6WV_kip3tOPf31014JawjPzuoop4',
  //
  // email: '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',
  //
  // iamport: {
  //   impKey: '3637124808661252',
  //   impSecret: 'T4ZffrFB53lekN3oDF0PRx6jcij38Xc12cgiDWUJZgXj31IHGIwyfCRsVav38I5bUltyiohhEeBHgjoW'
  // },
  //
  // s3: {
  //   images: {
  //     bucket: 'images.bifido-official.com',
  //   }
  // },
  //
  // oauthBaseUrl: 'bifido'
};
