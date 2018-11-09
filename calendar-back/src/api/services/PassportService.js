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

let path = require('path');
let url = require('url');
let passport = require('passport');

let logger = Bifido.logger('PassportService');

// Load authentication protocols
passport.protocols = require('./protocols');
passport.connect = connect;
passport.callback = callback;
passport.loadStrategies = loadStrategies;
passport.disconnect = disconnect;
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

module.exports = passport;


/**
 * Connect a third-party profile to a local user
 *
 * This is where most of the magic happens when a user is authenticating with a
 * third-party provider. What it does, is the following:
 *
 *   1. Given a provider and an identifier, find a mathcing Passport.
 *   2. From here, the logic branches into two paths.
 *
 *     - A user is not currently logged in:
 *       1. If a Passport wassn't found, create a new user as well as a new
 *          Passport that will be assigned to the user.
 *       2. If a Passport was found, get the user associated with the passport.
 *
 *     - A user is currently logged in:
 *       1. If a Passport wasn't found, create a new Passport and associate it
 *          with the already logged in user (ie. "Connect")
 *       2. If a Passport was found, nothing needs to happen.
 *
 * As you can see, this function handles both "authentication" and "authori-
 * zation" at the same time. This is due to the fact that we pass in
 * `passReqToCallback: true` when loading the strategies, allowing us to look
 * for an existing session in the request and taking action based on that.
 *
 * For more information on auth(entication|rization) in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
 * http://passportjs.org/guide/authorize/
 *
 * @param {Object}   req
 * @param {Object}   query
 * @param {Object}   profile
 * @param {Function} next
 */
function connect(req, query, profile, next) {
  let user = {};

  // Get the authentication provider from the query.
  query.provider = req.param('provider');


  // Use profile.provider or fallback to the query.provider if it is undefined
  // as is the case for OpenID, for example
  let provider = profile.provider || query.provider;
  query.accessToken = query.tokens.accessToken;

  // If the provider cannot be identified we cannot match it to a passport so
  // throw an error and let whoever's next in line take care of it.
  if (!provider) {
    return next(new Error('No authentication provider was identified.'));
  }

  if (!query.identifier && profile.hasOwnProperty('id')) {
    query.identifier = profile.id;
  }

  // If the profile object contains a list of emails, grab the first one and
  // add it to the user.
  if (profile.hasOwnProperty('emails')) {
    user.identifier = profile.emails[0].value;
  }
  // If the profile object contains a username, add it to the user.
  if (profile.hasOwnProperty('username')) {
    user.username = profile.username;
  }

  Passport.findOne({
    provider: provider,
    server: server,
    identifier: query.identifier.toString()
  })
    .then(function (passport) {
      if (!req.user) {
        // Scenario: A new user is attempting to sign up using a third-party
        //           authentication provider.
        // Action:   Create a new user and assign them a passport.
        if (!passport) {
          return User.create(user)
            .then(function (user) {
              query.owner = user._id;
              return Passport.create(query);
            })
            .then((passport) => {
              return User.findOne({_id: passport.owner});
            });
        }
        // Scenario: An existing user is trying to log in using an already
        //           connected passport.
        // Action:   Get the user associated with the passport.
        else {
          // If the tokens have changed since the last session, update them
          if (query.hasOwnProperty('tokens') && query.tokens !== passport.tokens) {
            passport.tokens = query.tokens;
            if (query.tokens.accessToken)
              passport.accessToken = query.tokens.accessToken;
          }

          // Save any updates to the Passport before moving on
          return passport.save(passport)
            .then((passport) => {
              return User.findOne({_id: passport.owner});
            });
        }
      } else {
        // Scenario: A user is currently logged in and trying to connect a new
        //           passport.
        // Action:   Create and assign a new passport to the user.
        if (!passport) {
          query.owner = req.user._id;

          return Passport.create(query)
            .then((passport) => {
              return User.findOne({_id: passport.owner});
            });
        }
        // Scenario: The user is a nutjob or spammed the back-button.
        // Action:   Simply pass along the already established session.
        // or wanting to log in as different user
        else {
          return User.findOne({_id: passport.owner});
        }
      }
    })
    .then((user) => {
      next(null, user);
    })
    .catch((err) => {
      if (err) {
        if (err.code === 'E_VALIDATION')
          if (err.invalidAttributes.identifier) return next(new Error('Error.Passport.Email.Exists'));
          else return next(new Error('Error.Passport.User.Exists'));

        return next(err);
      }
    });
}


/**
 * Create an authentication callback endpoint
 *
 * For more information on authentication in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
function callback(req, res, next) {
  let provider = req.param('provider');
  let action = req.param('action');

  logger.debug("provider: %s action: %s", provider, action);

  this.authenticate(provider, next)(req, res, req.next);
}


/**
 * Load all strategies defined in the Passport configuration
 *
 * For example, we could add this to our config to use the GitHub strategy
 * with permission to access a users email address (even if it's marked as
 * private) as well as permission to add and update a user's Gists:
 *
 github: {
      name: 'GitHub',
      protocol: 'oauth2',
      scope: [ 'user', 'gist' ]
      options: {
        clientID: 'CLIENT_ID',
        clientSecret: 'CLIENT_SECRET'
      }
    }
 *
 * For more information on the providers supported by Passport.js, check out:
 * http://passportjs.org/guide/providers/
 *
 */
function loadStrategies() {
  let self = this;
  let strategies = Bifido.config.passport;

  Object.keys(strategies).forEach(function (key) {
    let options = {passReqToCallback: true};
    let Strategy;

    if (key === 'local') {
      // Since we need to allow users to login using both usernames as well as
      // emails, we'll set the username field to something more generic.
      _.extend(options, {usernameField: 'identifier'});

      // Only load the local strategy if it's enabled in the config
      if (strategies.local) {
        Strategy = strategies[key].strategy;

        self.use(new Strategy(options, self.protocols.local.login));
      }
    } else if (key === 'pos') {
      // Since we need to allow users to login using both usernames as well as
      // emails, we'll set the username field to something more generic.
      _.extend(options, {usernameField: 'identifier'});

      // Only load the local strategy if it's enabled in the config
      if (strategies.local) {
        Strategy = strategies[key].strategy;

        self.use(key, new Strategy(options, self.protocols.pos.login));
      }
    } else {
      let protocol = strategies[key].protocol;
      let callback = strategies[key].callback;

      if (!callback) {
        callback = path.join('auth', key, 'callback');
      }

      Strategy = strategies[key].strategy;

      let baseUrl = Bifido.config.connections.oauthBaseUrl;

      switch (protocol) {
        case 'oauth':
        case 'oauth2':
          options.callbackURL = path.join(baseUrl, callback);
          break;

        case 'openid':
          options.returnURL = url.resolve(baseUrl, callback);
          options.realm = baseUrl;
          options.profile = true;
          break;
      }

      // Merge the default options with any options defined in the config. All
      // defaults can be overriden, but I don't see a reason why you'd want to
      // do that.
      _.extend(options, strategies[key].options);

      self.use(new Strategy(options, self.protocols[protocol]));
    }
  });
}


/**
 * Disconnect a passport from a user
 *
 * @param  {Object} req
 * @param  {Object} res
 */
function disconnect(req, res, next) {
  let user = req.user;
  let provider = req.param('provider');

  Passport.findOne({
    provider: provider,
    user: user._id
  }, function (err, passport) {
    if (err) return next(err);
    Passport.remove(passport._id, function passportDestroyed(error) {
      if (err) return next(err);
      next(null, user);
    });
  });
}

function serializeUser(user, next) {
  next(null, user._id);
}

function deserializeUser(_id, next) {
  User.findOne({_id: _id})
    .then(function (user) {
      next(null, user || null);
    })
    .catch(function (error) {
      next(error);
    });
}