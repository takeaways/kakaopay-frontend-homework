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

/**
 *
 * _id: merchant_uid로 사용 및 무통장 이체에 ref No.로 사용합니다.
 * paymentType: 결제 종류
 * status: 결제 상태
 * isDeleted: 삭제 여부
 * lastUpdatedAt: 최종수정일
 * owner: 주인
 * createdBy: 생성자
 * updatedBy: 수정자
 *
 */

module.exports = {
  indexes: [],
  disabledPlugin: {
    AutoIncrement: true
  },
  schema: {
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
      enum: [
        'card',
        'trans',
        'bank'
      ]
    },

    /**
     * !!!!!!!!이 Enum은 iamport에서 넘어오기 때문에 style guide를 준수 하지 않습니다.!!!!!!!
     *  1. (결제 대기) : 'ready' in IAMPORT
     *
     *  2. (결제 완료) : 'paid' in IAMPORT
     *
     *  3. (결제 실패) : 'failed' in IAMPORT
     *
     *  4. (결제 취소) : 'cancelled' in IAMPORT
     *
     *  5. (완료) : 'done' in Bifido
     *
     **/
    status: {
      type: String,
      enum: ['ready', 'paid', 'failed', 'cancel_requested', 'cancelled', 'done'],
      default: 'ready'
    },

    /**
     * 어플리캣에서 파악 할수 있는 에러 메세지를 담는 곳
     * 만약에 파악할수 없으면 PG사한테 책임전가
     **/
    message: {type: String},

    imp_uid: {type: String},
    merchant_uid: {type: String},
    pay_method: {type: String},
    pg_provider: {type: String},
    pg_tid: {type: String},
    escrow: {type: Boolean},
    apply_num: {type: String},
    bank_code: {type: String},
    bank_name: {type: String},
    card_code: {type: String},
    card_name: {type: String},
    card_quota: {type: Number},
    vbank_code: {type: String},
    vbank_name: {type: String},
    vbank_num: {type: String},
    vbank_holder: {type: String},
    vbank_date: {type: Number},
    name: {type: String},
    paid_amount: {type: Number},
    cancel_amount: {type: Number},
    buyer_name: {type: String},
    buyer_email: {type: String},
    buyer_tel: {type: String},
    buyer_addr: {type: String},
    buyer_postcode: {type: String},
    custom_data: {type: Object},
    user_agent: {type: String},
    paid_at: {type: Date},
    failed_at: {type: Date},
    cancelled_at: {type: Date},
    fail_reason: {type: String},
    cancel_reason: {type: String},
    receipt_url: {type: String},
    cancel_history: {type: Object},
    cancel_receipt_urls: {type: Array},
    cash_receipt_issued: {type: Boolean},

    isDeleted: {type: Boolean, index: true, default: false},

    // / 수정순으로 가져올때 사용됨
    lastUpdatedAt: {
      type: Date,
      default: function () {
        return new Date();
      }
    },

    // Associations
    invoice: {type: Number, ref: 'Invoice', require: true},
    owner: {type: Number, ref: 'User'},
    createdBy: {type: Number, ref: 'User'},
    updatedBy: {type: Number, ref: 'User'}
  },
  cycles: {
    beforeUpdate: function (next) {
      next();
    }
  }
};