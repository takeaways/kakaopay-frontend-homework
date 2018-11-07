'use strict';

let logger = CalendarServer.logger('TransactionalRequest');

let onHeaders = require('on-headers');

module.exports = function (req, res, next) {

  if (!req.user)
    return res.forbidden();

  let now = Moment();
  let lastRequest = Moment(req.user.transactionLastModified);
  let diffInSeconds = now.diff(lastRequest, 'seconds');

  if (req.user.transactionState === 'Ready'
    || diffInSeconds > 90) {
    onHeaders(res, function onHeaders() {
      req.user.transactionState = 'Ready';
      req.user.save()
    });

    req.user.transactionState = 'Pending';
    req.user.transactionLastModified = now;
    req.user.save()
      .then(() => {
        return next();
      })
      .catch((err) => {
        if (err.name === 'MongoError' || err instanceof Mongoose.Error)
          return res.mongooseError(err);

        logger.log('error', err);
        return res.internalServer();
      });
  } else {
    return res.manyRequest();
  }

};
