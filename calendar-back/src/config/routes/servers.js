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

module.exports = {
	/**************************************
   *               Event
   *************************************/
  'GET /event/find': 'EventController.find',
  'GET /event/findOne': 'EventController.findOne',
  'POST /event': 'EventController.create',
  'PUT /event': 'EventController.update',
  'DELETE /event': 'EventController.remove',
};