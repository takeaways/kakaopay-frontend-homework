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

let cloudfront = new AWS.CloudFront();

module.exports = {

  // Confirmed Method


  // Methods Need Testing
  createCloudFrontOriginAccessIdentity: createCloudFrontOriginAccessIdentity,
  createDistribution: createDistribution,
  createDistributionWithTags: createDistributionWithTags,
  createInvalidation: createInvalidation,
  createStreamingDistribution: createStreamingDistribution,
  createStreamingDistributionWithTags: createStreamingDistributionWithTags,
  deleteCloudFrontOriginAccessIdentity: deleteCloudFrontOriginAccessIdentity,
  deleteDistribution: deleteDistribution,
  deleteStreamingDistribution: deleteStreamingDistribution,
  getCloudFrontOriginAccessIdentity: getCloudFrontOriginAccessIdentity,
  getCloudFrontOriginAccessIdentityConfig: getCloudFrontOriginAccessIdentityConfig,
  getDistribution: getDistribution,
  getDistributionConfig: getDistributionConfig,
  getInvalidation: getInvalidation,
  getStreamingDistribution: getStreamingDistribution,
  getStreamingDistributionConfig: getStreamingDistributionConfig,
  listCloudFrontOriginAccessIdentities: listCloudFrontOriginAccessIdentities,
  listDistributions: listDistributions,
  listDistributionsByWebACLId: listDistributionsByWebACLId,
  listInvalidations: listInvalidations,
  listStreamingDistributions: listStreamingDistributions,
  listTagsForResource: listTagsForResource,
  setupRequestListeners: setupRequestListeners,
  untagResource: untagResource,
  updateCloudFrontOriginAccessIdentity: updateCloudFrontOriginAccessIdentity,
  updateDistribution: updateDistribution,
  updateStreamingDistribution: updateStreamingDistribution,
  waitFor: waitFor,

};

function createCloudFrontOriginAccessIdentity(params) {
  return new Promise((resolve, reject) => {
    cloudfront.createCloudFrontOriginAccessIdentity(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createDistribution(params) {
  return new Promise((resolve, reject) => {
    cloudfront.createDistribution(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createDistributionWithTags(params) {
  return new Promise((resolve, reject) => {
    cloudfront.createDistributionWithTags(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createInvalidation(params) {
  return new Promise((resolve, reject) => {
    cloudfront.createInvalidation(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createStreamingDistribution(params) {
  return new Promise((resolve, reject) => {
    cloudfront.createStreamingDistribution(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function createStreamingDistributionWithTags(params) {
  return new Promise((resolve, reject) => {
    cloudfront.createStreamingDistributionWithTags(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function deleteCloudFrontOriginAccessIdentity(params) {
  return new Promise((resolve, reject) => {
    cloudfront.deleteCloudFrontOriginAccessIdentity(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function deleteDistribution(params) {
  return new Promise((resolve, reject) => {
    cloudfront.deleteDistribution(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function deleteStreamingDistribution(params) {
  return new Promise((resolve, reject) => {
    cloudfront.deleteStreamingDistribution(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getCloudFrontOriginAccessIdentity(params) {
  return new Promise((resolve, reject) => {
    cloudfront.getCloudFrontOriginAccessIdentity(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getCloudFrontOriginAccessIdentityConfig(params) {
  return new Promise((resolve, reject) => {
    cloudfront.getCloudFrontOriginAccessIdentityConfig(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getDistribution(params) {
  return new Promise((resolve, reject) => {
    cloudfront.getDistribution(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getDistributionConfig(params) {
  return new Promise((resolve, reject) => {
    cloudfront.getDistributionConfig(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getInvalidation(params) {
  return new Promise((resolve, reject) => {
    cloudfront.getInvalidation(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getStreamingDistribution(params) {
  return new Promise((resolve, reject) => {
    cloudfront.getStreamingDistribution(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function getStreamingDistributionConfig(params) {
  return new Promise((resolve, reject) => {
    cloudfront.getStreamingDistributionConfig(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listCloudFrontOriginAccessIdentities(params) {
  return new Promise((resolve, reject) => {
    cloudfront.listCloudFrontOriginAccessIdentities(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listDistributions(params) {
  return new Promise((resolve, reject) => {
    cloudfront.listDistributions(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listDistributionsByWebACLId(params) {
  return new Promise((resolve, reject) => {
    cloudfront.listDistributionsByWebACLId(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listInvalidations(params) {
  return new Promise((resolve, reject) => {
    cloudfront.listInvalidations(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function listStreamingDistributions(params) {
  return new Promise((resolve, reject) => {
    cloudfront.listStreamingDistributions(params, function (err, data) {
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
    cloudfront.listTagsForResource(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function setupRequestListeners(params) {
  return new Promise((resolve, reject) => {
    cloudfront.setupRequestListeners(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function untagResource(params) {
  return new Promise((resolve, reject) => {
    cloudfront.untagResource(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function updateCloudFrontOriginAccessIdentity(params) {
  return new Promise((resolve, reject) => {
    cloudfront.updateCloudFrontOriginAccessIdentity(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function updateDistribution(params) {
  return new Promise((resolve, reject) => {
    cloudfront.updateDistribution(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 */
function updateStreamingDistribution(params) {
  return new Promise((resolve, reject) => {
    cloudfront.updateStreamingDistribution(params, function (err, data) {
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
    cloudfront.waitFor(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 */

