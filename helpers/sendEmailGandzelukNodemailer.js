const nodemailer = require('nodemailer');

async function sendEmail() {
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '5b45de9d97b930',
      pass: '********1d64',
    },
  });

  const email = {
    from: 'akwebua.study@gmail.com',
    to: 'someemail@gmail.com',
    subject: 'send email test A',
    html: 'Hi <b> there </b>',
    text: 'Test send simple text',
  };

  const response = await transport.sendMail(email);
  console.log('sendEmail >> response:', response);
}
sendEmail();

module.exports = sendEmail;
