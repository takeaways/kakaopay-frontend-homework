'use strict';

/**
 * Created by PHILIP on 02/11/2016
 * As Part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 02/11/2016
 *
 */

let dot = require('dot-object');
let logger = Bifido.logger('FileController');

module.exports = {
  // User
  create: create,
  update: update,
  remove: remove
};

function create(req, res) {
  let data = {};
  let files = [];

  new Promise((resolve, reject) => {
    let form = new Multiparty.Form({uploadDir: 'uploads'});

    form.on('field', (name, value) => {
      data[name] = value;
    });

    // all uploads are completed
    form.on('file', (name, file) => {
      files.push(file);
    });

    // all uploads are completed
    form.on('close', () => {
      resolve(files);
    });

    form.on('error', (err) => {
      reject(err);
    });
    form.parse(req);
  })
    .then(() => {
      let filePromises = [];
      _.forEach(files, (file) => {
        let promise = FileService.upload(file, data);
        filePromises.push(promise);
      });

      return filePromises;
    })
    .spread((file) => {
      return res.ok({file: file});
    })
    .catch((err) => {
      logger.error(err);
      return res.internalServer();
    })
    .finally(() => _.forEach(files, (file) => {
      if (FileSystem.existsSync(file.path))
        FileSystem.unlink(file.path)
    }));
}

function update(req, res) {
  if (!req.body._id)
    return res.badRequest();

  req.body.lastUpdatedAt = new Date();

  req.body.updatedBy = req.user._id;

  delete req.body.owner;
  delete req.body.createdBy;

  File.update({_id: req.body._id}, req.body, {multi: false})
    .then((result) => {
      return res.ok(result);
    })
    .catch((err) => {
      logger.log('error', err);
      return res.internalServer();
    });

}

function remove(req, res) {
  if (!req.query._id) return res.badRequest();

  File.update({_id: req.query._id}, {isDeleted: true})
    .then((removedItem) => {
      return res.ok(removedItem);
    })
    .catch((err) => {
      logger.log('error', err);
      return res.internalServer();
    });
}