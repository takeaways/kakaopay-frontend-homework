/**
 * Created by PHILIP on 10/07/2017
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & PHILIP - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by PHILIP <hbnb7894@gmail.com>, 10/07/2017
 *
 */

module.exports = [
  // ADMIN
  {
    vId: 1, vRef: [{modelName: "Role", propName: "role", vRefValue: 1}],
    document: {
      identifier: "admin@bifido.com",
      name:  "관리자",
      password: "admin1234!",
      phone: '000-0000-0000',
      mobile: '000-0000-0000'
    }
  },
  {
    vId: 2, vRef: [{modelName: "Role", propName: "role", vRefValue: 1}],
    document: {
      identifier: "developer@applicat.co.kr",
      name: "개발자",
      password: "dev1234!",
      phone: '000-0000-0000',
      mobile: '000-0000-0000'
    }
  }
];