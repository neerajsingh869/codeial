const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const env = require('../config/environment');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret   // key to decrypt the jwt (= encrypt secret)
}

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        let user = await User.findById(jwtPayload._id).exec();

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    } catch (error) {
        console.error(error.stack);

        return done(error, false);
    }
}));

module.exports = passport;
