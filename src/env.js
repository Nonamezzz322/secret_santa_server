const dotenv = require('dotenv');

dotenv.config();

const env = {
  app: {
    port: process.env.APP_PORT,
    staticPath: process.env.STATIC_PATH,
    secret: process.env.SECRET_KEY
  },
  db: {
    dbUrl: process.env.DB_URL
  }
};

module.exports = env;
