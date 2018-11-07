module.exports = [
  //ADMIN
  {
    vId: 1, vRef: [{modelName: "Role", propName: "role", vRefValue: 1}],
    document: {
      identifier: 'admin@applicat.co.kr',
      password: 'admin1234'
    },
  },

  //USER
  {
    vId: 2, vRef: [{modelName: "Role", propName: "role", vRefValue: 2}],
    document: {
      identifier: 'user@applicat.co.kr',
      password: 'user1234'
    },
  }
];