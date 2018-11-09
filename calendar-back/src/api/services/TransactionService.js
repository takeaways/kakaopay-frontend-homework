'use strict';

/**
 * Created by PHILIP on 27/06/2017
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & PHILIP - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 27/06/2017
 *
 */

let logger = Bifido.logger('TransactionService');
let Promise = require('bluebird');

let iamport;

module.exports = {
  init: init,

  rollback: rollback,
  rollbackPoint: rollbackPoint,
  check: check,
  cancel: cancel
};

function init() {
  iamport = require('iamport')({
    impKey: Bifido.config.connections.iamport.impKey,
    impSecret: Bifido.config.connections.iamport.impSecret
  });
}

function check(paymentId) {
  return iamport.payment.getByMerchant({merchant_uid: paymentId});
}

function rollback() {
  let failedPaymentIds;

  return Payment.find({status: 'ready'})
    .then((payments) => {
      let failedPayment;

      failedPayment = _.filter(payments, (payment) => {
        let diffHours = Moment().diff(payment.createdAt, 'hours');
        let diffMinutes = Moment().diff(payment.createdAt, 'minutes');

        if (
          (payment.paymentType == 'bank' && diffHours > 72)
          || (payment.paymentType != 'bank' && diffMinutes > 5))
          return payment;
      });

      failedPaymentIds = _.map(failedPayment, '_id');

      return Promise.all([Payment.update({_id: {$in: failedPaymentIds}}, {status: 'failed'}), failedPaymentIds]);
    })
    .spread((result, failedPaymentIds) => {
      return Payment.find({_id: {$in: failedPaymentIds}}).populate('owner');
    })
    .then((failedPayments) => {
      if(failedPayments.length == 0)
        return null;
      else {
        let promises = [];
        _.forEach(failedPayments, payment => {
          promises.push(TransactionService.rollbackPoint(payment.owner, payment.invoice));
        });

        return promises;
      }
    })
}

function rollbackPoint(user, invoiceId) {
  return PointTransaction.find({invoice: invoiceId})
    .populate('point')
    .then((pointTransactions) => {
      if(!pointTransactions) throw new Error('PointTransactionNotFound');

      let promises = [];
      let totalScore = 0;

      _.forEach(pointTransactions, transaction => {
        transaction.isDeleted = true;
        promises.push(transaction.save());
        totalScore += transaction.point.score * -1;
      });

      user.currentPoint = user.currentPoint + totalScore;

      return user.save();
    })
}

function cancel(paymentId) {
  let payment;
  return Payment.findOne({_id: paymentId})
    .then((foundPayment) => {
      if (!foundPayment) throw new Error('NoPayment');

      payment = foundPayment;

      return iamport.payment.cancel({merchant_uid: foundPayment._id.toString()});
    })
    .then((iamportPayment) => {
      if (!iamportPayment) throw new Error('PGServiceDown');

      payment = _.extend(payment, iamportPayment);
      return payment.save();
    })
    .then((payment) => {
      return Promise.all([User.findOne({_id: payment.owner}), payment]);
    })
    .spread((user, payment)=> {
      //상태가 paid cancel_requested cancelled done
      return Promise.all([TransactionService.rollbackPoint(user, payment.invoice), payment]);
    })
    .spread((user, payment) => {
      return payment;
    });
}