const mailgun = require('mailgun-js');
const { EMAIL_DOMAIN, EMAIL_API_KEY } = require('../config/constants');
/**
 * @desc   This function sends email to users
 * @param {String} to email address of recipient users
 * @param {String} subject subject of email
 * @param {String} message html or text type content of email
 * @return
 */
const transferMail = async (to, subject, message) => {
  try {
    const mg = mailgun({ apiKey: EMAIL_API_KEY, domain: EMAIL_DOMAIN });
    const data = {
      from: 'Support name <no-reply@' + EMAIL_DOMAIN + '>',
      to: to,
      subject: subject,
      html: message,
    };

    mg.messages().send(data, function (error, body) {
      if (error) {
        console.log('Mailgun service error', error);
        return false;
      } else {
        console.log('body', body);
      }
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  transferMail,
};
