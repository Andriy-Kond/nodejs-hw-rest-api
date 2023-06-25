const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_REST_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_REST_API_KEY);

// Універсальна ф-я відправи email:
async function sendEmail(data) {
  const email = {
    ...data,
    from: 'akwebua.study@gmail.com',
  };
  await sgMail.send(email);
  return true; // Якщо все добре. А якщо ні - ф-я викидає помилку, з якою далі розбираємось
}

module.exports = sendEmail;
