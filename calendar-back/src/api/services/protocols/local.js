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

let EMAIL_REGEX = /\S+@\S+\.\S+/;
let passwordReg = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[*~`!^\-_+@\#$%&\=\(\)]).*$/;

function validateEmail(str) {
  return EMAIL_REGEX.test(str);
}

function protocols() {
}

let logger = Bifido.logger('LocalStrategy');

protocols.prototype = Object.create({
  register: register,
  connect: connect,
  login: login,
  createUser: createUser,
});

module.exports = new protocols();

function register(user) {
  return createUser(user);
}

function connect(req, identifier, password) {
  return new Promise((resolve, reject) => {

    if (!password) {
      logger.log('silly', 'no password');
      return reject(new Error("NoPassword"));
    }

    if (!passwordReg.test(password)) {
      logger.log('silly', 'invalid password');
      return reject(new Error("InvalidPassword"));
    }

    if (req.user.identifier != identifier) {
      req.user.identifier = identifier;
      req.user.emailConfirmed = false;
    }

    req.user.save()
      .then(user => {
        return Passport.create({
          protocol: 'local',
          password: password,
          owner: req.user._id
        });
      })
      .then(() => {
        resolve(null, req.user);
      })
      .catch(err => {
        reject(err);
      });
  });
}


function login(req, identifier, password, next) {
  let query = {};

  query.identifier = identifier;

  User.findOne(query, function (err, user) {
    if (err) return next(err);

    if (!user) {
      return next(new Error('Error.Passport.identifier.NotFound'), false, null);
    }

    Passport.findOne({owner: user._id, provider: 'bifido'},
      function (err, passport) {
        if (passport) {
          passport.validatePassword(password, function (err, res) {
            if (err) return next(err);

            if (!res) return next(new Error('Error.Passport.Password.Wrong'), false, null);
            else return next(null, user, passport);

          });
        } else return next(new Error('Error.Passport.Password.NotSet'), false, null);

      });
  });
}


function createUser(_user) {
  return new Promise((resolve, reject) => {

    let password = _user.password;
    delete _user.password;

    _user.role = Bifido.config.security.defaultRole;

    if (!password) {
      logger.log('silly', 'no password');
      return reject(new Error("NoPassword"));
    }

    if (!passwordReg.test(password)) {
      logger.log('silly', 'invalid password');
      return reject(new Error("InvalidPassword"));
    }

    let createdUser, createdPassport;

    User.create(_user)
      .then(user => {
        createdUser = user;

        return Passport.create({
          protocol: 'local',
          password: password,
          owner: createdUser._id
        });
      })
      .then(passport => {
        createdPassport = passport;
        resolve(createdUser);
      })
      .catch(err => {
        if (createdUser && createdUser._id) return User.remove({_id: createdUser._id}, () => {
        }).exec();
        reject(err);
      });
  });
}