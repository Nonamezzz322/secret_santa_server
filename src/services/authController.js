/* eslint-disable no-underscore-dangle */
const createToken = require('../helpers/tokenHelper');
const { encrypt } = require('../helpers/cryptoHelper');
const User = require('../models/User');

class AuthController {
  async login({ id }) {
    const user = await User.findById(id);
    const {
      email, name, avatarOriginalImage, avatarCroppedImage
    } = user;
    return {
      token: createToken({ id }),
      user: {
        id, email, name, avatarOriginalImage, avatarCroppedImage
      }
    };
  }

  async registration(userData) {
    const { name, email, password } = userData;
    const user = new User({
      name,
      email,
      password: await encrypt(password)
    });
    await user.save();
    const result = await User.findOne({ email });
    return this.login({ id: result._id });
  }

  async auth(data) {
    const { user } = data;
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarOriginalImage: user.avatarOriginalImage,
        avatarCroppedImage: user.avatarCroppedImage
      }
    };
  }
}

module.exports = new AuthController();
