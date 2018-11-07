'use strict';

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