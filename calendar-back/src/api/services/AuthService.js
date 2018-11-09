'use strict';

/**
 * Created by PHILIP on 02/11/2016
 * As Part of GetWalk
 *
 * Copyright (C) Applicat (www.applicat.co.kr) - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 02/11/2016
 *
 */

// Imports
let jwt = require('jsonwebtoken');
let crypto = require('crypto');

const uuidV1 = require('uuid/v1');

// Logger
let logger = Bifido.logger('AuthService');

let EMAIL_REGEX = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

module.exports = {

  // Token
  getToken: getToken,
  verifyToken: verifyToken,

  // Password Reset
  passwordResetStart: passwordResetStart,
  passwordResetCheck: passwordResetCheck,
  passwordResetComplete: passwordResetComplete,

  // Chanage Password
  changePassword: changePassword,

  // OAuth
  OAuthLogin: OAuthLogin,
  OAuthDisconnect: OAuthDisconnect,
  getNaverAccessToken: getNaverAccessToken,
};

function getToken(userinfo, _duration) {
  let duration = _duration || "7 days";
  let secret = Bifido.config.sessions.secret;
  let token = jwt.sign(userinfo, secret, {'expiresIn': duration});
  return token;
}

function verifyToken(token, callback) {
  let secret = Bifido.config.sessions.secret;
  jwt.verify(token, secret, callback);
}

function passwordResetStart(req) {
  let identifier = req.param('identifier');

  return Promise.resolve()
    .then(() => {
      if (!identifier || !regExp.test(identifier)) throw new Error("BadRequest");
      return User.findOne({identifier: identifier})
    })
    .then(function (user) {
      if (!user) throw new Error("UserNotFound");

      // 5번 요청 이후 마지막 요청 기준 1일이 지나야 다시 요청 가능
      if (user.passwordResetCounter > 4) {
        let now = new Date().getTime();
        if ((now - user.passwordResetRequestTime) < (24 * 60 * 60 * 1000)) throw new Error("ExceedDailyRequestLimit");
        else user.passwordResetCounter = 0;
      }

      // 인증코드 발급
      let code = generateCode(identifier);

      // 비밀번호 찾기 정보 저장
      user.passwordResetCode = code;
      user.passwordResetRequestTime = new Date().getTime();
      user.passwordResetCounter++;
      return user.save()
    })
    .then(function (user) {

      return MailService.sendEmail(
        "passwordreset",
        "kr",
        {
          email: user.identifier,
          date: Moment().format("YYYY년 MM월 DD일 HH시 mm분"),
          code: user.passwordResetCode
        },
        {email: "support@bifido-official.com", name: "BIFIDO Support"},
        [user.identifier]
      );
    });
}

function passwordResetCheck(req) {
  let identifier = req.param('identifier');
  let code = req.param('code');

  return Promise.resolve()
    .then(() => {
      if (!identifier || !code || !regExp.test(identifier)) throw new Error("BadRequest");
      return User.findOne({identifier: identifier})
    })
    .then(function (user) {
      if (!user) throw new Error("UserNotFound");
      if (!user.passwordResetCode) throw new Error("PasswordResetNotRequested");
      if (user.passwordResetCode !== code) throw new Error("InvalidCode");

      let now = new Date().getTime();
      if (now > (user.passwordResetRequestTime + (60 * 60 * 1000))) throw new Error("PasswordResetExpired");

      // 세션에 비밀번호 찾기 성공 정보 저장
      req.session.passwordReset = true;
      req.session.identifier = identifier;

      // 비밀번호 찾기 정보 저장
      user.passwordResetCode = null;
      user.passwordResetCounter = 0;
      return user.save();
    });
}

function passwordResetComplete(req) {
  let identifier = req.session.identifier;
  let newPassword = req.param("newPassword");

  return Promise.resolve()
    .then(() => {
      if (!identifier || !newPassword) throw new Error("BadRequest");
      if (!req.session.passwordReset) throw new Error("PasswordResetNotRequested");
      return User.findOne({identifier: identifier})
        .populate({path: 'passports', match: {protocol: 'local'}})
    })
    .then(function (user) {
      if (!user) throw new Error("UserNotFound");

      req.session.passwordReset = false;
      req.session.identifier = null;

      if (user.passports && user.passports.length > 0) {
        user.passports[0].password = newPassword;
        return user.passports[0].save();
      }

      return Passport.create({
        protocol: 'local',
        password: newPassword,
        owner: user._id
      });
    });
}

function changePassword(req) {
  let id = req.user._id;
  let oldPassword = req.param("oldPassword");
  let newPassword = req.param("newPassword");

  let foundPassport;

  return Promise.resolve()
    .then(() => {
      if (!newPassword || !oldPassword || !req.user._id) throw new Error("BadRequest");
      return Passport.findOne({owner: id, protocol: 'local'})
    })
    .then(function (passport) {
      if (!passport) throw new Error("PassportNotFound");
      foundPassport = passport;

      return Promise.promisify(
        foundPassport
          .validatePassword
          .bind(foundPassport))(oldPassword);
    })
    .then(function (result) {
      if (!result) throw new Error("InvalidPassword");

      foundPassport.password = newPassword;
      return foundPassport.save();
    });
}

function sha1(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

function generateCode(source) {
  return sha1(source + new Date().toString().split("").sort(function () {
    return Math.round(Math.random()) - 0.5;
  })).substr(0, 8);
}

function OAuthLogin(req, res) {

  let provider = req.param('provider');
  let code = req.param('code');
  let state = req.param('state');
  let redirectUrl = req.param('redirectUrl');

  if (!provider || !redirectUrl) return res.badRequest();

  if (!code) {

    req.session.oauthState = uuidV1();

    // redirect to providers login page
    if (provider === "google") return res.ok({link: googleLogin(req.session.oauthState, redirectUrl)});
    if (provider === "facebook") return res.ok({link: facebookLogin(req.session.oauthState, redirectUrl)});
  }

  if (!state
    || !req.session.oauthState
    || req.session.oauthState !== state)
    return res.preconditionFailed();         // 412

  let user, passport, profileDataPromise;
  if (provider === "google") profileDataPromise = connectGoogle(code, redirectUrl);
  if (provider === "facebook") profileDataPromise = connectFacebook(code, redirectUrl);

  Promise.resolve(profileDataPromise)
    .then((data) => {

      if (!EMAIL_REGEX.test(data.email)) throw new Error("NoIdentifierError");

      user = {
        identifier: data.email,
      };

      passport = {
        provider: provider,
        identifier: data.identity
      };

      return Passport.findOne(passport);
    })
    .then(_passport => {
      /**
       *
       * 네가지 상황이 있을 수 있다.
       * - 로그인 (Passport가 이미 존재 할경우)
       * - 연결
       *    - 기존 유저 (동일 이메일일 경우)
       *    - 기존 유저 (다른 이메일이지만 이미 로그인된 사용자일 경우 req.session.user 존재)
       *    X 기존 유저 + OAuth 사용자 둘다 가입 되어 있는 경우 연결을 불가 한다
       *    (다른 시스템에서는 가끔식 두개의 사용자를 합쳐주기도 하지만 우린 No!)
       * - 회원가입
       *
       * Logic 순서는
       *
       * 1. req.user를 체크
       *    true -> 연결
       *    false -> 2
       * 2. passport.findOne
       *    있다 -> 로그인
       *    없다 -> 회원가입
       *
       */

      // 이미 회원가입한 OAuth는 기존 사용자랑 연동 불가능
      if (req.user && _passport) {
        if (req.user._id !== _passport.owner)
          throw new Error("ConnectFailedUserAlreadyExist");
        else // 재로그인
          return User.findOne({_id: _passport.owner});
      }

      // 로그인
      if (!req.user && _passport) return User.findOne({_id: _passport.owner});

      // 기존 유저 연동
      if (req.user && !_passport) return OAuthConnect(req.user, passport);

      // 회원 가입
      if (!req.user && !_passport) return OAuthRegister(user, passport);
    })
    .then((_user) => {
      user = _user;
      req.logIn = Promise.promisify(req.logIn);
      return req.logIn(_user);
    })
    .then(() => {
      // Get populated fields
      user = user.toObject();
      let userData = {
        identifier: user.identifier,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
      };

      let token = getToken({_id: user._id});
      req.session.authenticated = true;
      return res.ok({user: userData, token: token});
    })
    .catch(err => {

      logger.log('debug', err);
      if (err.message === 'ConnectFailedUserAlreadyExist') return res.notAcceptable();      // 406                     // 409
      if (err.message === 'WrongClient') return res.conflict();                             // 409
      if (err.message === 'TokenAlreadyUsed') return res.gone();                            // 410
      if (err.message === 'NoIdentifierError') return res.unprocessableEntity();            // 422

      logger.log('error', err);
      return res.internalServer();
    });
}

function OAuthDisconnect(req, res) {
  let provider = req.param('provider');

  if (!provider) return res.badRequest();

  Passport.find({owner: req.user._id})
    .then(passports => {
      if (!passports) throw new Error("PassportNotFound");
      if (passports && passports.length < 2) throw new Error("MinimumPassportRequirement");

      return Passport.remove({owner: req.user._id, provider: provider});
    })
    .then(data => {
      res.ok({message: 'done'});
    })
    .catch((err) => {

      logger.log('debug', err);
      if (err.message === 'PassportNotFound') return res.preconditionFailed();         // 412
      if (err.message === 'MinimumPassportRequirement') return res.unprocessableEntity();            // 422

      logger.log('error', err);
      return res.internalServer();
    })
}

/***********************************
 *       Private Methods
 ***********************************/

// 기존 유저 연동
function OAuthConnect(user, passport) {
  passport.owner = user._id;

  return Passport.create(passport)
    .then(passport => {
      return user;
    });
}

// 회원 가입 (이메일이 같을 경우, 기존 사용자 연동)
function OAuthRegister(user, passport) {
  let existingUser;

  return new Promise((resolve, reject) =>
    User.findOrCreate(user, user,
      function (err, _user) {
        if (err) return reject(err);
        resolve(_user);
      }))
    .then(user => {
      existingUser = user;
      passport.owner = existingUser._id;
      return Passport.create(passport);
    })
    .then(passport => {
      return existingUser;
    });
}


function googleLogin(state, redirectUrl) {
  let clientId = AppZet.config.connections.google.clientId;
  let scope = AppZet.config.connections.google.scope;
  let access_type = AppZet.config.connections.google.accessType;
  let response_type = AppZet.config.connections.google.response_type;

  let url = "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=" + clientId +
    "&redirect_uri=" + redirectUrl +
    "&response_type=" + response_type +
    "&access_type=" + access_type +
    "&state=" + state +
    "&scope=" + scope;

  return url;
}

function connectGoogle(code, redirectUrl) {
  let clientId = AppZet.config.connections.google.clientId;
  let clientSecret = AppZet.config.connections.google.clientSecret;

  let grant_type = "authorization_code";
  let tokenUrl = "https://www.googleapis.com/oauth2/v4/token";
  let profileUrl = "https://www.googleapis." +
    "com/oauth2/v3/tokeninfo";

  let postRequest = Promise.promisify(Request.post, {multiArgs: true});

  return postRequest(tokenUrl, {
    form: {
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
      grant_type: grant_type,
    }
  })
    .then((data) => {
      let body;
      try {
        body = JSON.parse(data[1]);
      }
      catch (e) {
        throw e;
      }

      if (body.error) throw new Error(body.error_description);

      return postRequest(profileUrl, {
        form: {
          id_token: body.id_token
        }
      })
    })
    .then((data) => {
      let body;
      try {
        body = JSON.parse(data[1]);
      }
      catch (e) {
        throw e;
      }

      if (body.aud !== clientId) throw new Error("WrongClient");
      if (!body.email) throw new Error("NoIdentifierError");

      if (Array.isArray(body.email)) body.email = body.email[0];

      return {
        email: body.email,
        identity: body.sub
      };
    })
    .catch(err => {
      if (err.message.indexOf("Code was already redeemed") > -1)
        throw new Error("TokenAlreadyUsed");
      throw err;
    });
}


function facebookLogin(state, redirectUrl) {
  let clientId = AppZet.config.connections.facebook.clientId;
  let scope = AppZet.config.connections.facebook.scope;
  let response_type = AppZet.config.connections.facebook.response_type;

  let url = "https://www.facebook.com/v2.8/dialog/oauth" +
    "?client_id=" + clientId +
    "&redirect_uri=" + encodeURIComponent(redirectUrl) +
    "&response_type=" + response_type +
    "&state=" + state +
    "&scope=" + scope;

  return url;

}


function connectFacebook(code, redirectUrl) {
  let clientId = AppZet.config.connections.facebook.clientId;
  let clientSecret = AppZet.config.connections.facebook.clientSecret;

  let tokenUrl = "https://graph.facebook.com/v2.8/oauth/access_token" +
    "?client_id=" + clientId +
    "&redirect_uri=" + encodeURIComponent(redirectUrl) +
    "&client_secret=" + clientSecret +
    "&code=" + code;

  return Promise.promisify(Request.get, {multiArgs: true})(tokenUrl)
    .then((data) => {
      let body;
      try {
        body = JSON.parse(data[1]);
      }
      catch (e) {
        throw e;
      }

      if (body.error) throw new Error(body.error.message);

      let profileRequest = {
        url: "https://graph.facebook.com/v2.8/me?fields=email",
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + body.access_token
        }
      };

      return Promise.promisify(Request.get, {multiArgs: true})(profileRequest);
    })
    .then((data) => {
      let body;
      try {
        body = JSON.parse(data[1]);
      }
      catch (e) {
        throw e;
      }

      if (!body.email) throw new Error("NoIdentifierError");

      if (Array.isArray(body.email)) body.email = body.email[0];

      return {
        email: body.email,
        identity: body.id
      };
    })
    .catch(err => {
      if (err.message.indexOf("This authorization code has been used") > -1)
        throw new Error("TokenAlreadyUsed");
      throw err;
    });

}

function getNaverAccessToken(req, res) {
  console.log("req.body :::\n", req.body);

  return new Promise((resolve, reject) => {
    var api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code'
      + '&client_id=' + Bifido.config.connections.naver.clientId
      + '&client_secret=' + Bifido.config.connections.naver.clientSecret
      + '&code=' + req.body.code
      + '&state=' + req.body.state;

    var request = require('request');
    var options = {
      url: api_url
    };

    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        return resolve(JSON.parse(body));
      } else {
        if (response != null) {
          throw new Error('cannotGetAccessToken');
        }
      }
    });
  });
}

// function getNaverUserInfo(params) {
//
//   var token = params.access_token;
//   var header = "Bearer " + token; // Bearer 다음에 공백 추가
//
//   var api_url = 'https://openapi.naver.com/v1/nid/me';
//   var request = require('request');
//   var options = {
//     url: api_url,
//     headers: {'Authorization': header}
//   };
//   request.get(options, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
//       console.log("body :::\n", body);
//       return res.ok(body);
//
//       // res.end(body);
//     } else {
//       console.log('error');
//       if (response != null) {
//         res.status(response.statusCode).end();
//         console.log('error = ' + response.statusCode);
//       }
//     }
//   });
//
// }