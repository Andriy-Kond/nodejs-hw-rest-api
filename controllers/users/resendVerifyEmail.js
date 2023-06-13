const { HttpError, sendEmail } = require('../../helpers');
const { User } = require('../../models/user');

const resendVerifyEmail = async (req, res) => {
  const { BASE_URL } = process.env;
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(
      401,
      'User with this email not found in our base. Please check your email.'
    );
  }

  // Якщо юзер вже перевірився:
  if (user.verify) {
    res.status(400).json({ message: 'Verification has already been passed' });
  }

  // Якщо ж такий email є і він не веріфікований, то робимо і відправляємо новий email

  const verifyEmail = {
    to: email,
    subject: 'Verify your email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click here to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res
    .status(201)
    .json({ message: 'Email was send again. Please check your email' });
};

module.exports = resendVerifyEmail;
