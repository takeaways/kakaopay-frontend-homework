'use strict'

/**
 * Created by andy on 3/08/15
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 3/08/15
 *
 */

let logger = Bifido.logger('SecurityHook');

module.exports = {
  identity: 'Passport',
  inactive: false,
  afterEvent: "expressLoaded",
  initialise: initialise
};


function initialise(next) {
  PassportService.loadStrategies();
  next();
}

