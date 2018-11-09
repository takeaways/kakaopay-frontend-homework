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

let Promise = require('bluebird');

let logger = Bifido.logger('TransactionController');

module.exports = {
  // User
  myInvoices: myInvoices,

  // 결제 요청전
  pendingPayment: pendingPayment,
  // 결제 요청 후
  myInvoice: myInvoice,

  failPayment: failPayment,
  cancelPaymentForUser: cancelPaymentForUser,

  // Admin
  findInvoice: findInvoice,
  findOneInvoice: findOneInvoice,
  changeStatus: changeStatus,
};

function myInvoices(req, res) {
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;
      params.query.owner = req.user._id;

      let queryPromise = Invoice.find(params.query);

      // Limit
      if (params.limit && params.limit > 0) {
        params.limit++;
        queryPromise = queryPromise.limit(params.limit);
      }

      // Skip
      if (params.skip)
        queryPromise = queryPromise.skip(params.skip);

      // Sort
      if (params.sort)
        queryPromise = queryPromise.sort(params.sort);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      // Count
      let countPromise = Invoice.count(params.query);

      TransactionService.rollback();

      return Promise.all([queryPromise, countPromise]);
    })
    .spread((invoices, count) => {
      return res.ok({invoices: invoices, total: count});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      res.internalServer();
    });
}

/**
 *  결제 준비 Logic
 */
function pendingPayment(req, res) {
  if (typeof(req.body.totalAmount) != 'number' ||
    typeof(req.body.originalAmount) != 'number' ||
    typeof(req.body.discountAmount) != 'number' ||
    typeof(req.body.pointPrice) != 'number' ||
    (!req.body.deliveryPrice || typeof(req.body.deliveryPrice) != 'number') ||
    !req.body.paymentType ||
    !req.body.itemList ||
    (!req.body.deliveryInfo.name || req.body.deliveryInfo.name == '') ||
    (!req.body.deliveryInfo.mobile || req.body.deliveryInfo.mobile == '') ||
    (!req.body.deliveryInfo.identifier || req.body.deliveryInfo.identifier == '') ||
    (!req.body.deliveryInfo.addressInfo.address || req.body.deliveryInfo.addressInfo.address == '') ||
    (!req.body.deliveryInfo.detailAddress || req.body.deliveryInfo.detailAddress == '')) {
    return res.badRequest();
  }

  let invoice = {};

  /**
   *  결제 가격 계산
   */
  let productIds = _.map(req.body.itemList, 'product');

  return Product.find({_id: {$in: productIds}, isDeleted: false})
    .populate({path: 'options'})
    .then((products) => {
      //TODO: 1. 상품 존재여부 체크
      let findProductIds = _.uniq(_.map(products, '_id'));
      let differenceIds = _.difference(productIds, findProductIds);
      if (products.length <= 0 || differenceIds.length > 0) throw new Error('ProductNotFound');

      //TODO: 2. 상품 변경 여부 체크
      let changeProduct = false;
      _.forEach(req.body.itemList, (item) => {
        _.forEach(products, (product) => {
          if (product['_id'] == item['product']) {
            if (product['lastUpdatedAt'] > item['product'].lastUpdatedAt) {
              changeProduct = true;
            }
          }
        })
      });
      if (changeProduct) throw new Error('ChangeProduct');

      let totalAmount = 0;
      let originalAmount = 0;
      let deliveryPrice = 0;

      //TODO: 3. originalAmount 체크 (할인 전 총 주문 금액)
      _.forEach(req.body.itemList, item => {
        let currentProductByFind = _.find(products, (product) => {
          return product._id == item.product;
        });

        let currentPrice = 0;

        //일반가, 할인가, 임직원가
        if (currentProductByFind.salePrice)
          currentPrice = currentProductByFind.salePrice;

        if (currentProductByFind.employeePrice && req.user && req.user.role == '임직원')
          currentPrice = currentProductByFind.employeePrice;

        if (!currentProductByFind.salePrice && !(currentProductByFind.employeePrice && req.user && req.user.role == '임직원'))
          currentPrice = currentProductByFind.price;

        _.forEach(item.optionList, optionItem => {
          let optionIndex = _.findIndex(currentProductByFind.options, option => {
            return optionItem.option == option._id;
          });

          //find한 Product에서는 옵션에 대한 가격 정보 필요, 클라이언트에서 가져온 itemList에서는 갯수 필요
          originalAmount += (currentPrice + currentProductByFind.options[optionIndex].price) * optionItem.quantity;
        });
      });

      //TODO: 3. deliveryPrice 체크
      if (originalAmount >= 50000) deliveryPrice = 0;
      else deliveryPrice = 2500;

      //TODO: 4. 포인트 사용 가능 여부 체크
      if (req.body.pointPrice <= req.user.currentPoint)
        totalAmount = originalAmount - req.body.pointPrice + deliveryPrice;
      else
        throw new Error('PointDisable');

      //TODO: 5. totalAmount 체크 (총 주문금액 - (포인트 사용금액 + <쿠폰 할인금액>) + 배송 금액)
      if ((originalAmount != req.body.originalAmount) ||
        (deliveryPrice != req.body.deliveryPrice) ||
        (totalAmount != req.body.totalAmount))
        throw new Error('PriceMissMatch');

      /**
       *  계산된 가격으로 명세서 발급
       */

      invoice.createdBy = req.user._id;
      invoice.updatedBy = req.user._id;
      invoice.owner = req.user._id;

      invoice.totalAmount = req.body.totalAmount;
      invoice.originalAmount = req.body.originalAmount;
      invoice.discountAmount = req.body.discountAmount;
      invoice.pointPrice = req.body.pointPrice;
      invoice.deliveryPrice = req.body.deliveryPrice;
      invoice.totalQuantity = req.body.totalQuantity;
      invoice.itemList = req.body.itemList;
      invoice.paymentType = req.body.paymentType;
      invoice.deliveryInfo = req.body.deliveryInfo;

      invoice.products = productIds;

      return Invoice.create(invoice)
    })
    .then((invoice) => {
      let name = 'Bifido 구매: ' + invoice.itemList[0].productSnapshot.name;
      if (invoice.itemList.length > 1)
        name += '외 ' + (invoice.itemList.length - 1) + '건';

      /**
       *  아임포트 결제 결과 내역서 준비로 작성
       */
      let payment = {
        paymentType: invoice.paymentType,
        status: 'ready',
        name: name,
        paid_amount: invoice.totalAmount,
        invoice: invoice._id,
        createdBy: req.user._id,
        updatedBy: req.user._id,
        owner: req.user._id
      };

      return Payment.create(payment);
    })
    .then((payment) => {
      let usedPoint = {
        action: 'UsePoint',
        score: req.body.pointPrice * -1,
        owner: req.user._id
      };

      //포인트 적립(구매금액의 3%)
      let accumulatePoint = {
        action: 'AfterPayment',
        score: Math.floor(req.body.totalAmount * 0.03),
        owner: req.user._id
      };

      req.user.currentPoint = req.user.currentPoint + (req.body.pointPrice * -1) + Math.floor(req.body.totalAmount * 0.03);

      return Promise.all([payment, Point.create(usedPoint), Point.create(accumulatePoint), req.user.save()])
    })
    .spread(function (payment, usedPoint, accumulatePoint, user) {
      let useTransaction = {
        invoice: payment.invoice,
        point: usedPoint._id,
        owner: user._id
      };

      let accumulateTransaction = {
        invoice: payment.invoice,
        point: accumulatePoint._id,
        owner: user._id
      };

      return Promise.all([PointTransaction.create(useTransaction), PointTransaction.create(accumulateTransaction), payment]);
    })
    .spread((useTransaction, accumulateTransaction, payment) => {
      return res.ok({payment: payment});
    })
    .catch((err) => {
      console.log("err :::\n", err);
      if (err.message === 'ProductNotFound')
        return res.badRequest();

      if (err.message === 'ChangeProduct')
        return res.notAcceptable({
          name: 'NotAcceptable',
          message: 'ChangeProduct'
        });

      if (err.message === 'PriceMissMatch') {
        return res.notAcceptable({
          name: 'NotAcceptable',
          message: 'PriceMissMatch'
        });
      }

      if (err.message === 'PointDisable') {
        return res.notAcceptable({
          name: 'NotAcceptable',
          message: 'PointDisable'
        });
      }

      if (err.message === 'InvalidCard')
        return res.paymentRequired();

      if (err.message === 'FailedTransactionCard')
        return res.preconditionFailed();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function myInvoice(req, res) {
  let updatePayment;
  req.buildQuery()
    .then((params) => {
      // TODO remove commend later
      // params.query.owner = req.user._id;
      let queryPromise = Invoice.findOne(params.query);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      queryPromise = queryPromise.populate({path: 'payments', match: {status: 'ready'}, sort: {createdAt: -1}});

      TransactionService.rollback();

      return queryPromise;
    })
    .then((invoice) => {
      if (!invoice) throw new Error('InvoiceNotFound');

      if (invoice && invoice.payments && invoice.payments.length > 0) {

        return new Promise((resolve, reject) => {

          TransactionService.check(invoice.payments[0]._id)
            .then((payment) => {
              updatePayment = invoice.payments[0];

              let cancelPromise;

              updatePayment.status = payment.status;

              if (payment.amount != invoice.totalAmount) {
                updatePayment.status = 'failed';
                cancelPromise = TransactionService.cancel(updatePayment._id);
              }

              let promises = [updatePayment.save()];

              if (cancelPromise)
                promises.push(cancelPromise);

              return promises;
            })
            .spread(() => {
              return resolve(invoice);
            })
            .catch(() => {
              updatePayment.status = 'failed';
              updatePayment.save();
              return resolve(invoice);
            })
        })

      } else return invoice;
    })
    .then((invoice) => {

      invoice.views++;
      invoice.save();

      let resp = {invoice: invoice};

      if (updatePayment) {
        resp.result = updatePayment.status;
      }

      res.ok(resp);
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'InvoiceNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}


function failPayment(req, res) {
  let paymentInfo = req.body.paymentInfo;
  if (!paymentInfo._id) return res.badRequest();

  Payment.findOne({_id: paymentInfo._id})
    .then((payment) => {
      if (!payment) throw new Error('PaymentNotFound');
      payment.status = 'failed';

      return payment.save();
    })
    .then((payment) => {
      //TODO: 포인트 rollback 코드
      return Promise.all([TransactionService.rollbackPoint(req.user, payment.invoice), payment]);
    })
    .spread((user, payment) => {
      return res.ok({payment: payment});
    })
    .catch((err) => {
      if (err.message === 'PaymentNotFound' ||
        err.message === 'PointTransactionNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function cancelPaymentForUser(req, res) {
  if (!req.body.paymentId) return res.badRequest();

  Payment.findOne({_id: req.body.paymentId})
    .then((payment) => {
      if (!payment) throw new Error('PaymentNotFound');

      if (payment.paymentType == 'bank' && (payment.status == 'ready' || payment.status == 'paid')) {
        payment.status = 'cancelled';
        return payment.save();
      } else if (payment.paymentType == 'card' || payment.paymentType == 'trans') {
        if (payment.status == 'ready') {
          payment.status = 'cancelled';
          return payment.save();
        } else if (payment.status == 'paid') {
          return TransactionService.cancel(payment._id);
        } else {
          throw new Error('NeedCheckStatus');
        }
      } else {
        throw new Error('NeedCheckStatus');
      }
    })
    .then((payment) => {
      return res.ok({payment: payment});
    })
    .catch((err) => {
      if (err.message === 'PaymentNotFound' || err.message === 'NeedCheckStatus')
        return res.badRequest();

      if (err.message === 'PGServiceDown')
        return res.unprocessableEntity();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function findInvoice(req, res) {
  let params;

  req.buildQuery()
    .then((_params) => {
      params = _params;

      let queryPromise = Invoice.find(params.query);

      // Limit
      if (params.limit && params.limit > 0) {
        params.limit++;
        queryPromise = queryPromise.limit(params.limit);
      }

      // Skip
      if (params.skip)
        queryPromise = queryPromise.skip(params.skip);

      // Sort
      if (params.sort)
        queryPromise = queryPromise.sort(params.sort);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      // Count
      let countPromise = Invoice.count(params.query);

      TransactionService.rollback();
      return Promise.all([queryPromise, countPromise]);
    })
    .spread((invoices, count) => {
      // See if there's more
      let more = (invoices[params.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more) invoices.splice(params.limit - 1, 1);

      return res.ok({invoices: invoices, more: more, total: count});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      res.internalServer();
    });
}

function findOneInvoice(req, res) {
  req.buildQuery()
    .then((params) => {
      let queryPromise = Invoice.findOne(params.query);

      // Populate
      if (params.populate) {
        if (Array.isArray(params.populate))
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        else
          queryPromise = queryPromise.populate(params.populate);
      }

      TransactionService.rollback();
      return queryPromise;
    })
    .then((invoice) => {
      if (!invoice) throw new Error('InvoiceNotFound');

      invoice.views++;
      invoice.save();
      res.ok({invoice: invoice});
    })
    .catch((err) => {
      if (err.message === 'InvalidParameter'
        || err.message === 'InvoiceNotFound')
        return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function changeStatus(req, res) {
  if (
    !req.body.paymentId || !req.body.status ||
    req.body.status == 'PAYMENT_PENDING' ||
    req.body.status == 'PAYMENT_FAILED'
  )
    return res.badRequest();

  Payment.findOne({_id: req.body.paymentId})
    .then((payment) => {
      if (!payment) throw new Error('PaymentNotFound');
      if (payment.paymentType != 'bank' && req.body.status == 'PAYMENT_DONE') throw new Error('DoNotChangeStatus');

      let promises = [Invoice.findOne({_id: payment.invoice})];

      switch (req.body.status) {
        case 'PAYMENT_DONE':
          if (payment.paymentType == 'bank') {
            payment.status = 'paid';
            payment.updatedBy = req.body.user;
            promises.push(payment.save());
          }
          break;
        case 'DELIVERY_PREPARE':
        case 'DELIVERING':
        case 'DELIVERED':
        case 'EXCHANGE_REQUESTED':
        case 'EXCHANGE_DONE':
        case 'REFUND_REQUESTED':
        case 'ORDER_DONE':
          payment.status = 'done';
          payment.updatedBy = req.body.user;
          promises.push(payment.save());
          break;
        case 'ORDER_CANCELLED':
        case 'REFUND_DONE':
          if (payment.paymentType == 'bank') {
            payment.status = 'cancelled';
            payment.updatedBy = req.body.user;
            promises.push(payment.save());
          } else {
            promises.push(TransactionService.cancel(payment._id));
          }
          break;
      }

      return promises;
    })
    .spread((invoice) => {
      let promises = [];
      switch (req.body.status) {
        case 'ORDER_CANCELLED':
          invoice.orderCancelledAt = new Date();
          break;
        case 'DELIVERY_PREPARE':
          invoice.deliveryPrepareAt = new Date();
          break;
        case 'DELIVERING':
          invoice.deliveringAt = new Date();
          invoice.deliveryNumber = req.body.deliveryNumber;
          break;
        case 'DELIVERED':
          invoice.deliveredAt = new Date();
          break;
        case 'EXCHANGE_REQUESTED':
          invoice.exchangeRequestedAt = new Date();
          invoice.exchangeDeliveryNumber = req.body.deliveryNumber;
          break;
        case 'EXCHANGE_DONE':
          invoice.exchangeDoneAt = new Date();
          break;
        case 'REFUND_REQUESTED':
          invoice.refundRequestedAt = new Date();
          break;
        case 'REFUND_DONE':
          invoice.refundDoneAt = new Date();
          break;
        case 'ORDER_DONE': {
          //TODO: 사용자에 의한 '구매확정' 상태가 되면 리뷰를 쓸수 있도록 하기 위해 ReviewTransaction 모델을 생성
          invoice.orderDoneAt = new Date();
          _.forEach(invoice.products, product => {
            promises.push(ReviewTransaction.create({
              invoice: invoice._id,
              product: product,
              owner: req.user._id
            }));
          });
          break;
        }
      }

      invoice.updatedBy = req.body.user;

      promises.push(invoice.save());

      return Promise.all(promises);
    })
    .then((result) => {
      if(result.length > 1) {
        for(let i=0; i < result.length-1; i++) {
          result[result.length - 1].reviewTransactions.push(result[i]._id);
        }

        return result[result.length - 1].save();
      } else {
        return result[0];
      }
    })
    .then((invoice) => {
      res.ok({invoice: invoice});
    })
    .catch((err) => {
      if (err.message === 'PaymentNotFound' || err.message === 'DoNotChangeStatus') return res.badRequest();

      if (
        err.message === 'PGServiceDown' ||
        err.message.indexOf('IAMPORT') || err.message.indexOf('iamport') ||
        err.code && (err.code.indexOf('IAMPORT') || err.code.indexOf('iamport'))
      )
        return res.unprocessableEntity();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}