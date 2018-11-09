'use strict';

/**
 * Created by PHILIP on 02/11/2016
 * As Part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 02/11/2016
 *
 */

let admin = ['AuditPolicy', 'passportBearerAuth', 'BearerAuth', 'Admin'];
let user = ['AuditPolicy', 'passportBearerAuth', 'BearerAuth', 'User'];
let anyone = ['AuditPolicy'];
let owner = ['AuditPolicy', 'passportBearerAuth', 'BearerAuth', 'User', 'OwnerPolicy'];
let ownerAndAdmin = ['AuditPolicy', 'passportBearerAuth', 'BearerAuth', 'AdminOrOwner'];

module.exports = {
  '*': false,

  EventController: {
    // Public
    count: anyone,
    find: anyone,
    findOne: anyone,

    // Admin
    create: anyone,
    update: anyone,
    remove: anyone
  }
};