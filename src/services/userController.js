const bcrypt = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const User = require('../models/User');

class UserController {
  async changePassword(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const errors = validationResult(check('password', 'Пароль должен быть длиннее 4 символов').isLength({ min: 8, max: 99 }));
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Некорректный запрос', errors });
      }
      const hashPassword = await bcrypt.hash(req.body.password, 5);
      user.password = hashPassword;
      await user.save();
      return res.json(user.password);
    }
    catch (e) {
      console.log(e);
      return res.status(400).json({ message: `error: ${e}` });
    }
  }

  async changeName(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const errors = validationResult(check('name', 'Укажите имя').isLength({ min: 1, max: 99 }));
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Некорректный запрос', errors });
      }
      user.name = req.body.name;
      await user.save();
      return res.json(user.name);
    }
    catch (e) {
      console.log(e);
      return res.status(400).json({ message: `error: ${e}` });
    }
  }
}

module.exports = new UserController();
