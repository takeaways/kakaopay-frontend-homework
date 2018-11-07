'use strict'


let logger = CalendarServer.logger('SecurityHook');

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

