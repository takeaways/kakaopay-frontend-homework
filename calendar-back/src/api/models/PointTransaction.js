'use strict';

/**
 * Created by sungwookim on 02/02/2018
 * As part of bifidoServer
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by sungwookim <ksw1652@gmail.com>, 02/02/2018
 *
 * Updater    수정자 - 작성자이름 02/02/2018
 */

module.exports = {
  schema: {
    isDeleted: {type: Boolean, index: true, default: false},

    // Associations
    invoice: {type: Number, ref: 'Invoice'},
    product: {type: Number, ref: 'Product'},
    point: {type: Number, ref: 'Point'},
    owner: {type: Number, ref:'User'},
  },
  beforeUpdate: function (next) {
    next();
  }
};