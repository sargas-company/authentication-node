const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PASS, EMAIL_PORT, EMAIL_USER } = require('../config/constants');

/**
 * @desc   This function sends email to users
 * @param {String} to email address of recipient users
 * @param {String} subject subject of email
 * @param {String} message html or text type content of email
 * @return {Boolean} - Returns true if email is sent successfully, otherwise false
 */
const transferMail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });
    
    // Setup email data
    const mailOptions = {
      from: 'Support name <no-reply@example.com>',
      to: to,
      subject: subject,
      html: message
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    return true;
  } catch (err) {
    console.log('Error sending email', err);
    return false;
  }
};

module.exports = {
  transferMail,
};
