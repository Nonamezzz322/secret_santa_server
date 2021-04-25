const { Schema, ObjectId, model } = require('mongoose');

const Box = new Schema({
  name: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  creator: { type: ObjectId, ref: 'User', required: true },
  limit: { type: Number, default: 0 },
  currency: { type: String, default: 'RUB' },
  allowedPreferences: { type: Boolean, default: false },
  users: [{
    user: { type: ObjectId, ref: 'User', required: true },
    nameInBox: { type: String, required: true },
    preferences: { type: String, default: null },
    recepient: { type: ObjectId, ref: 'User', default: null },
    colours: { type: String }
  }],
  isDraw: { type: Boolean, default: false }
});

module.exports = model('Box', Box);
