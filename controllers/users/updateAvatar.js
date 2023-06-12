const path = require('path');
const fs = require('fs/promises');

const avatarDir = path.join(__dirname, '../', '../', 'public', 'avatars');
const Jimp = require('jimp');

const { User } = require('../../models/user');

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarDir, filename);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join('avatars', filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  Jimp.read(`${avatarDir}/${filename}`, (err, fileAvatar) => {
    if (err) throw err;
    fileAvatar.cover(250, 250).quality(60).write(`${avatarDir}/${filename}`);
  });

  res.json({ avatarURL });
};

module.exports = updateAvatar;
