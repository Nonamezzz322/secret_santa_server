const Uuid = require('uuid');
const fs = require('fs');
const User = require('../models/User');
const env = require('../env');

class AvatarController {
  async uploadAvatar(req, res) {
    try {
      const { file } = req.files;
      const user = await User.findById(req.user.id);
      const { avatarOriginalImage, avatarCroppedImage } = user;
      if (avatarOriginalImage !== null) {
        fs.unlinkSync(`${env.app.staticPath}\\${avatarOriginalImage}`);
        fs.unlinkSync(`${env.app.staticPath}\\${avatarCroppedImage}`);
      }

      const originalImageName = `${Uuid.v4()}.jpg`;
      const croppedImageName = `${Uuid.v4()}.jpg`;
      file.mv(`${env.app.staticPath}\\${originalImageName}`);
      file.mv(`${env.app.staticPath}\\${croppedImageName}`);
      user.avatarOriginalImage = originalImageName;
      user.avatarCroppedImage = croppedImageName;

      await user.save();
      return res.json(user);
    }
    catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Upload avatar error' });
    }
  }

  async croppAvatar(req, res) {
    try {
      const { file } = req.files;
      const user = await User.findById(req.user.id);
      const { avatarCroppedImage } = user;
      if (avatarCroppedImage !== null) {
        fs.unlinkSync(`${env.app.staticPath}\\${avatarCroppedImage}`);
      }

      const croppedImageName = `${Uuid.v4()}.jpg`;
      file.mv(`${env.app.staticPath}\\${croppedImageName}`);
      user.avatarCroppedImage = croppedImageName;
      await user.save();
      return res.json(user);
    }
    catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Upload avatar error' });
    }
  }

  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const { avatarOriginalImage, avatarCroppedImage } = user;
      if (avatarOriginalImage !== null) {
        fs.unlinkSync(`${env.app.staticPath}\\${avatarOriginalImage}`);
        fs.unlinkSync(`${env.app.staticPath}\\${avatarCroppedImage}`);
        user.avatarCroppedImage = null;
        user.avatarOriginalImage = null;
        await user.save();
      }
      return res.json(user);
    }
    catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Deleting avatar error' });
    }
  }
}

module.exports = new AvatarController();
