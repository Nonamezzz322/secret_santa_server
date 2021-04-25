/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
const Box = require('../models/Box');
const User = require('../models/User');

class BoxController {
  async createBox(req, res) {
    try {
      const { id } = req.user;
      const {
        allowedPreferences, limit, link, name, currency, creatorIn
      } = req.body;

      const user = await User.findById(id);
      let users = [];
      if (creatorIn) {
        users = [{
          user: id,
          nameInBox: user.name
        }];
      }

      const candidate = await Box.findOne({ link });
      if (candidate) {
        return res.status(400).json({ message: `Коробка по данной ссылке ${link} уже существует` });
      }
      const box = new Box({
        name,
        link,
        creator: id,
        currency,
        limit,
        allowedPreferences,
        users
      });
      await box.save();
      return res.json({ message: 'Коробка успешно создана' });
    }
    catch (e) {
      return res.status(500).json({ message: 'Произошла непредвиденная хуйня' });
    }
  }

  async getBox(req, res) {
    try {
      const { link } = req.params;
      const { id } = req.user;
      const box = await Box.findOne({ link });
      if (!box) {
        return res.status(404).json({ message: 'Коробки не существует' });
      }
      const inUsers = box.users.find((elem) => elem.user.toString() === id.toString());
      const isCreator = box.creator.toString() === id.toString();
      if (!inUsers && !isCreator) {
        return res.status(400).json({ message: 'Доступ к этой коробке запрещен, т.к. вы не являетесь её участником' });
      }
      const creator = await User.findById(box.creator);
      const result = {
        creatorName: creator.name,
        ...box._doc
      };
      return await res.json(result);
    }
    catch (e) {
      return res.status(500).json({ message: 'произошла какая-то хуйня' });
    }
  }

  async getBoxes(req, res) {
    try {
      const { id } = req.user;
      const boxes = await Box.find({ $or: [{ 'users.user': id }, { creator: id }] });
      if (!boxes) {
        return res.status(404).json({ message: 'Коробок доступных вам не существует' });
      }
      const result = boxes.map((el) => {
        const {
          creator, users, link, name
        } = el;
        const roles = [];
        if (id.toString() === creator.toString()) {
          roles.push('организатор');
        }
        if (users.find((elem) => elem.user.toString() === id.toString())) {
          roles.push('участник');
        }
        return ({
          name,
          link,
          usersQuantity: users.length,
          roles
        });
      });
      return res.json(result);
    }
    catch (e) {
      console.log(e);
      return res.status(500).json({ message: e });
    }
  }

  async addUser(req, res) {
    try {
      const { link } = req.params;
      const { id } = req.user;
      const box = await Box.findOne({ link });
      const alreadiInBox = box.users.find((elem) => elem.user.toString() === id.toString());
      if (alreadiInBox) {
        return res.status(400).json({ message: 'Пользователь уже в коробке' });
      }
      const user = await User.findById(id);
      await Box.updateOne({ link }, { $push: { users: { user: id, nameInBox: user.name } } });
      return res.json({ message: 'Пользователь был добавлен' });
    }
    catch (e) {
      return res.status(500).json({ message: e });
    }
  }

  async setPairs(req, res) {
    try {
      const { users } = req.body;
      const { link } = req.params;
      await Box.updateOne({ link }, { users, isDraw: true });
      return res.json(users);
    }
    catch (e) {
      return res.status(500).json({ message: e });
    }
  }

  async deleteUser(req, res) {
    try {
      const { link } = req.params;
      const { id } = req.user;

      const box = await Box.findOne({ link });
      const user = await User.findById(id);
      const alreadiInBox = box.users.find((elem) => elem.user.toString() === id.toString());
      if (!box) {
        return res.status(404).json({ message: 'Коробки не существует' });
      }
      if (!alreadiInBox) {
        return res.status(400).json({ message: 'Пользователь уже был удален' });
      }
      await Box.updateOne({ link }, { $pull: { users: { user: id } } });
      return res.json({ message: `Пользователь ${user.name} был изгнан из коробки` });
    }
    catch (e) {
      return res.status(500).json({ message: e });
    }
  }

  async deleteBox(req, res) {
    try {
      const { link } = req.params;
      const { id } = req.user;
      const box = await Box.findOne({ link });
      if (box.creator.toString() !== id) {
        return res.status(400).json({ message: 'Только создатель может удалить коробку' });
      }
      await Box.deleteOne({ link });
      return res.json({ message: 'Успешно удалено' });
    }
    catch (e) {
      return res.status(500).json({ message: e });
    }
  }

  async updateBoxUser(req, res) {
    try {
      const { link } = req.params;
      const { id } = req.user;
      const { data } = req.body;
      await Box.updateOne(
        { link, users: { $elemMatch: { user: id } } },
        {
          $set:
          {
            'users.$.nameInBox': data.nameInBox,
            'users.$.preferences': data.preferences
          }
        }
      );
      return res.json({ message: 'Личные данные успешно обновлены' });
    }
    catch (e) {
      return res.status(500).json({ message: e });
    }
  }

  async updateBoxSettings(req, res) {
    try {
      const { link } = req.params;
      const { id } = req.user;
      const { data } = req.body;
      const box = await Box.findOne({ link });
      const isCreator = box.creator.toString() === id.toString();
      if (isCreator) {
        await Box.updateOne({ link }, { $set: { ...data } });
      }
      return res.json({ message: 'Настройки успешно обновлены' });
    }
    catch (e) {
      return res.status(500).json({ message: e });
    }
  }
}

module.exports = new BoxController();
