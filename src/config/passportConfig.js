const JWT = require('passport-jwt');
const local = require('passport-local');
const passport = require('passport');

const { secret } = require('./jwtConfig');
const { compare } = require('../helpers/cryptoHelper');
const User = require('../models/User');

const options = {
  jwtFromRequest: JWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

passport.use(
  'registration',
  new local.Strategy(
    { usernameField: 'name', passReqToCallback: true },
    async ({ body: { email } }, name, password, done) => {
      try {
        const userByEmail = await User.findOne({ email });
        if (userByEmail) {
          return done({ status: 401, message: 'Email is already taken.' }, null);
        }

        return done(null, { email, name, password });
      }
      catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  'login',
  new local.Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done({ status: 401, message: 'Incorrect email.' }, false);
      }

      return await compare(password, user.password)
        ? done(null, user)
        : done({ status: 401, message: 'Passwords do not match.' }, null, false);
    }
    catch (err) {
      return done(err);
    }
  })
);

passport.use(new JWT.Strategy(options, async ({ id }, done) => {
  try {
    const user = await User.findById(id);
    return user ? done(null, user) : done({ status: 401, message: 'Token is invalid.' }, null);
  }
  catch (err) {
    return done(err);
  }
}));
