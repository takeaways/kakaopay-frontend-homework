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

let s3 = new AWS.S3();

module.exports = {

  // Confirmed Method
  getObject: getObject,
  listObjectsV2: listObjectsV2,
  copyFolder: copyFolder,
  copyObject: copyObject,
  upload: upload,
  deleteObjects: deleteObjects,
  deleteFolder: deleteFolder,
  abortMultipartUpload: abortMultipartUpload,
  headBucket: headBucket, // Check bucket exist?
  createBucket: createBucket,
  putBucketWebsite: putBucketWebsite,


  // Methods Need Testing
  completeMultipartUpload: completeMultipartUpload,
  createMultipartUpload: createMultipartUpload,
  deleteBucket: deleteBucket,
  deleteBucketCors: deleteBucketCors,
  deleteBucketLifecycle: deleteBucketLifecycle,
  deleteBucketPolicy: deleteBucketPolicy,
  deleteBucketReplication: deleteBucketReplication,
  deleteBucketTagging: deleteBucketTagging,
  deleteBucketWebsite: deleteBucketWebsite,
  deleteObject: deleteObject,
  getBucketAccelerateConfiguration: getBucketAccelerateConfiguration,
  getBucketAcl: getBucketAcl,
  getBucketCors: getBucketCors,
  getBucketLifecycle: getBucketLifecycle,
  getBucketLifecycleConfiguration: getBucketLifecycleConfiguration,
  getBucketLocation: getBucketLocation,
  getBucketLogging: getBucketLogging,
  getBucketNotification: getBucketNotification,
  getBucketNotificationConfiguration: getBucketNotificationConfiguration,
  getBucketPolicy: getBucketPolicy,
  getBucketReplication: getBucketReplication,
  getBucketRequestPayment: getBucketRequestPayment,
  getBucketTagging: getBucketTagging,
  getBucketVersioning: getBucketVersioning,
  getBucketWebsite: getBucketWebsite,
  getObjectAcl: getObjectAcl,
  getObjectTorrent: getObjectTorrent,
  getSignedUrl: getSignedUrl,
  headObject: headObject,
  listBuckets: listBuckets,
  listMultipartUploads: listMultipartUploads,
  listObjects: listObjects,

  listObjectVersions: listObjectVersions,
  listParts: listParts,
  putBucketAccelerateConfiguration: putBucketAccelerateConfiguration,
  putBucketAcl: putBucketAcl,
  putBucketCors: putBucketCors,
  putBucketLifecycle: putBucketLifecycle,
  putBucketLifecycleConfiguration: putBucketLifecycleConfiguration,
  putBucketLogging: putBucketLogging,
  putBucketNotification: putBucketNotification,
  putBucketNotificationConfiguration: putBucketNotificationConfiguration,
  putBucketPolicy: putBucketPolicy,
  putBucketReplication: putBucketReplication,
  putBucketRequestPayment: putBucketRequestPayment,
  putBucketTagging: putBucketTagging,
  putBucketVersioning: putBucketVersioning,

  putObject: putObject,
  putObjectAcl: putObjectAcl,
  restoreObject: restoreObject,
  uploadPart: uploadPart,
  uploadPartCopy: uploadPartCopy,
  waitFor: waitFor
};


/**
 * let params = {
    Bucket: bucketName,
    Prefix: 'folder/'
  };
 * @param params
 * @return {Promise}
 */
function deleteFolder(params) {
  let bucketName = params.Bucket;

  return listObjects(params)
    .then((data) => {

      if (data.Contents.length == 0) return null;

      params = {Bucket: bucketName};
      params.Delete = {Objects: []};

      data.Contents.forEach(function (content) {
        params.Delete.Objects.push({Key: content.Key});
      });

      return deleteObjects(params);
    });
}

/**
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    UploadId: 'STRING_VALUE', //required
    RequestPayer: 'requester'
  };
 * @param params
 * @return {Promise}
 */
function abortMultipartUpload(params) {
  return new Promise((resolve, reject) => {
    s3.abortMultipartUpload(params, function (err, data) {
      if (err) reject(err);             // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * let params = {
    Bucket: 'STRING_VALUE',     //required
    Key: 'STRING_VALUE',        //required
    UploadId: 'STRING_VALUE',   //required
    MultipartUpload: {
      Parts: [
        {
          ETag: 'STRING_VALUE',
          PartNumber: 0
        },
        // more items
      ]
    },
    RequestPayer: 'requester'
  };
 *
 * @param params
 * @return {Promise}
 */
function completeMultipartUpload(params) {
  return new Promise((resolve, reject) => {
    s3.completeMultipartUpload(params, function (err, data) {
      if (err) reject(err);             // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**

 * let params = {
    Bucket: bucketName,
    Prefix: 'folder/'
  };

 let params = {
    Bucket: Bifido.config.connections.s3.templates.bucket,
    Prefix: req.query.status + '/' + req.query.id
    To:
  };

 * @param params
 * @return {Promise}
 */
function copyFolder(params, fromBucket, from, toBucket, to) {
  let copyParams = _.clone(params);

  delete params.ACL;
  let listParams = _.clone(params);
  listParams.Bucket = fromBucket;
  listParams.Prefix = from;


  return listObjects(listParams)
    .then((data) => {
      let promises = [];

      data.Contents.forEach(function (content) {
        copyParams.Bucket = toBucket;
        copyParams.CopySource = fromBucket + '/' + content.Key;
        copyParams.Key = content.Key.replace(from, to);
        promises.push(copyObject(copyParams));
      });

      return promises;
    });
}


/**
 *
 *
 *  let params = {
    Bucket: 'STRING_VALUE', //required
    CopySource: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    ACL: 'private | public-read | public-read-write | authenticated-read | aws-exec-read | bucket-owner-read | bucket-owner-full-control',
    CacheControl: 'STRING_VALUE',
    ContentDisposition: 'STRING_VALUE',
    ContentEncoding: 'STRING_VALUE',
    ContentLanguage: 'STRING_VALUE',
    ContentType: 'STRING_VALUE',
    CopySourceIfMatch: 'STRING_VALUE',
    CopySourceIfModifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    CopySourceIfNoneMatch: 'STRING_VALUE',
    CopySourceIfUnmodifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    CopySourceSSECustomerAlgorithm: 'STRING_VALUE',
    CopySourceSSECustomerKey: new Buffer('...') || 'STRING_VALUE',
    CopySourceSSECustomerKeyMD5: 'STRING_VALUE',
    Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    GrantFullControl: 'STRING_VALUE',
    GrantRead: 'STRING_VALUE',
    GrantReadACP: 'STRING_VALUE',
    GrantWriteACP: 'STRING_VALUE',
    Metadata: {
      someKey: 'STRING_VALUE',
      // anotherKey
    },
    MetadataDirective: 'COPY | REPLACE',
    RequestPayer: 'requester',
    SSECustomerAlgorithm: 'STRING_VALUE',
    SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
    SSECustomerKeyMD5: 'STRING_VALUE',
    SSEKMSKeyId: 'STRING_VALUE',
    ServerSideEncryption: 'AES256 | aws:kms',
    StorageClass: 'STANDARD | REDUCED_REDUNDANCY | STANDARD_IA',
    WebsiteRedirectLocation: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function copyObject(params) {
  return new Promise((resolve, reject) => {
    s3.copyObject(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    ACL: 'private | public-read | public-read-write | authenticated-read',
    CreateBucketConfiguration: {
      LocationConstraint: 'EU | eu-west-1 | us-west-1 | us-west-2 | ap-south-1 | ap-southeast-1 | ap-southeast-2 | ap-northeast-1 | sa-east-1 | cn-north-1 | eu-central-1'
    },
    GrantFullControl: 'STRING_VALUE',
    GrantRead: 'STRING_VALUE',
    GrantReadACP: 'STRING_VALUE',
    GrantWrite: 'STRING_VALUE',
    GrantWriteACP: 'STRING_VALUE'
  };
 *
 *
 *
 *
 *
 * @param params
 * @return {Promise}
 */
function createBucket(params) {
  return new Promise((resolve, reject) => {
    s3.createBucket(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    ACL: 'private | public-read | public-read-write | authenticated-read | aws-exec-read | bucket-owner-read | bucket-owner-full-control',
    CacheControl: 'STRING_VALUE',
    ContentDisposition: 'STRING_VALUE',
    ContentEncoding: 'STRING_VALUE',
    ContentLanguage: 'STRING_VALUE',
    ContentType: 'STRING_VALUE',
    Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    GrantFullControl: 'STRING_VALUE',
    GrantRead: 'STRING_VALUE',
    GrantReadACP: 'STRING_VALUE',
    GrantWriteACP: 'STRING_VALUE',
    Metadata: {
      someKey: 'STRING_VALUE',
      // anotherKey
    },
    RequestPayer: 'requester',
    SSECustomerAlgorithm: 'STRING_VALUE',
    SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
    SSECustomerKeyMD5: 'STRING_VALUE',
    SSEKMSKeyId: 'STRING_VALUE',
    ServerSideEncryption: 'AES256 | aws:kms',
    StorageClass: 'STANDARD | REDUCED_REDUNDANCY | STANDARD_IA',
    WebsiteRedirectLocation: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function createMultipartUpload(params) {
  return new Promise((resolve, reject) => {
    s3.createMultipartUpload(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function deleteBucket(params) {
  return new Promise((resolve, reject) => {
    s3.deleteBucket(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function deleteBucketCors(params) {
  return new Promise((resolve, reject) => {
    s3.deleteBucketCors(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function deleteBucketLifecycle(params) {
  return new Promise((resolve, reject) => {
    s3.deleteBucketLifecycle(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function deleteBucketPolicy(params) {
  return new Promise((resolve, reject) => {
    s3.deleteBucketPolicy(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function deleteBucketReplication(params) {
  return new Promise((resolve, reject) => {
    s3.deleteBucketReplication(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function deleteBucketTagging(params) {
  return new Promise((resolve, reject) => {
    s3.deleteBucketTagging(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function deleteBucketWebsite(params) {
  return new Promise((resolve, reject) => {
    s3.deleteBucketWebsite(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    MFA: 'STRING_VALUE',
    RequestPayer: 'requester',
    VersionId: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function deleteObject(params) {
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Delete: {
      //required
      Objects: [//required
        {
          Key: 'STRING_VALUE', //required
          VersionId: 'STRING_VALUE'
        },
        // more items
      ],
      Quiet: true || false
    },
    MFA: 'STRING_VALUE',
    RequestPayer: 'requester'
  };
 *
 * @param params
 * @return {Promise}
 */
function deleteObjects(params) {

  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketAccelerateConfiguration(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketAccelerateConfiguration(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 *let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketAcl(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketAcl(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketCors(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketCors(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 *let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketLifecycle(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketLifecycle(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketLifecycleConfiguration(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketLifecycleConfiguration(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketLocation(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketLocation(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketLogging(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketLogging(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketNotification(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketNotification(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketNotificationConfiguration(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketNotificationConfiguration(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketPolicy(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketPolicy(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketReplication(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketReplication(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketRequestPayment(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketRequestPayment(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketTagging(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketTagging(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketVersioning(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketVersioning(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function getBucketWebsite(params) {
  return new Promise((resolve, reject) => {
    s3.getBucketWebsite(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    IfMatch: 'STRING_VALUE',
    IfModifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    IfNoneMatch: 'STRING_VALUE',
    IfUnmodifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    PartNumber: 0,
    Range: 'STRING_VALUE',
    RequestPayer: 'requester',
    ResponseCacheControl: 'STRING_VALUE',
    ResponseContentDisposition: 'STRING_VALUE',
    ResponseContentEncoding: 'STRING_VALUE',
    ResponseContentLanguage: 'STRING_VALUE',
    ResponseContentType: 'STRING_VALUE',
    ResponseExpires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    SSECustomerAlgorithm: 'STRING_VALUE',
    SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
    SSECustomerKeyMD5: 'STRING_VALUE',
    VersionId: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function getObject(params) {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    RequestPayer: 'requester',
    VersionId: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function getObjectAcl(params) {
  return new Promise((resolve, reject) => {
    s3.getObjectAcl(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    RequestPayer: 'requester'
  };
 *
 * @param params
 * @return {Promise}
 */
function getObjectTorrent(params) {
  return new Promise((resolve, reject) => {
    s3.getObjectTorrent(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 * @param params
 * @return {Promise}
 */
function getSignedUrl(params) {
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function headBucket(params) {
  return new Promise((resolve, reject) => {
    s3.headBucket(params, function (err, data) {
      if (err) resolve(null); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    IfMatch: 'STRING_VALUE',
    IfModifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    IfNoneMatch: 'STRING_VALUE',
    IfUnmodifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    PartNumber: 0,
    Range: 'STRING_VALUE',
    RequestPayer: 'requester',
    SSECustomerAlgorithm: 'STRING_VALUE',
    SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
    SSECustomerKeyMD5: 'STRING_VALUE',
    VersionId: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function headObject(params) {
  return new Promise((resolve, reject) => {
    s3.headObject(params, function (err, data) {
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
 * @return {Promise}
 */
function listBuckets() {
  return new Promise((resolve, reject) => {
    s3.listBuckets(function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Delimiter: 'STRING_VALUE',
    EncodingType: 'url',
    KeyMarker: 'STRING_VALUE',
    MaxUploads: 0,
    Prefix: 'STRING_VALUE',
    UploadIdMarker: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function listMultipartUploads(params) {
  return new Promise((resolve, reject) => {
    s3.listMultipartUploads(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Delimiter: 'STRING_VALUE',
    EncodingType: 'url',
    Marker: 'STRING_VALUE',
    MaxKeys: 0,
    Prefix: 'STRING_VALUE',
    RequestPayer: 'requester'
  };
 *
 * @param params
 * @return {Promise}
 */
function listObjects(params) {
  return new Promise((resolve, reject) => {
    s3.listObjects(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    ContinuationToken: 'STRING_VALUE',
    Delimiter: 'STRING_VALUE',
    EncodingType: 'url',
    FetchOwner: true || false,
    MaxKeys: 0,
    Prefix: 'STRING_VALUE',
    RequestPayer: 'requester',
    StartAfter: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function listObjectsV2(params) {

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Delimiter: 'STRING_VALUE',
    EncodingType: 'url',
    KeyMarker: 'STRING_VALUE',
    MaxKeys: 0,
    Prefix: 'STRING_VALUE',
    VersionIdMarker: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function listObjectVersions(params) {
  return new Promise((resolve, reject) => {
    s3.listObjectVersions(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    UploadId: 'STRING_VALUE', //required
    MaxParts: 0,
    PartNumberMarker: 0,
    RequestPayer: 'requester'
  };
 *
 * @param params
 * @return {Promise}
 */
function listParts(params) {
  return new Promise((resolve, reject) => {
    s3.listParts(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    AccelerateConfiguration: {
      //required
      Status: 'Enabled | Suspended'
    },
    Bucket: 'STRING_VALUE' //required
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketAccelerateConfiguration(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketAccelerateConfiguration(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    ACL: 'private | public-read | public-read-write | authenticated-read',
    AccessControlPolicy: {
      Grants: [
        {
          Grantee: {
            Type: 'CanonicalUser | AmazonCustomerByEmail | Group', //required
            DisplayName: 'STRING_VALUE',
            EmailAddress: 'STRING_VALUE',
            ID: 'STRING_VALUE',
            URI: 'STRING_VALUE'
          },
          Permission: 'FULL_CONTROL | WRITE | WRITE_ACP | READ | READ_ACP'
        },
        // more items
      ],
      Owner: {
        DisplayName: 'STRING_VALUE',
        ID: 'STRING_VALUE'
      }
    },
    ContentMD5: 'STRING_VALUE',
    GrantFullControl: 'STRING_VALUE',
    GrantRead: 'STRING_VALUE',
    GrantReadACP: 'STRING_VALUE',
    GrantWrite: 'STRING_VALUE',
    GrantWriteACP: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketAcl(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketAcl(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    CORSConfiguration: {
      //required
      CORSRules: [//required
        {
          AllowedMethods: [//required
            'STRING_VALUE',
            // more items
          ],
          AllowedOrigins: [//required
            'STRING_VALUE',
            // more items
          ],
          AllowedHeaders: [
            'STRING_VALUE',
            // more items
          ],
          ExposeHeaders: [
            'STRING_VALUE',
            // more items
          ],
          MaxAgeSeconds: 0
        },
        // more items
      ]
    },
    ContentMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketCors(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketCors(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    ContentMD5: 'STRING_VALUE',
    LifecycleConfiguration: {
      Rules: [//required
        {
          Prefix: 'STRING_VALUE', //required
          Status: 'Enabled | Disabled', //required
          AbortIncompleteMultipartUpload: {
            DaysAfterInitiation: 0
          },
          Expiration: {
            Date: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
            Days: 0,
            ExpiredObjectDeleteMarker: true || false
          },
          ID: 'STRING_VALUE',
          NoncurrentVersionExpiration: {
            NoncurrentDays: 0
          },
          NoncurrentVersionTransition: {
            NoncurrentDays: 0,
            StorageClass: 'GLACIER | STANDARD_IA'
          },
          Transition: {
            Date: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
            Days: 0,
            StorageClass: 'GLACIER | STANDARD_IA'
          }
        },
        // more items
      ]
    }
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketLifecycle(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketLifecycle(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    LifecycleConfiguration: {
      Rules: [//required
        {
          Prefix: 'STRING_VALUE', //required
          Status: 'Enabled | Disabled', //required
          AbortIncompleteMultipartUpload: {
            DaysAfterInitiation: 0
          },
          Expiration: {
            Date: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
            Days: 0,
            ExpiredObjectDeleteMarker: true || false
          },
          ID: 'STRING_VALUE',
          NoncurrentVersionExpiration: {
            NoncurrentDays: 0
          },
          NoncurrentVersionTransitions: [
            {
              NoncurrentDays: 0,
              StorageClass: 'GLACIER | STANDARD_IA'
            },
            // more items
          ],
          Transitions: [
            {
              Date: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
              Days: 0,
              StorageClass: 'GLACIER | STANDARD_IA'
            },
            // more items
          ]
        },
        // more items
      ]
    }
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketLifecycleConfiguration(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketLifecycleConfiguration(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    BucketLoggingStatus: {
      //required
      LoggingEnabled: {
        TargetBucket: 'STRING_VALUE',
        TargetGrants: [
          {
            Grantee: {
              Type: 'CanonicalUser | AmazonCustomerByEmail | Group', //required
              DisplayName: 'STRING_VALUE',
              EmailAddress: 'STRING_VALUE',
              ID: 'STRING_VALUE',
              URI: 'STRING_VALUE'
            },
            Permission: 'FULL_CONTROL | READ | WRITE'
          },
          // more items
        ],
        TargetPrefix: 'STRING_VALUE'
      }
    },
    ContentMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketLogging(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketLogging(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    NotificationConfiguration: {
      //required
      CloudFunctionConfiguration: {
        CloudFunction: 'STRING_VALUE',
        Event: 's3:ReducedRedundancyLostObject | s3:ObjectCreated:* | s3:ObjectCreated:Put | s3:ObjectCreated:Post | s3:ObjectCreated:Copy | s3:ObjectCreated:CompleteMultipartUpload | s3:ObjectRemoved:* | s3:ObjectRemoved:Delete | s3:ObjectRemoved:DeleteMarkerCreated',
        Events: [
          's3:ReducedRedundancyLostObject | s3:ObjectCreated:* | s3:ObjectCreated:Put | s3:ObjectCreated:Post | s3:ObjectCreated:Copy | s3:ObjectCreated:CompleteMultipartUpload | s3:ObjectRemoved:* | s3:ObjectRemoved:Delete | s3:ObjectRemoved:DeleteMarkerCreated',
          // more items
        ],
        Id: 'STRING_VALUE',
        InvocationRole: 'STRING_VALUE'
      },
      QueueConfiguration: {
        Event: 's3:ReducedRedundancyLostObject | s3:ObjectCreated:* | s3:ObjectCreated:Put | s3:ObjectCreated:Post | s3:ObjectCreated:Copy | s3:ObjectCreated:CompleteMultipartUpload | s3:ObjectRemoved:* | s3:ObjectRemoved:Delete | s3:ObjectRemoved:DeleteMarkerCreated',
        Events: [
          's3:ReducedRedundancyLostObject | s3:ObjectCreated:* | s3:ObjectCreated:Put | s3:ObjectCreated:Post | s3:ObjectCreated:Copy | s3:ObjectCreated:CompleteMultipartUpload | s3:ObjectRemoved:* | s3:ObjectRemoved:Delete | s3:ObjectRemoved:DeleteMarkerCreated',
          // more items
        ],
        Id: 'STRING_VALUE',
        Queue: 'STRING_VALUE'
      },
      TopicConfiguration: {
        Event: 's3:ReducedRedundancyLostObject | s3:ObjectCreated:* | s3:ObjectCreated:Put | s3:ObjectCreated:Post | s3:ObjectCreated:Copy | s3:ObjectCreated:CompleteMultipartUpload | s3:ObjectRemoved:* | s3:ObjectRemoved:Delete | s3:ObjectRemoved:DeleteMarkerCreated',
        Events: [
          's3:ReducedRedundancyLostObject | s3:ObjectCreated:* | s3:ObjectCreated:Put | s3:ObjectCreated:Post | s3:ObjectCreated:Copy | s3:ObjectCreated:CompleteMultipartUpload | s3:ObjectRemoved:* | s3:ObjectRemoved:Delete | s3:ObjectRemoved:DeleteMarkerCreated',
          // more items
        ],
        Id: 'STRING_VALUE',
        Topic: 'STRING_VALUE'
      }
    },
    ContentMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketNotification(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketNotification(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    NotificationConfiguration: {
      //required
      LambdaFunctionConfigurations: [
        {
          Events: [//required
            's3:ReducedRedundancyLostObject | s3:ObjectCreated:* | s3:ObjectCreated:Put | s3:ObjectCreated:Post | s3:ObjectCreated:Copy | s3:ObjectCreated:CompleteMultipartUpload | s3:ObjectRemoved:* | s3:ObjectRemoved:Delete | s3:ObjectRemoved:DeleteMarkerCreated',
            // more items
          ],
          LambdaFunctionArn: 'STRING_VALUE', //required
          Filter: {
            Key: {
              FilterRules: [
                {
                  Name: 'prefix | suffix',
                  Value: 'STRING_VALUE'
                },
                // more items
              ]
            }
          },
          Id: 'STRING_VALUE'
        },
        // more items
      ],
      QueueConfigurations: [
        {
          Events: [//required
            's3:ReducedRedundancyLostObject | s3:ObjectCreated:* | s3:ObjectCreated:Put | s3:ObjectCreated:Post | s3:ObjectCreated:Copy | s3:ObjectCreated:CompleteMultipartUpload | s3:ObjectRemoved:* | s3:ObjectRemoved:Delete | s3:ObjectRemoved:DeleteMarkerCreated',
            // more items
          ],
          QueueArn: 'STRING_VALUE', //required
          Filter: {
            Key: {
              FilterRules: [
                {
                  Name: 'prefix | suffix',
                  Value: 'STRING_VALUE'
                },
                // more items
              ]
            }
          },
          Id: 'STRING_VALUE'
        },
        // more items
      ],
      TopicConfigurations: [
        {
          Events: [//required
            's3:ReducedRedundancyLostObject | s3:ObjectCreated:* | s3:ObjectCreated:Put | s3:ObjectCreated:Post | s3:ObjectCreated:Copy | s3:ObjectCreated:CompleteMultipartUpload | s3:ObjectRemoved:* | s3:ObjectRemoved:Delete | s3:ObjectRemoved:DeleteMarkerCreated',
            // more items
          ],
          TopicArn: 'STRING_VALUE', //required
          Filter: {
            Key: {
              FilterRules: [
                {
                  Name: 'prefix | suffix',
                  Value: 'STRING_VALUE'
                },
                // more items
              ]
            }
          },
          Id: 'STRING_VALUE'
        },
        // more items
      ]
    }
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketNotificationConfiguration(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketNotificationConfiguration(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Policy: 'STRING_VALUE', //required
    ContentMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketPolicy(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketPolicy(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    ReplicationConfiguration: {
      //required
      Role: 'STRING_VALUE', //required
      Rules: [//required
        {
          Destination: {
            //required
            Bucket: 'STRING_VALUE', //required
            StorageClass: 'STANDARD | REDUCED_REDUNDANCY | STANDARD_IA'
          },
          Prefix: 'STRING_VALUE', //required
          Status: 'Enabled | Disabled', //required
          ID: 'STRING_VALUE'
        },
        // more items
      ]
    },
    ContentMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketReplication(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketReplication(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    RequestPaymentConfiguration: {
      //required
      Payer: 'Requester | BucketOwner' //required
    },
    ContentMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketRequestPayment(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketRequestPayment(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Tagging: {
      //required
      TagSet: [//required
        {
          Key: 'STRING_VALUE', //required
          Value: 'STRING_VALUE' //required
        },
        // more items
      ]
    },
    ContentMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketTagging(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketTagging(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    VersioningConfiguration: {
      //required
      MFADelete: 'Enabled | Disabled',
      Status: 'Enabled | Suspended'
    },
    ContentMD5: 'STRING_VALUE',
    MFA: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketVersioning(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketVersioning(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    WebsiteConfiguration: {
      //required
      ErrorDocument: {
        Key: 'STRING_VALUE' //required
      },
      IndexDocument: {
        Suffix: 'STRING_VALUE' //required
      },
      RedirectAllRequestsTo: {
        HostName: 'STRING_VALUE', //required
        Protocol: 'http | https'
      },
      RoutingRules: [
        {
          Redirect: {
            //required
            HostName: 'STRING_VALUE',
            HttpRedirectCode: 'STRING_VALUE',
            Protocol: 'http | https',
            ReplaceKeyPrefixWith: 'STRING_VALUE',
            ReplaceKeyWith: 'STRING_VALUE'
          },
          Condition: {
            HttpErrorCodeReturnedEquals: 'STRING_VALUE',
            KeyPrefixEquals: 'STRING_VALUE'
          }
        },
        // more items
      ]
    },
    ContentMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putBucketWebsite(params) {
  return new Promise((resolve, reject) => {
    s3.putBucketWebsite(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    ACL: 'private | public-read | public-read-write | authenticated-read | aws-exec-read | bucket-owner-read | bucket-owner-full-control',
    Body: new Buffer('...') || 'STRING_VALUE' || streamObject,
    CacheControl: 'STRING_VALUE',
    ContentDisposition: 'STRING_VALUE',
    ContentEncoding: 'STRING_VALUE',
    ContentLanguage: 'STRING_VALUE',
    ContentLength: 0,
    ContentMD5: 'STRING_VALUE',
    ContentType: 'STRING_VALUE',
    Expires: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    GrantFullControl: 'STRING_VALUE',
    GrantRead: 'STRING_VALUE',
    GrantReadACP: 'STRING_VALUE',
    GrantWriteACP: 'STRING_VALUE',
    Metadata: {
      someKey: 'STRING_VALUE',
      // anotherKey: ...
    },
    RequestPayer: 'requester',
    SSECustomerAlgorithm: 'STRING_VALUE',
    SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
    SSECustomerKeyMD5: 'STRING_VALUE',
    SSEKMSKeyId: 'STRING_VALUE',
    ServerSideEncryption: 'AES256 | aws:kms',
    StorageClass: 'STANDARD | REDUCED_REDUNDANCY | STANDARD_IA',
    WebsiteRedirectLocation: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putObject(params) {
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 *   let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    ACL: 'private | public-read | public-read-write | authenticated-read | aws-exec-read | bucket-owner-read | bucket-owner-full-control',
    AccessControlPolicy: {
      Grants: [
        {
          Grantee: {
            Type: 'CanonicalUser | AmazonCustomerByEmail | Group', //required
            DisplayName: 'STRING_VALUE',
            EmailAddress: 'STRING_VALUE',
            ID: 'STRING_VALUE',
            URI: 'STRING_VALUE'
          },
          Permission: 'FULL_CONTROL | WRITE | WRITE_ACP | READ | READ_ACP'
        },
        // more items
      ],
      Owner: {
        DisplayName: 'STRING_VALUE',
        ID: 'STRING_VALUE'
      }
    },
    ContentMD5: 'STRING_VALUE',
    GrantFullControl: 'STRING_VALUE',
    GrantRead: 'STRING_VALUE',
    GrantReadACP: 'STRING_VALUE',
    GrantWrite: 'STRING_VALUE',
    GrantWriteACP: 'STRING_VALUE',
    RequestPayer: 'requester',
    VersionId: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function putObjectAcl(params) {
  return new Promise((resolve, reject) => {
    s3.putObjectAcl(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 *let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    RequestPayer: 'requester',
    RestoreRequest: {
      Days: 0 //required
    },
    VersionId: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function restoreObject(params) {
  return new Promise((resolve, reject) => {
    s3.restoreObject(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {Bucket: 'bucket', Key: 'key', Body: stream};
 s3.upload(params, function (err, data) {
    console.log(err, data);
  });
 //or
 *
 * let params = {Bucket: 'bucket', Key: 'key', Body: stream};
 let options = {partSize: 10 * 1024 * 1024, queueSize: 1};


 * @param params
 * @return {Promise}
 */
function upload(params, options) {
  return new Promise((resolve, reject) => {
    s3.upload(params, options, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    PartNumber: 0, //required
    UploadId: 'STRING_VALUE', //required
    Body: new Buffer('...') || 'STRING_VALUE' || streamObject,
    ContentLength: 0,
    ContentMD5: 'STRING_VALUE',
    RequestPayer: 'requester',
    SSECustomerAlgorithm: 'STRING_VALUE',
    SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
    SSECustomerKeyMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function uploadPart(params) {
  return new Promise((resolve, reject) => {
    s3.uploadPart(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE', //required
    CopySource: 'STRING_VALUE', //required
    Key: 'STRING_VALUE', //required
    PartNumber: 0, //required
    UploadId: 'STRING_VALUE', //required
    CopySourceIfMatch: 'STRING_VALUE',
    CopySourceIfModifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    CopySourceIfNoneMatch: 'STRING_VALUE',
    CopySourceIfUnmodifiedSince: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789,
    CopySourceRange: 'STRING_VALUE',
    CopySourceSSECustomerAlgorithm: 'STRING_VALUE',
    CopySourceSSECustomerKey: new Buffer('...') || 'STRING_VALUE',
    CopySourceSSECustomerKeyMD5: 'STRING_VALUE',
    RequestPayer: 'requester',
    SSECustomerAlgorithm: 'STRING_VALUE',
    SSECustomerKey: new Buffer('...') || 'STRING_VALUE',
    SSECustomerKeyMD5: 'STRING_VALUE'
  };
 *
 * @param params
 * @return {Promise}
 */
function uploadPartCopy(params) {
  return new Promise((resolve, reject) => {
    s3.uploadPartCopy(params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}

/**
 *
 *
 * let params = {
    Bucket: 'STRING_VALUE' //required
  };
 *
 * 'bucketExists', 'bucketNotExists', 'objectExists', 'objectNotExists'
 * @param params
 * @return {Promise}
 */
function waitFor(params) {
  return new Promise((resolve, reject) => {
    s3.waitFor('bucketExists', params, function (err, data) {
      if (err) reject(err); // an error occurred
      else     resolve(data);           // successful response
    });
  });
}




