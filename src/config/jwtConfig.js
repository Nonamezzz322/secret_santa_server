const env = require('../env');

const { secret } = env.app;
const expiresIn = '24h';

module.exports = { secret, expiresIn };
