'use strict';

let EMAIL_REGEX = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

//(?=.*[a-z]) The string must contain at least 1 lowercase alphabetical character
//(?=.*[A-Z]) The string must contain at least 1 uppercase alphabetical character
//(?=.*[0-9]) The string must contain at least 1 numeric character
//(?=.*[!@#\$%\^&\*]) The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
//(?=.{8,}) The string must be eight characters or longer
//(?=.*[a-zA-Z]) One alphabet
let passwordReg = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})");

function validateEmail(str) {
  return EMAIL_REGEX.test(str);
}

function protocols() {
}

let logger = CalendarServer.logger('LocalStrategy');

protocols.prototype = Object.create({
  register: register,
  connect: connect,
  login: login,
  createUser: createUser,
});

module.exports = new protocols();

function register(identifier, password) {
  let user = {
    identifier: identifier,
    password: password,
  };

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
          owner: req.user._id,
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
  query.isDeleted = false;

  User.findOne(query, function (err, user) {
    if (err) return next(err);

    if (!user) {
      return next(new Error('Error.Passport.identifier.NotFound'), false);
    }

    Passport.findOne({owner: user._id, server: req.server, provider: 'calendarServer'},
      function (err, passport) {
        if (passport) {
          passport.validatePassword(password, function (err, res) {
            if (err) return next(err);

            if (!res) return next(new Error('Error.Passport.Password.Wrong'), false);
            else return next(null, user, passport);

          });
        } else return next(new Error('Error.Passport.Password.NotSet'), false);

      });
  });
}


function createUser(_user) {
  return new Promise((resolve, reject) => {

    let password = _user.password;
    delete _user.password;

    _user.role = CalendarServer.config.security.defaultRole;

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
        if (createdUser && createdUser._id) return User.remove({_id:createdUser._id}, () => {
        }).exec();
        reject(err);
      });
  });
}