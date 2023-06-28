require('dotenv').config();
const sendGrid = require('@sendgrid/mail');

const { SENDGRID_REST_API_KEY } = process.env; // ключ на sendgrid

// Універсальна ф-я відправи email:
// Варіант від Гендзелюк
async function sendEmail(data) {
  try {
    sendGrid.setApiKey(SENDGRID_REST_API_KEY);
    const email = {
      // ...data,
      from: 'akwebua.study@gmail.com', // тут мусить бути email, про який знає sendgrid
      to: 'someemail@gmail.com',
      subject: 'send email test A', // заголовок
      html: 'Hi <b> there </b>', // тут можна відправляти html. Сучасний синтаксис деякі поштові клієнти можуть не розуміти
      text: 'Test send simple text',
    };

    await sendGrid.send(email);
    console.log('email sent');
  } catch (error) {
    console.error('sending email failed:', error.massage);
  }
}

module.exports = sendEmail;
