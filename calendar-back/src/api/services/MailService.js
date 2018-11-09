/**
 * Created by andy on 26/05/15
 * As part of Bifido
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 26/05/15
 *
 */

let EXPIRY = 60, sg, path, mails = {};

let logger = Bifido.logger('MailService');

module.exports = {
  init: init,
  sendEmail: sendEmail
};

function init() {
  sg = require('sendgrid')(Bifido.config.connections.email);
  path = __dirname + "/../../config/mail_template/";
}

function sendEmail(template, lang, data, from, tos, attachments) {

  let helper = require('sendgrid').mail;
  let mail = new helper.Mail();
  mail.setFrom(new helper.Email(from.email, from.name));
  let personalization = new helper.Personalization();

  _.forEach(tos, function (to) {
    personalization.addTo(new helper.Email(to));
  });

  mail.addPersonalization(personalization);

  return compile(template, lang)
    .then((res) => {
      let subject = res.subject(data);
      let text = res.content(data);
      let html = res.html(data);

      mail.setSubject(subject);
      mail.addContent(new helper.Content("text/plain", text));
      mail.addContent(new helper.Content("text/html", html));


      let body = mail.toJSON();

      if (attachments && Array.isArray(attachments) && attachments.length > 0)
        body.attachments = _.compact(_.map(attachments, function (attachment) {

          if (attachment) {
            let content = new Buffer(FileSystem.readFileSync(attachment.path).toString('base64'));
            return {
              filename: attachment.filename,
              content: content.toString(),
              type: attachment.type
            }
          }
          return null;
        }));

      let request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: body
      });

      return new Promise((resolve, reejct) => {
        sg.API(request, function (error, response) {
          if (error) return reejct(error);
          else resolve();
        });
      });
    });
}

/**
 * Private method
 *
 * compiling mail template
 *
 * @param type
 * @param lang
 * @param config
 * @returns {Promise|Promise<T>}
 */

function compile(type, lang) {

  return new Promise((resolve, reject) => {
    // build our list from most specific to least-specific
    let now = new Date().getTime();
    let found = false;
    let list = _.reduce((lang || "").split('_'), function (result, item) {
      result.push(result.length === 0 ? item : [].concat(result[result.length - 1], item).join("_"));
      return (result);
    }, []).reverse();

    list.push("");

    // need to get the mail from filesystem if not cached already
    // however, we must be careful of the fallback
    // e.g. we once sent an email with no matching lang, e.g. he_IL, so the default (item="") was found and cached
    // now we look for a different lang, e.g. fr_FR. Since we never looked for it, we will not have it in the cache,
    //   but we *will* have the default (item=""), which would cause us not to look for fr_FR on the filesystem
    // so it is important that we check not only "is it in the cache", but "did we ever look for it"
    // our logic is:
    // 1- go from most-specific (fr_FR) to less specific (fr) to default ("")
    // 2- with each one, if it is cached use it
    // 3- if it is not cached but also was not found on the filesystem, go to the next
    // essentially, we need a system to track which ones we searched for and when
    mails[type] = mails[type] || {};
    // look for each type in reverse order
    _.each(list, function (item) {
      // first, if it is not found at all, then we never searched for it, so go back
      if (!mails[type][item]) {
        found = false;
      } else if (!mails[type][item].notfound && mails[type][item].expired > now) {
        // so we searched for it. if it was found and is not expired, used it
        found = mails[type][item];
      }
      // else either it is expired, or it was notfound, so keep looking for the next less-specific down the line
    });
    // did we find an answer?
    if (found) return resolve(found);

    Promise.promisify(FileSystem.readdir)(path)
      .then((files) => {

        let actuals = [];

        _.each(list, function (item) {
          let fileName = type + (item ? '_' + item : ''), txtName = fileName + '.txt';
          if (_.includes(files, fileName)) return actuals.push({name: item, path: path + '/' + fileName});
          if (_.includes(files, txtName)) return actuals.push({name: item, path: path + '/' + txtName});
        });


        let compilePromises = [];

        _.forEach(actuals, (item) => {
          let task = Promise.promisify(FileSystem.readFile)(item.path, 'utf8')
            .then((data) => {
              if (data) {
                data = data.match(/^([^\n]*)\n[^\n]*\n((.|\n|\r)*)(html:)((.|\n|\r)*)/m);
                mails[type][item.name] = {
                  subject: _.template(data[1]),
                  content: _.template(data[2]),
                  html: _.template(data[5]),
                  expired: now + EXPIRY * 60 * 1000
                };
              } else {
                mails[type][item.name] = {
                  notfound: true,
                  expired: now + EXPIRY * 60 * 1000
                };
              }
            });

          compilePromises.push(task)

        });

        // actuals now contains the actual file names we have
        return Promise.all(compilePromises)

      })
      .spread(() => {
        _.each(list, function (item) {
          if (mails[type][item] && mails[type][item].expired > now) {
            found = mails[type][item];
          }
        });
        // did we find an answer?
        resolve(found);
      })
      .catch(err => {
        logger.log('error', err);
        return reject("missingmailfiles")
      });
  });

}