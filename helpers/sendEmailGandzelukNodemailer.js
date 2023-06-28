require('dotenv').config();
const nodemailer = require('nodemailer');

const { EMAIL_USER, EMAIL_PASS } = process.env;

async function sendEmail({ to, subject, html }) {
  // const email = {
  //   from: 'akwebua.study@gmail.com',
  //   to: 'someemail@gmail.com',
  //   subject: 'send email test A',
  //   html: 'Hi <b> there </b>',
  //   text: 'Test send simple text',
  // };

  const email = {
    from: 'info@mymovies.com',
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const response = await transport.sendMail(email);
  console.log('sendEmail >> response:', response);
}
sendEmail();

module.exports = { sendEmail };
