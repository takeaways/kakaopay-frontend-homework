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


let dot = require('dot-object');
let AWS = require('aws-sdk');

module.exports = {
  upload: upload,

  // TODO: remove may be?
  // remove: remove,
};

function upload(file, data) {

  let key = file.path.split("/").pop();

  return S3Service.upload({
    Bucket: Bifido.config.connections.s3.images.bucket,
    Key: key,
    Body: FileSystem.createReadStream(file.path),
    ACL: 'public-read',
    ContentType: file.headers['content-type']
  }).then(response => {
    data = _.assign(data, {
      url: "http://" + Bifido.config.connections.s3.images.bucket + "/" + key,
      secure_url: "https://" + Bifido.config.connections.s3.images.bucket + "/" + key,
      fileType: file.headers['content-type'],
      fileName: file.originalFilename,
      fileSize: file.size
    });

    return File.create(data)
  });
}

// function remove(_id) {
//   return new Promise((resolve, reject) => {
//     Photo.findOne({_id: _id})
//       .then(function (photo) {
//
//         let promises = [File.remove({_id: _id})];
//
//         if (photo.publicId)
//           promises.push(cloudinary.uploader.destroy(photo.publicId, null));
//
//         return promises;
//       })
//       .spread(function (result) {
//         resolve(result);
//       })
//       .catch(function (err) {
//         reject(err);
//       });
//   });
// }
