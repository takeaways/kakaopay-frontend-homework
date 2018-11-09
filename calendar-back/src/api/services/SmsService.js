/**
 * Created by JongIn Koo on 11/28/2016
 * As part of ServerStarter
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by JongIn Koo <developer@applicat.co.kr>, 11/28/2016
 *
 */

"use strict";

let logger = Bifido.logger('Bifido');
let request = require('request');
let Promise = require('bluebird');
let xml2js = require('xml2js');

module.exports = {
  send: send
};

function send(message, to, from, title, charset, ttl, ref) {

  let queryString = {
    //Mandatory
    id: Bifido.config.connections.sms.id,
    pwd: Bifido.config.connections.sms.pwd,
    from: from || Bifido.config.connections.sms.sender,
    to: to || '01011112222', // 수신자 전화번호(max 13bytes) ex) to=0193446280
    to_country: '82',//국가코드(1-3byte), 한국 82
    message: message,
    report_req: '1'
  };

  //Optional
  if (title) queryString.title = title;//[STRING]
  if (charset) queryString.charset = charset;//[STRING] default:1(utf-8), 2(euc-kr)
  if (ttl) queryString.ttl = ttl; //[STRING] 메시지 유효 시간(초단위) ex) ttl=86400 (24hour = 60 * 60 * 24)
  if (ref) queryString.ref = ref; //[STRING] 여분 필드, 고객이 설정할 수 있는 필드 값 (최대 길이 20 bytes. 영.숫자만 가능 )

  let options = {
    url: 'http://rest.supersms.co:6200/sms/xml',
    method: 'GET',
    qs: queryString
  };

  return new Promise(function (resolve, reject) {
    request(options, function (err, res, body) {
      if (err){
        logger.debug(err);
        return reject(err);
      }

      xml2js.parseString(body, function (err, result) {
        if (err) {
          return reject(err);
        } else {
          logger.debug(body);
          return resolve(result);
        }
      });
    })
  })
}

/*
 Response Return Code

 SUCCESS R000 성공
 FAILURE R001 server busy
 INVALID R002 인증 실패
 INVALID R003 수신자번호형식오류
 INVALID R004 발신자번호형식오류
 INVALID R005 메시지 형식 오류
 INVALID R006 유효하지 않은 TTL
 INVALID R007 유효하지 않은 파라미터 오류
 INVALID R008 스팸 필터링
 INVALID R009 서버 capacity 초과, 재시도 요망
 INVALID R010 등록되지 않은 발신번호 사용
 INVALID R011 발신번호 변작방지 기준위반 발신번호 사용
 INVALID R012 해당 서비스유형 전송권한 없음
 INVALID R013 발송 가능건수 초과
 UNKNOWN R999 알려지지 않은 에러
 */

