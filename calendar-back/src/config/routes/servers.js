'use strict';

module.exports = {

  /**************************************
   *               Auth
   *************************************/
  'GET /checkEmail': 'AuthController.checkEmail',
  'GET /checkUsername': 'AuthController.checkUsername',
  'GET /checkNickname': 'AuthController.checkNickname',
  'POST /register': 'AuthController.register',
  'POST /login': 'AuthController.login',
  'POST /oauth/:provider': 'AuthController.OAuthConnect',
  'PUT /activate/confirm': 'AuthController.confirmActivation',
  'POST /forgotPassword': 'AuthController.forgotPasswordStart',
  'POST /forgotPasswordCheck': 'AuthController.forgotPasswordCheck',
  'PUT /forgotPasswordComplete': 'AuthController.forgotPasswordComplete',
  'POST /support': 'AuthController.support',
  'POST /connect': 'AuthController.connectLocal',
  'GET /logout': 'AuthController.logout',
  'DELETE /oauth/:provider': 'AuthController.OAuthDisconnect',
  'PUT /changeIdentifier': 'AuthController.changeIdentifier',
  'PUT /changePassword': 'AuthController.changePassword',
  'GET /me': 'AuthController.getMyUserInfo',
  'PUT /me': 'AuthController.updateMyInfo',
  'POST /activate/send': 'AuthController.sendActivationEmail',
  'POST /posRenewSession': 'AuthController.posRenewSession',
  'POST /reportError': 'AuthController.reportError',
	
  /**************************************
   *               EventCoupon
   *************************************/
  'GET /event/count': 'EventController.count',
  'GET /event/find': 'EventController.find',
  'GET /event/findOne': 'EventController.findOne',
  'POST /event': 'EventController.create',
  'PUT /event': 'EventController.update',
  'DELETE /event': 'EventController.remove',
};