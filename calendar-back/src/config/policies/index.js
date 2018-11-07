'use strict';

let admin = ['AuditPolicy', 'BearerAuth', 'Admin'];

let ownerOrAdmin = ['AuditPolicy', 'BearerAuth', 'User'];

let owner = ['AuditPolicy', 'BearerAuth', 'User'];

let user = ['AuditPolicy', 'BearerAuth', 'User'];

let anyone = ['AuditPolicy'];

module.exports = {
  '*': false,

  AuthController: {
    // Public
    checkEmail: anyone,
    checkUsername: anyone,
    checkNickname: anyone,
    register: anyone,
    login: anyone,
    OAuthConnect: anyone,
    confirmActivation: anyone,
    forgotPasswordStart: anyone,
    forgotPasswordCheck: anyone,
    forgotPasswordComplete: anyone,
    support: anyone,
    reportError: anyone,
    logout: anyone,

    // 사용자
    getMyUserInfo: user,
    updateMyInfo: user,

    // 사용자
    connectLocal: user,
    OAuthDisconnect: user,
    changePassword: user,
    changeIdentifier: user,
    sendActivationEmail: user,

  },

  EventController: {
    // public
    count: anyone,
    find: anyone,
    findOne: anyone,

    // 사용자
    create: anyone,
    update: anyone,
    remove: anyone,
  }
};





