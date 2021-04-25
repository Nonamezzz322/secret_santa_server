const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwtConfig');

const createToken = (data) => jwt.sign(data, secret, { expiresIn });

module.exports = createToken;
