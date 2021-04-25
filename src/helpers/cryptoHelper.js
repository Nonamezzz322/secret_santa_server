const bcrypt = require('bcryptjs');

const saltRounds = 10;

const encrypt = (data) => bcrypt.hash(data, saltRounds);

const encryptSync = (data) => bcrypt.hashSync(data, saltRounds);

const compare = (data, encrypted) => bcrypt.compare(data, encrypted);

module.exports = { encrypt, encryptSync, compare };
