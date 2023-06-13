const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_REST_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_REST_API_KEY);

async function sendEmail(data) {
  const email = {
    ...data,
    from: 'akwebua.study@gmail.com',
  };
  await sgMail.send(email);
  return true;
}

module.exports = sendEmail;
