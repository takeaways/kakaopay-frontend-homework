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

module.exports.security = {
  /**
   * Server domain, _id is required
   * Server drop: drop server and it's domain data
   *
   * User drop: removes user within server
   * User _id, password is required
   *
   * MockData drop: remove model within server.
   * Allowed MockData Model in Server:
   * Comment, Coupon, CouponIssued, Criteria, Device, Event, EventAdmission, Gallery
   * Intro, Product, Order
   *
   */

  defaultRole: '사용자',
};