"use strict";

module.exports = function (data) {

  let req = this.req;
  let res = this.res;

  res.status(406);

  return res.send(data || {
      name: 'NotAllowd',
      message: 'It is not allwoed request'
    });
};