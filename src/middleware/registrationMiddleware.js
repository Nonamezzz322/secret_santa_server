const passport = require('passport');

module.exports = passport.authenticate('registration', { session: false });
