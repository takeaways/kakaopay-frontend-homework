'use strict';

/**
 * Created by sungwookim on 09/05/2016
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by sungwookim <ksw1652@gmail.com>, 09/05/2016
 *
 */

/**
 *
 * totalAmount: 총 주문 금액
 * originalAmount: 할인 전 총 주문 금액
 * discountAmount: 총 할인 금액
 * deliveryPrice: 배송료
 * pointPrice: 포인트 사용금액
 * totalQuantity: 총 주문 수량
 * itemList: 주문된 상품 목록
 * paymentType: 결제 종류
 * status: 주문 상태
 * deliveryInfo: 배송지 정보
 * note: 배송시 요청사항
 * refundRequestedAt: 환불 요청 일자
 * views: 조회수
 * isDeleted: 삭제 여부
 * lastUpdatedAt: 최종수정일
 * products: 구매 상품 내역
 * owner: 주인
 * createdBy: 생성자
 * updatedBy: 수정자
 * payments: 결제 정보
 *
 */

module.exports = {
  options: {
    toJSON: {
      transform: function (doc, ret, options) {
        ret.status = getInvoiceStatus(doc);
        return ret;
      },
      virtuals: true
    },
    toObject: {
      transform: function (doc, ret, options) {
        ret.status = getInvoiceStatus(doc);
        return ret;
      },
      virtuals: true
    }
  },
  schema: {
    // Properties
    totalAmount: {type: Number, required: true},
    originalAmount: {type: Number},
    discountAmount: {type: Number},
    pointPrice: {type: Number},
    deliveryPrice: {type: Number},
    totalQuantity: {type: Number},


    /**
     *  itemList: [
     *    {
     *      product: {type: Number, ref:"Product"},
     *      productSnapshot: {type: Schema.Types.Mixed},
     *      optionList: [{
     *        option: {type: Number, ref:"Option"},
     *        optionSnapshot:{type: Schema.Types.Mixed},
     *        quantity: {type: Number},
     *      }],
     *  }],
     */

    itemList: [{
        product: {type: Number, ref:"Product"},
        productSnapshot: {type: Schema.Types.Mixed},
        optionList: [{
          option: {type: Number, ref:"Option"},
          optionSnapshot:{type: Schema.Types.Mixed},
          quantity: {type: Number},
        }],
      }],

    /**
     *      결제 종류
     *
     * card  : 신용카드
     * trans  : 실시간 계좌이체
     * bank : 무통장 입금
     *
     **/
    paymentType: {
      type: String, required: true,
      enum: ['card', 'trans', 'bank']
    },

    deliveryInfo: {type: Object},
    note: {type: String},

    //송장번호 - 일반배송
    deliveryNumber: {type: String},
    //송장번호 - 교환배송
    exchangeDeliveryNumber: {type: String},

    orderCancelledAt: {type: Date},
    deliveryPrepareAt: {type: Date},
    deliveringAt: {type: Date},
    deliveredAt: {type: Date},
    exchangeRequestedAt: {type: Date},
    exchangeDoneAt: {type: Date},
    refundRequestedAt: {type: Date},
    refundDoneAt: {type: Date},
    orderDoneAt: {type: Date},

    views: {type: Number, default: 0},

    isDeleted: {type: Boolean, index: true, default: false},
    // 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date, default: function () {
        return new Date();
      }
    },

    // Associations
    reviewTransactions: [{type: Number, ref: 'ReviewTransaction'}],
    products: [{type: Number, ref: 'Product'}],
    owner: {type: Number, ref: 'User'},
    createdBy: {type: Number, ref: 'User'},
    updatedBy: {type: Number, ref: 'User'}
  },
  virtuals: {
    payments: {ref: 'Payment', localField: '_id', foreignField: 'invoice'}
  },
  cycles: {
    beforeUpdate: function (next) {
      next();
    },
    beforeFind: function (next) {
      this.populate({
        path: 'payments',
        options: {sort: {'createdAt': -1}}
      });
      next();
    },
    beforeFindOne: function (next) {
      this.populate({
        path: 'payments',
        options: {sort: {'createdAt': -1}}
      });
      next();
    }
  },
};

//  * PAYMENT_PENDING    : 결제 대기
//  * PAYMENT_FAILED     : 결제 실패
//  * PAYMENT_DONE       : 결제 완료
//  *
//  * ORDER_CANCELLED    : 주문 취소
//  *
//  * DELIVERY_PREPARE   : 배송 준비
//  * DELIVERING         : 배송 중
//  * DELIVERED          : 배송 완료
//  *
//  * EXCHANGE_REQUESTED : 교환 요청
//  * EXCHANGE_DONE      : 교환 완료
//  *
//  * REFUND_REQUESTED   : 환불 요청
//  * REFUND_DONE        : 환불 완료
//  *
//  * ORDER_DONE         : 주문 완료 ( = 구매 확정 --> 상품 후기 작성 가능)

function getInvoiceStatus(doc) {
  let lastPayment = null;
  if(doc.payments && doc.payments[0]) lastPayment = doc.payments[0];

  if (!lastPayment || lastPayment.status == 'ready') return 'PAYMENT_PENDING';
  else {
    let dateArrays = [
      doc.orderCancelledAt,
      doc.deliveryPrepareAt,
      doc.deliveringAt,
      doc.deliveredAt,
      doc.exchangeRequestedAt,
      doc.exchangeDoneAt,
      doc.refundRequestedAt,
      doc.refundDoneAt,
      doc.orderDoneAt
    ];
    let findLastUpdateStatus = _.max(dateArrays);

    if(!findLastUpdateStatus) {
      if(lastPayment.status == 'failed'){
        return 'PAYMENT_FAILED';
      } else if(lastPayment.status == 'cancel_requested' || lastPayment.status == 'cancelled') {
        return 'ORDER_CANCELLED';
      } else {
        return 'PAYMENT_DONE';
      }
    } else {
      if(findLastUpdateStatus == doc.orderCancelledAt) return 'ORDER_CANCELLED';
      else if(findLastUpdateStatus == doc.deliveryPrepareAt) return 'DELIVERY_PREPARE';
      else if(findLastUpdateStatus == doc.deliveringAt) return 'DELIVERING';
      else if(findLastUpdateStatus == doc.deliveredAt) return 'DELIVERED';
      else if(findLastUpdateStatus == doc.exchangeRequestedAt) return 'EXCHANGE_REQUESTED';
      else if(findLastUpdateStatus == doc.exchangeDoneAt) return 'EXCHANGE_DONE';
      else if(findLastUpdateStatus == doc.refundRequestedAt) return 'REFUND_REQUESTED';
      else if(findLastUpdateStatus == doc.refundDoneAt) return 'REFUND_DONE';
      else if(findLastUpdateStatus == doc.orderDoneAt) return 'ORDER_DONE';
    }
  }
}