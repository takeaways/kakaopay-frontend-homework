'use strict';

/**
 * Created by PHILIP on 02/11/2016
 * As part of Bifido Server
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 02/11/2016
 *
 */

let logger = Bifido.logger('AuthController');
let regExpMail = /\S+@\S+\.\S+/;
let Promise = require('bluebird');
var Request = require('request');

module.exports = {

  // Public
  checkIdentifier: checkIdentifier,
  checkNickname: checkNickname,
  register: register,
  forgotPasswordStart: forgotPasswordStart,
  forgotPasswordCheck: forgotPasswordCheck,
  forgotPasswordComplete: forgotPasswordComplete,
  login: login,
  OAuthConnect: OAuthConnect,
  OAuthDisconnect: OAuthDisconnect,

  getNaverAccessToken: getNaverAccessToken,
  registerPassport: registerPassport,

  logout: logout,
  support: support,

  // User Or Admin
  getMyUserInfo: getMyUserInfo,
  getUserProvider: getUserProvider,
  updateMyInfo: updateMyInfo,
  changePassword: changePassword,
};

function checkIdentifier(req, res) {
  let identifier = '';
  req.getParams(['identifier'])
    .then((result) => {
      identifier = result.identifier;
      if (!identifier || !regExpMail.test(identifier)) return res.ok({isAvailable: false, message: 'unavailable'});

      User.findOne({identifier: identifier})
        .then((user) => {
          if (user) {
            return res.ok({isAvailable: false, message: 'duplicated'});
          } else {
            return res.ok({isAvailable: true});
          }
        })
        .catch((err) => {
          logger.log('error', err);
          return res.internalServer();
        });
    });
}

function checkNickname(req, res) {
  let nickname = req.param('nickname');

  if (!nickname) return res.ok({isAvailable: false});

  User.findOne({nickname: nickname})
    .then((user) => {
      if (user) {
        return res.ok({isAvailable: false});
      } else {
        return res.ok({isAvailable: true});
      }
    })
    .catch((err) => {
      logger.log('error', err);
      return res.internalServer();
    });
}

function register(req, res) {
  req.getParams(['identifier', 'password', 'mobile', 'name'])
    .then((user) => {
      user.termsCheck = true;
      user.privacyCheck = true;

      user.marketingMailAgree = req.body.marketingMailAgree;
      user.marketingSmsAgree = req.body.marketingSmsAgree;

      //optional
      if (req.body.phone)
        user.phone = req.body.phone;
      if (req.body.birth)
        user.birth = req.body.birth;
      if (req.body.deliveryInfo)
        user.deliveryInfo = req.body.deliveryInfo;
      if (req.body.recommendUser)
        user.recommendUser = req.body.recommendUser;

      return PassportService.protocols.local.register(user);
    })
    .then((registeredUser) => {
      /**
       * <회원가입 후 포인트 지급>
       * 1. 회원가입 포인트 3000point
       */
      let point = {
        action: 'Register',
        score: 3000,
        owner: registeredUser._id
      };

      registeredUser.currentPoint += 3000;

      return Promise.all([Point.create(point), registeredUser.save()]);
    })
    .spread((point, registeredUser) => {
      /**
       * 회원가입 포인트 생성 후 pointTransaction 생성
       */
      let pointTransaction = {
        point: point._id,
        owner: registeredUser._id
      };

      return Promise.all([point, PointTransaction.create(pointTransaction), registeredUser])
    })
    .spread((point, pointTransaction, registeredUser) => {
      /**
       * <회원가입 후 포인트 지급>
       * 2. 추천한 유저 1000point
       * 3. 추천 받은 유저 1000point
       */
      return Promise.all([User.findOne({identifier: registeredUser.recommendUser}), registeredUser]);
    })
    .spread((recommendUser, registeredUser) => {
      if (recommendUser) {
        let giverPoint = {
          action: 'RecommendGiver',
          score: 1000,
          owner: registeredUser._id,
          giver: registeredUser._id,
          taker: recommendUser._id
        };

        let takerPoint = {
          action: 'RecommendTaker',
          score: 1000,
          owner: recommendUser._id,
          giver: registeredUser._id,
          taker: recommendUser._id
        };

        recommendUser.currentPoint += 1000;
        registeredUser.currentPoint += 1000;

        let promises = [
          Point.create(giverPoint),
          Point.create(takerPoint),
          recommendUser.save(),
          registeredUser.save()
        ];

        return Promise.all(promises);
      } else {
        return Promise.all([null, null, null, registeredUser]);
      }
    })
    .spread((giverPoint, takerPoint, recommendUser, registeredUser) => {
      if (giverPoint && takerPoint && recommendUser) {
        /**
         * 추천인 포인트 생성 후 pointTransaction 생성
         */
        let giverPointTransaction = {
          point: giverPoint._id,
          owner: registeredUser._id
        };

        let takerPointTransaction = {
          point: takerPoint._id,
          owner: recommendUser._id
        };

        return Promise.all([
          PointTransaction.create(giverPointTransaction),
          PointTransaction.create(takerPointTransaction),
          registeredUser
        ]);
      } else {
        return Promise.all([null, null, registeredUser]);
      }
    })
    .spread((giverPointTransaction, takerPointTransaction, registeredUser) => {
      return res.ok({user: registeredUser});
    })
    .catch(err => {
      if (err.message === "NoPassword" || err.message === "InvalidPassword") return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function forgotPasswordStart(req, res) {
  AuthService.passwordResetStart(req)
    .then((data) => {
      return res.ok({message: "Password reset email sent."});
    })
    .catch((err) => {
      if (err.message === 'UserNotFound'
        || err.message === "BadRequest") return res.badRequest();

      // 하루 요청량 초과
      if (err.message === 'ExceedDailyRequestLimit') return res.paymentRequired();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function forgotPasswordCheck(req, res) {
  AuthService.passwordResetCheck(req)
    .then(() => {
      return res.ok({message: 'done'});
    })
    .catch((err) => {
      if (err.message === 'UserNotFound'
        || err.message === "BadRequest") return res.badRequest();

      if (err.message === 'PasswordResetNotRequested') return res.preconditionFailed();
      if (err.message === 'InvalidCode') return res.unprocessableEntity();
      if (err.message === 'PasswordResetExpired') return res.unprocessableEntity();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function forgotPasswordComplete(req, res) {
  AuthService.passwordResetComplete(req)
    .then(() => {
      return res.ok({message: "Password reset complete"});
    })
    .catch((err) => {
      if (err.message === 'UserNotFound'
        || err.message === "BadRequest") return res.badRequest();

      if (err.message === 'PasswordResetNotRequested') return res.preconditionFailed();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

/**
 * Create a authentication callback endpoint
 *
 * This endpoint handles everything related to creating and verifying Pass-
 * ports and users, both locally and from third-aprty providers.
 *
 * Passport exposes a login() function on req (also aliased as logIn()) that
 * can be used to establish a login session. When the login operation
 * completes, user will be assigned to req.user.
 *
 * For more information on logging in users in Passport.js, check out:
 * http://passportjs.org/guide/login/
 *
 * @param {Object} req
 * @param {Object} res
 */
function OAuthConnect(req, res) {
  AuthService.OAuthLogin(req, res);
}

function OAuthDisconnect(req, res) {
  AuthService.OAuthDisconnect(req, res);
}

function getNaverAccessToken(req, res) {
  AuthService.getNaverAccessToken(req, res)
    .then(result => {
      res.ok({token: result});
    })
    .catch(function (err) {
      if (err.message === "cannotGetAccessToken") return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function registerPassport(req, res) {

  var access_token = req.param("access_token");
  var refresh_token = req.param("refresh_token");
  var provider = req.param("provider");

  logger.log('debug', "AuthController - start registering passport");

  if (!access_token) {
    return res.status(400).send({
      message: "Please pass all the parameters"
    });
  }

  var options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    }
  };

  switch (provider) {
    case 'naver':
      options.url = 'https://openapi.naver.com/v1/nid/me';
      var header = "Bearer " + access_token; // Bearer 다음에 공백 추가
      options.headers = {'Authorization': header};
      break;
    case 'kakao':
      options.url = 'https://kapi.kakao.com/v1/user/me';
      break;
  }

  var requestGet = Promise.promisify(Request.get, {multiArgs: true});

  //  response, body
  requestGet(options)
    .then(function (returnArgs) {
      var body = returnArgs[1];
      var data = JSON.parse(body);

      logger.info("--------------AuthController----------------");
      logger.info("AuthController ::: Data res :: ", data);
      logger.info("-------------------------------------");

      var userData = {};
      switch (provider) {
        case 'naver': {
          userData.provider = 'naver';
          userData.identifier = data.response.email;
          userData.name = data.response.name;
          break;
        }
        case 'kakao':
          userData.provider = 'kakao';
          userData.name = data.properties.nickname;
          userData.kakao_id = data.id;
          if (data.kaccount_email) {
            userData.identifier = data.kaccount_email;
          } else {
            userData.identifier = data.id;
          }
          break;
        default:
          console.assert(false, '없는 provider입니다. naver, kakao만 가능합니다.');
      }
      return [User.findOne({identifier: userData.identifier}), userData];
    })
    .spread((user, userData) => {
      if (!user) {
        return registerPassportUser(userData, access_token, refresh_token);
      } else {
        return updatePassportUser(user, userData, access_token, refresh_token);
      }
    })
    .then((data) => {
      if (!data)
        throw new Error("PassportResultNotFound");

      if (!data.user)
        throw new Error("PassportResultUserNotFound");

      if (data.user.isDropOut)
        throw new Error("DropOutUser");
      if (data.user.isDeleted)
        throw new Error("DeletedUser");

      return res.ok(data);
    })
    .catch(function (err) {
      console.log(err);
      logger.error(err);
      if (err.message == 'forbidden'
        || err.message == 'NotFoundPassport'
        || err.message == 'PassportResultNotFound'
        || err.message == 'PassportResultNotFound'
        || err.message == 'DeletedUser'
        || err.message == 'DropOutUser') {
        return res.forbidden();
      } else if (err.message == 'notAcceptable') {
        return res.notAcceptable();
      } else {
        return res.status(500).send({err: err});
      }
    });


  function registerPassportUser(userData, access_token, refresh_token) {

    return Promise.resolve(User.create(userData))
      .then(function (createdUser) {
        var tokens = {access_token: access_token};
        if (refresh_token) tokens.refresh_token = refresh_token;

        var passportNew = {
          protocol: 'oauth2',
          provider: provider,
          identifier: userData.identifier,
          accessToken: access_token,
          tokens: tokens,
          owner: createdUser._id
        };

        var promises = [Passport.create(passportNew), createdUser];
        return promises;
      })
      .spread(function (passport, user) {

        user.role = Bifido.config.security.defaultRole;
        user.privacyCheck = true;
        user.termsCheck = true;
        user.deliveryInfo = {};

        return user.save();
      })


      .then((registeredUser) => {
        /**
         * <회원가입 후 포인트 지급>
         * 1. 회원가입 포인트 3000point
         */
        let point = {
          action: 'Register',
          score: 3000,
          owner: registeredUser._id
        };

        registeredUser.currentPoint += 3000;

        return Promise.all([Point.create(point), registeredUser.save()]);
      })
      .spread((point, registeredUser) => {
        /**
         * 회원가입 포인트 생성 후 pointTransaction 생성
         */
        let pointTransaction = {
          point: point._id,
          owner: registeredUser._id
        };

        return Promise.all([point, PointTransaction.create(pointTransaction), registeredUser])
      })
      .spread(function (point, pointTransaction, user) {
        req.logIn = Promise.promisify(req.logIn);
        req.logIn(user)
          .then(function () {
          })
          .catch(function (err) {
            logger.log('error', err);
            return res.internalServer();
          });

        return {
          user: user,
          token: AuthService.getToken({_id: user._id}),
          action: 'registered'
        };
      })
      .catch((err) => {
        var error = new Mongoose.Error;
        logger.error(error);
        res.status(error.code)
          .send({error: error});
      });
  }

  function updatePassportUser(user, userData, access_token, refresh_token) {
    //ignore for registered user
    logger.log('debug', "AuthController - user exist update token");

    if (user && user.isDropOut) {
      throw new Error('forbidden')
    } else if (user && user.evaluateStatus == "강제탈퇴") {
      throw new Error('notAcceptable')
    }

    //ignore for registered user
    logger.log('debug', "AuthController - user exist update token");

    //Update user data
    user = _.extend(user, userData);

    var newToken = {
      accessToken: access_token,
      tokens: {
        access_token: access_token,
        refresh_token: refresh_token
      }
    };

    return new Promise((resolve, rejcet) => {
      return user.save()
        .then(function (data) {
          return [Passport.update({
            identifier: userData.identifier,
            provider: provider
          }, newToken),
            User.findOne({_id: user._id}).populate('roles'), newToken];
        })
        .spread(function (updatedPassport, user, newToken) {
          logger.log('debug', "AuthController - passport updated", updatedPassport);
          delete user.passports;
          return resolve({
            user: user,
            token: AuthService.getToken({_id: user._id}),
            action: 'exist'
          });
        })
        .catch(function (err) {
          if (err.message === 'InvalidParameter')
            return res.badRequest();

          if (err.name === 'MongoError' || err instanceof Mongoose.Error)
            return res.mongooseError(err);

          logger.log('error', err);
          res.internalServer();
        });
    });
  }
}

function login(req, res) {
  PassportService.authenticate('local', handler)(req, res, req.next);

  function handler(err, user, message) {
    if (err) {
      switch (err.message) {
        case 'Error.Passport.identifier.NotFound':
          return res.badRequest({message: 'NotRegistered'});
        case 'Error.Passport.Password.Wrong':
        case 'Error.Passport.Password.NotSet':
          return res.badRequest();
        default:
          logger.log('error', err);
          return res.internalServer();
      }
    }

    req.logIn = Promise.promisify(req.logIn);
    req.logIn(user)
      .then(() => {
        if (user.isDeleted) user.isDeleted = false;
        return user.save();
      })
      .then((user) => {
        // Get populated fields
        let userData = user.toJSON();

        let token = AuthService.getToken({_id: userData._id});
        req.session.authenticated = true;
        req.session.user = user;
        return res.ok({user: userData, token: token});
      })
      .catch((err) => {
        if (err.message === 'UnActivateUser') return res.unauthorized({message: err.message});

        logger.log('error', err);
        return res.internalServer();
      });
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.ok({});
  });
}

function support(req, res) {
  let data = {}, files = [];

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
      if (!data.email ||
        !regExpMail.test(data.email) ||
        !data.content) throw new Error("BadRequest");

      let attachments = [];
      _.forEach(files, (file, index) => {

        if (file.size > 15 * 1000 * 1000) throw new Error("ExceedFileSize");

        attachments.push({
          filename: "attachment" + (index + 1) + "_" + file.originalFilename,
          path: file.path
        });
      });

      return MailService.sendEmail(
        "support",
        "kr",
        {
          email: data.email,
          content: data.content,
          date: Moment().format("YYYY년 MM월 DD일 HH시 mm분")
        },
        {email: data.email, name: "Bifido Support"},
        ["support@Bifido-official.com"],
        attachments
      );
    })
    .then((result) => {
      return res.ok({message: "support email sent."});
    })
    .catch((err) => {
      if (err.message === "BadRequest")
        return res.badRequest();

      if (err.message === "ExceedFileSize")
        return res.payloadTooLarge();

      logger.error(err);
      return res.internalServer();
    })
    .finally(() => _.forEach(files, (file) => {
      if (FileSystem.existsSync(file.path))
        FileSystem.unlink(file.path)
    }));
}

function getMyUserInfo(req, res) {

  let params = QueryService.buildQuery(req);

  params.query._id = req.user._id;

  let queryPromise = User.findOne(params.query);

  // Populate
  if (params.populate) {
    if (Array.isArray(params.populate))
      _.forEach(params.populate, (populate) => {
        queryPromise = queryPromise.populate(populate);
      });
    else
      queryPromise = queryPromise.populate(params.populate);
  }

  queryPromise
    .then((user) => {
      return res.ok({user: user});
    })
    .catch((err) => {
      logger.log('error', err);
      return res.internalServer();
    });
}

function getUserProvider(req, res) {
  let params = QueryService.buildQuery(req);

  params.query.owner = req.user._id;

  let queryPromise = Passport.findOne(params.query);

  queryPromise
    .then((passport) => {
      return res.ok({provider: passport.provider});
    })
    .catch((err) => {
      logger.log('error', err);
      return res.internalServer();
    });
}

function updateMyInfo(req, res) {
  req.user.lastUpdatedAt = new Date();
  req.user.updatedBy = req.user._id;

  if (req.body.name)
    req.user.name = req.body.name;
  if (req.body.mobile)
    req.user.mobile = req.body.mobile;
  if (req.body.phone)
    req.user.phone = req.body.phone;
  if (req.body.birth)
    req.user.birth = req.body.birth;

  req.user.marketingMailAgree = req.body.marketingMailAgree;
  req.user.marketingSmsAgree = req.body.marketingSmsAgree;

  if (req.body.deliveryInfo)
    req.user.deliveryInfo = req.body.deliveryInfo;
  if (req.body.shoppingCart)
    req.user.shoppingCart = req.body.shoppingCart;

  req.user.save()
    .then((user) => {
      return res.ok({user: user});
    })
    .catch((err) => {
      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function changePassword(req, res) {
  AuthService.changePassword(req)
    .then(() => {
      return res.ok({message: "Password change complete"});
    })
    .catch((err) => {
      if (err.message === 'PassportNotFound'
        || err.message === 'BadRequest') return res.badRequest();

      if (err.message === 'InvalidPassword') return res.unprocessableEntity();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}