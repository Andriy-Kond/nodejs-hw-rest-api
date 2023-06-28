require('dotenv').config();
const sendGridMail = require('@sendgrid/mail');

const { SENDGRID_REST_API_KEY } = process.env; // ключ на sendgrid

sendGridMail.setApiKey(SENDGRID_REST_API_KEY);

// Універсальна ф-я відправи email:
async function sendEmail(data) {
  const email = {
    ...data,
    from: 'akwebua.study@gmail.com',
  };
  await sendGridMail.send(email);
  return true; // Якщо все добре. А якщо ні - ф-я викидає помилку, з якою далі розбираємось
}

module.exports = sendEmail;
