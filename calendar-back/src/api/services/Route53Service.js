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
 * Doc URL: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#abortMultipartUpload-property
 *
 */

let Promise = require('bluebird');
let fs = require('fs');
let AWS = require('aws-sdk');

let route53 = new AWS.Route53();

module.exports = {

  // Confirmed Method
  changeResourceRecordSets: changeResourceRecordSets,


  // Methods Need Testing
  associateVPCWithHostedZone: associateVPCWithHostedZone,
  changeTagsForResource: changeTagsForResource,
  createHealthCheck: createHealthCheck,
  createHostedZone: createHostedZone,
  createReusableDelegationSet: createReusableDelegationSet,
  createTrafficPolicy: createTrafficPolicy,
  createTrafficPolicyInstance: createTrafficPolicyInstance,
  createTrafficPolicyVersion: createTrafficPolicyVersion,
  createVPCAssociationAuthorization: createVPCAssociationAuthorization,
  deleteHealthCheck: deleteHealthCheck,
  deleteHostedZone: deleteHostedZone,
  deleteReusableDelegationSet: deleteReusableDelegationSet,
  deleteTrafficPolicy: deleteTrafficPolicy,
  deleteTrafficPolicyInstance: deleteTrafficPolicyInstance,
  deleteVPCAssociationAuthorization: deleteVPCAssociationAuthorization,
  disassociateVPCFromHostedZone: disassociateVPCFromHostedZone,
  getChange: getChange,
  getCheckerIpRanges: getCheckerIpRanges,
  getGeoLocation: getGeoLocation,
  getHealthCheck: getHealthCheck,
  getHealthCheckCount: getHealthCheckCount,
  getHealthCheckLastFailureReason: getHealthCheckLastFailureReason,
  getHealthCheckStatus: getHealthCheckStatus,
  getHostedZone: getHostedZone,
  getHostedZoneCount: getHostedZoneCount,
  getReusableDelegationSet: getReusableDelegationSet,
  getTrafficPolicy: getTrafficPolicy,
  getTrafficPolicyInstance: getTrafficPolicyInstance,
  getTrafficPolicyInstanceCount: getTrafficPolicyInstanceCount,
  listGeoLocations: listGeoLocations,
  listHealthChecks: listHealthChecks,
  listHostedZones: listHostedZones,
  listHostedZonesByName: listHostedZonesByName,
  listResourceRecordSets: listResourceRecordSets,
  listReusableDelegationSets: listReusableDelegationSets,
  listTagsForResource: listTagsForResource,
  listTagsForResources: listTagsForResources,
  listTrafficPolicies: listTrafficPolicies,
  listTrafficPolicyInstances: listTrafficPolicyInstances,
  listTrafficPolicyInstancesByHostedZone: listTrafficPolicyInstancesByHostedZone,
  listTrafficPolicyInstancesByPolicy: listTrafficPolicyInstancesByPolicy,
  listTrafficPolicyVersions: listTrafficPolicyVersions,
  listVPCAssociationAuthorizations: listVPCAssociationAuthorizations,
  testDNSAnswer: testDNSAnswer,
  updateHealthCheck: updateHealthCheck,
  updateHostedZoneComment: updateHostedZoneComment,
  updateTrafficPolicyComment: updateTrafficPolicyComment,
  updateTrafficPolicyInstance: updateTrafficPolicyInstance,
  waitFor: waitFor
};


/**
 *
 *
 *
 * @param params
 */
function associateVPCWithHostedZone(params) {
  return new Promise((resolve, reject) => {
    route53.associateVPCWithHostedZone(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 *
 *
 * @param params
 */
function changeResourceRecordSets(params) {
  return new Promise((resolve, reject) => {
    route53.changeResourceRecordSets(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function changeTagsForResource(params) {
  return new Promise((resolve, reject) => {
    route53.changeTagsForResource(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createHealthCheck(params) {
  return new Promise((resolve, reject) => {
    route53.createHealthCheck(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createHostedZone(params) {
  return new Promise((resolve, reject) => {
    route53.createHostedZone(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createReusableDelegationSet(params) {
  return new Promise((resolve, reject) => {
    route53.createReusableDelegationSet(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createTrafficPolicy(params) {
  return new Promise((resolve, reject) => {
    route53.createTrafficPolicy(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createTrafficPolicyInstance(params) {
  return new Promise((resolve, reject) => {
    route53.createTrafficPolicyInstance(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createTrafficPolicyVersion(params) {
  return new Promise((resolve, reject) => {
    route53.createTrafficPolicyVersion(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createVPCAssociationAuthorization(params) {
  return new Promise((resolve, reject) => {
    route53.createVPCAssociationAuthorization(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function deleteHealthCheck(params) {
  return new Promise((resolve, reject) => {
    route53.deleteHealthCheck(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function deleteHostedZone(params) {
  return new Promise((resolve, reject) => {
    route53.deleteHostedZone(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function deleteReusableDelegationSet(params) {
  return new Promise((resolve, reject) => {
    route53.deleteReusableDelegationSet(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function deleteTrafficPolicy(params) {
  return new Promise((resolve, reject) => {
    route53.deleteTrafficPolicy(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function deleteTrafficPolicyInstance(params) {
  return new Promise((resolve, reject) => {
    route53.deleteTrafficPolicyInstance(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function deleteVPCAssociationAuthorization(params) {
  return new Promise((resolve, reject) => {
    route53.deleteVPCAssociationAuthorization(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function disassociateVPCFromHostedZone(params) {
  return new Promise((resolve, reject) => {
    route53.disassociateVPCFromHostedZone(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getChange(params) {
  return new Promise((resolve, reject) => {
    route53.getChange(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getCheckerIpRanges(params) {
  return new Promise((resolve, reject) => {
    route53.getCheckerIpRanges(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getGeoLocation(params) {
  return new Promise((resolve, reject) => {
    route53.getGeoLocation(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getHealthCheck(params) {
  return new Promise((resolve, reject) => {
    route53.getHealthCheck(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getHealthCheckCount(params) {
  return new Promise((resolve, reject) => {
    route53.getHealthCheckCount(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getHealthCheckLastFailureReason(params) {
  return new Promise((resolve, reject) => {
    route53.getHealthCheckLastFailureReason(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getHealthCheckStatus(params) {
  return new Promise((resolve, reject) => {
    route53.getHealthCheckStatus(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getHostedZone(params) {
  return new Promise((resolve, reject) => {
    route53.getHostedZone(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getHostedZoneCount(params) {
  return new Promise((resolve, reject) => {
    route53.getHostedZoneCount(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getReusableDelegationSet(params) {
  return new Promise((resolve, reject) => {
    route53.getReusableDelegationSet(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getTrafficPolicy(params) {
  return new Promise((resolve, reject) => {
    route53.getTrafficPolicy(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getTrafficPolicyInstance(params) {
  return new Promise((resolve, reject) => {
    route53.getTrafficPolicyInstance(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getTrafficPolicyInstanceCount(params) {
  return new Promise((resolve, reject) => {
    route53.getTrafficPolicyInstanceCount(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listGeoLocations(params) {
  return new Promise((resolve, reject) => {
    route53.listGeoLocations(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listHealthChecks(params) {
  return new Promise((resolve, reject) => {
    route53.listHealthChecks(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listHostedZones(params) {
  return new Promise((resolve, reject) => {
    route53.listHostedZones(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listHostedZonesByName(params) {
  return new Promise((resolve, reject) => {
    route53.listHostedZonesByName(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listResourceRecordSets(params) {
  return new Promise((resolve, reject) => {
    route53.listResourceRecordSets(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listReusableDelegationSets(params) {
  return new Promise((resolve, reject) => {
    route53.listReusableDelegationSets(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listTagsForResource(params) {
  return new Promise((resolve, reject) => {
    route53.listTagsForResource(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listTagsForResources(params) {
  return new Promise((resolve, reject) => {
    route53.listTagsForResources(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listTrafficPolicies(params) {
  return new Promise((resolve, reject) => {
    route53.listTrafficPolicies(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listTrafficPolicyInstances(params) {
  return new Promise((resolve, reject) => {
    route53.listTrafficPolicyInstances(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listTrafficPolicyInstancesByHostedZone(params) {
  return new Promise((resolve, reject) => {
    route53.listTrafficPolicyInstancesByHostedZone(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listTrafficPolicyInstancesByPolicy(params) {
  return new Promise((resolve, reject) => {
    route53.listTrafficPolicyInstancesByPolicy(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listTrafficPolicyVersions(params) {
  return new Promise((resolve, reject) => {
    route53.listTrafficPolicyVersions(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listVPCAssociationAuthorizations(params) {
  return new Promise((resolve, reject) => {
    route53.listVPCAssociationAuthorizations(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function testDNSAnswer(params) {
  return new Promise((resolve, reject) => {
    route53.testDNSAnswer(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function updateHealthCheck(params) {
  return new Promise((resolve, reject) => {
    route53.updateHealthCheck(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function updateHostedZoneComment(params) {
  return new Promise((resolve, reject) => {
    route53.updateHostedZoneComment(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function updateTrafficPolicyComment(params) {
  return new Promise((resolve, reject) => {
    route53.updateTrafficPolicyComment(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function updateTrafficPolicyInstance(params) {
  return new Promise((resolve, reject) => {
    route53.updateTrafficPolicyInstance(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function waitFor(params) {
  return new Promise((resolve, reject) => {
    route53.waitFor(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}


