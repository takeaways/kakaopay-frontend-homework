'use strict';

let logger = CalendarServer.logger('AuthController');
let regExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
let Promise = require('bluebird');

module.exports = {
  // Public
  checkEmail: checkEmail,
  checkUsername: checkUsername,
  checkNickname: checkNickname,
  register: register,
  login: login,
  posLogin: posLogin,
  posRenewSession: posRenewSession,
  OAuthConnect: OAuthConnect,
  confirmActivation: confirmActivation,
  forgotPasswordStart: forgotPasswordStart,
  forgotPasswordCheck: forgotPasswordCheck,
  forgotPasswordComplete: forgotPasswordComplete,
  support: support,
  reportError: reportError,

  logout: logout,

  // 앱젯 사용자
  connectLocal: connectLocal,
  OAuthDisconnect: OAuthDisconnect,
  changeIdentifier: changeIdentifier,
  changePassword: changePassword,
  getMyUserInfo: getMyUserInfo,
  updateMyInfo: updateMyInfo,
  sendActivationEmail: sendActivationEmail,

  // POS 사용자 (서버)
  posLogout: posLogout,

};

function checkEmail(req, res) {
  let email = req.param('email');

  if (!email || !regExp.test(email)) return res.ok({isAvailable: false});

  User.findOne({identifier: email})
    .then(function (user) {
      if (user) {
        return res.ok({isAvailable: false});
      } else {
        return res.ok({isAvailable: true});
      }
    })
    .catch(function (err) {
      logger.log('error', err);
      return res.internalServer();
    });
}

function checkUsername(req, res) {
  let username = req.param('username');

  if (!username) return res.ok({isAvailable: false});

  User.findOne({username: username})
    .then(function (user) {
      if (user) {
        return res.send(200, {isAvailable: false});
      } else {
        return res.send(200, {isAvailable: true});
      }
    })
    .catch(function (err) {
      logger.log('error', err);
      return res.internalServer();
    });
}

function checkNickname(req, res) {
  let nickname = req.param('nickname');

  if (!nickname) return res.ok({isAvailable: false});

  User.findOne({nickname: nickname})
    .then(function (user) {
      if (user) {
        return res.send(200, {isAvailable: false});
      } else {
        return res.send(200, {isAvailable: true});
      }
    })
    .catch(function (err) {
      logger.log('error', err);
      return res.internalServer();
    });
}

function register(req, res) {
  PassportService.protocols.local.register(req.body.identifier, req.body.password)
    .then((user) => {
      return res.ok({user: user});
    })
    .catch(err => {
      if (err.message === "NoPassword"
        || err.message === "InvalidPassword") return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function login(req, res) {
  PassportService.authenticate('local', handler)(req, res, req.next);

  function handler(err, user, message) {
    if (err) {
      switch (err.message) {
        case 'Error.Passport.identifier.NotFound':
          return res.unauthorized({message: "NotRegistered"});
        case 'Error.Passport.Password.Wrong':
          return res.unauthorized({message: "WrongPassword"});
        case 'Error.Passport.Password.NotSet':
          return res.badRequest();
        default:
          logger.log('error', err);
          return res.internalServer();
      }
    }

    req.logIn = Promise.promisify(req.logIn);
    req.logIn(user)
      .then(function () {
        // Get populated fields
        let userData = user.toJSON();

        let token = AuthService.getToken({_id: userData._id});
        req.session.authenticated = true;
        req.session.user = user;
        return res.ok({user: userData, token: token});
      })
      .catch(function (err) {
        logger.log('error', err);
        return res.internalServer();
      });
  }
}

function posLogin(req, res) {
  let authenticator = PassportService.authenticate('pos', handler);
  authenticator(req, res, req.next);

  function handler(err, user, message) {
    if (err) {
      logger.log('error', err);
      return res.internalServer();
    }

    if (!user) return res.unauthorized();

    let foundUser;
    req.logIn = Promise.promisify(req.logIn);
    req.logIn(user)
      .then(function () {
        return user
          .populate({path: 'passports'})
          .execPopulate();
      })
      .then(function (user) {
        foundUser = user;
        let posPassport = _.find(foundUser.passports, {protocol: 'pos'});
        if (!posPassport) throw new Error("PassportNotFound");

        foundUser = foundUser.toObject();
        let userData = {
          identifier: foundUser.identifier,
          firstName: foundUser.firstName,
          middleName: foundUser.middleName,
          lastName: foundUser.lastName,
        };

        posPassport.refreshToken = AuthService.getToken(userData);
        delete posPassport._doc.password;
        return posPassport.save();
      })
      .then((passport) => {

        let token = AuthService.getToken({_id: foundUser._id});

        req.session.authenticated = true;
        return res.ok({refreshToken: passport.refreshToken, token: token});
      })
      .catch(function (err) {

        if (err.message === "PassportNotFound")return res.unauthorized();                   // 422

        if (err.name === 'MongoError' || err instanceof Mongoose.Error)
          return res.mongooseError(err);

        logger.log('error', err);
        return res.internalServer();
      });
  }
}


function posRenewSession(req, res) {
  let identifier = req.body.identifier;
  let refreshToken = req.body.refreshToken;

  let foundUser;

  User.findOne({identifier: identifier})
    .populate("passports")
    .then(user => {
      if (!user) throw new Error("UserNotFound");
      let posPassport = _.find(user.passports, {protocol: 'pos'});
      if (!posPassport) throw new Error("PassportNotFound");
      if (!posPassport.refreshToken) throw new Error("PassportNoRefreshToken");
      if (posPassport.refreshToken !== refreshToken) throw new Error("PassportRefreshTokenNotMatch");

      foundUser = user;

      let userData = {
        identifier: foundUser.identifier,
        firstName: foundUser.firstName,
        middleName: foundUser.middleName,
        lastName: foundUser.lastName,
      };

      posPassport.refreshToken = AuthService.getToken(userData);
      delete posPassport._doc.password;
      req.logIn = Promise.promisify(req.logIn);
      return [
        posPassport.save(),
        req.logIn(foundUser)
      ];
    })
    .spread((passport) => {
      req.session.authenticated = true;
      return res.ok({refreshToken: passport.refreshToken});
    })
    .catch(function (err) {

      switch (err.message) {
        case "UserNotFound":
        case "PassportNotFound":
        case "PassportNoRefreshToken":
        case "PassportRefreshTokenNotMatch":
          return res.unprocessableEntity();                   // 422
          break;
      }

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      logger.log('error', err.stack);
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


function confirmActivation(req, res) {
  AuthService.activationComplete(req)
    .then((data) => {
      return res.ok({message: 'done'});
    })
    .catch((err) => {
      if (err.message === 'UserNotFound'
        || err.message === "BadRequest") return res.badRequest();                     // 400
      if (err.message === 'AlreadyActivated') return res.conflict();                  // 409
      if (err.message === 'ActivationNotRequested') return res.preconditionFailed();  // 412
      if (err.message === 'InvalidCode') return res.unprocessableEntity();                   // 422
      if (err.message === 'ActivationExpired') return res.unprocessableEntity();      // 422

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function forgotPasswordStart(req, res) {
  AuthService.passwordResetStart(req)
    .then(function (data) {
      return res.ok({message: "Password reset email sent."});
    })
    .catch(function (err) {
      if (err.message === 'UserNotFound'
        || err.message === "BadRequest") return res.badRequest();                 //400

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
    .then(function () {
      return res.ok({message: 'done'});
    })
    .catch(function (err) {
      logger.log('error', err);

      if (err.message === 'UserNotFound'
        || err.message === "BadRequest") return res.badRequest();
      if (err.message === 'PasswordResetNotRequested') return res.preconditionFailed();
      if (err.message === 'InvalidCode') return res.unprocessableEntity();
      if (err.message === 'PasswordResetExpired') return res.unprocessableEntity();
      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);
      
      return res.internalServer();
    });
}

function forgotPasswordComplete(req, res) {
  AuthService.passwordResetComplete(req)
    .then(function () {
      return res.ok({message: "Password reset complete"});
    })
    .catch(function (err) {
      if (err.message === 'UserNotFound'
        || err.message === "BadRequest") return res.badRequest();

      if (err.message === 'PasswordResetNotRequested') return res.preconditionFailed();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function support(req, res) {
  let data = {}, files = [];

  new Promise((resolve, reject) => {
    let form = new Multiparty.Form({uploadDir: 'uploads'});

    form.on('field', function (name, value) {
      data[name] = value;
    });

    // all uploads are completed
    form.on('file', function (name, file) {
      files.push(file);
    });

    // all uploads are completed
    form.on('close', function () {
      resolve(files);
    });

    form.on('error', function (err) {
      reject(err);
    });
    form.parse(req);
  })
    .then(() => {

      if (!data.email
        || !regExp.test(data.email)
        || !data.name
        || !data.category
        || !data.content) throw new Error("BadRequest");

      let attachments = [];
      _.forEach(files, function (file, index) {

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
          name: data.name,
          category: data.category,
          content: data.content,
          date: Moment().format("YYYY년 MM월 DD일 HH시 mm분")
        },
        {email: data.email, name: data.name},
        ["support@calendarServer.com"],
        attachments
      );
    })
    .then(() => {
      res.ok();
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


function connectLocal(req, res) {
  PassportService.protocols.local.connect(req, req.body.identifier, req.body.password)
    .then((user) => {
      return res.ok({user: user});
    })
    .catch(err => {
      if (err.message === "NoPassword"
        || err.message === "InvalidPassword") return res.badRequest();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}


function logout(req, res) {
  req.session.destroy(() => {
    res.ok({});
  });
}

function OAuthDisconnect(req, res) {
  AuthService.OAuthDisconnect(req, res);
}

function changeIdentifier(req, res) {
  AuthService.changeIdentifier(req)
    .then(function () {
      return res.ok({message: "Identifier change complete"});
    })
    .catch(function (err) {
      if (err.message === 'PassportNotFound'
        || err.message === "BadRequest") return res.badRequest();

      if (err.message === 'IdentifierAlreadyInUse') return res.conflict();

      if (err.message === 'InvalidPassword') return res.unprocessableEntity();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function changePassword(req, res) {
  AuthService.changePassword(req)
    .then(function () {
      return res.ok({message: "Password change complete"});
    })
    .catch(function (err) {
      if (err.message === 'PassportNotFound'
        || err.message === "BadRequest") return res.badRequest();

      if (err.message === 'InvalidPassword') return res.unprocessableEntity();

      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function getMyUserInfo(req, res) {
  req.buildQuery()
    .then((params) => {
      params.query._id = req.user._id;

      let queryPromise = User.findOne(params.query);

      if (params.populate) {
        if (Array.isArray(params.populate)) {
          _.forEach(params.populate, (populate) => {
            queryPromise = queryPromise.populate(populate);
          });
        } else {
          queryPromise = queryPromise.populate(params.populate);
        }
      }

      return queryPromise
    })
    .then((user) => {
      return res.status(200).send({user: user});
    })
    .catch((err) => {
      logger.log('error', err);
      return res.internalServer();
    });
}

function updateMyInfo(req, res) {
  req.user.lastUpdatedAt = new Date();
  req.user.updatedBy = req.user._id;

  req.user.fullName = req.body.fullName;
  req.user.firstName = req.body.firstName;
  req.user.middleName = req.body.middleName;
  req.user.lastName = req.body.lastName;
  req.user.phone = req.body.phone;
  req.user.gender = req.body.gender;
  req.user.age = req.body.age;

  req.user.receiveEmail = req.body.receiveEmail;
  req.user.receiveSms = req.body.receiveSms;
  req.user.receivePush = req.body.receivePush;

  req.user.newNotification = req.body.newNotification;


  if (!req.user.owner)
    req.user.owner = req.user._id;

  if (req.body.identifier && req.user.identifier != req.body.identifier) {
    req.user.identifier = req.body.identifier;
    req.user.emailConfirmed = false;
  }

  req.user.save()
    .then(function (user) {
      return res.ok({user: user});
    })
    .catch(function (err) {
      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}

function sendActivationEmail(req, res) {
  AuthService.activationStart(req)
    .then((data) => {
      res.ok({message: 'Activation email sent.'})
    })
    .catch((err) => {
      if (err.message === 'UserNotFound'
        || err.message === "BadRequest") return res.badRequest();

      // 이미 이메일 인증 완료
      if (err.message === 'AlreadyActivated') return res.conflict();

      // 하루 요청량 초과
      if (err.message === 'ExceedDailyRequestLimit') return res.paymentRequired();


      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}


function posLogout(req, res) {
  req.session.destroy(() => {
    res.ok({});
  });
}

function reportError(req, res) {
  let errorReport = {
    ipAddress: req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress),
    logs: req.body.logs,
    owner: req.user && req.user._id ? req.user._id : null
  };

  ErrorReport.create(errorReport)
    .then(() => {
      return res.ok();
    })
    .catch(function (err) {
      if (err.name === 'MongoError' || err instanceof Mongoose.Error)
        return res.mongooseError(err);

      logger.log('error', err);
      return res.internalServer();
    });
}