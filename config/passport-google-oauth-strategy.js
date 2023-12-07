const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('../config/environment');

const opts = {
    // don't push this code on github
    clientID: env.google_clientID,    // TODO put actual value during testing
    clientSecret: env.google_clientSecret,    // TODO put actual value during testing
    callbackURL: env.google_callbackURL
}

// use passport strategy for google login
passport.use(new GoogleStrategy(opts, async (accessToken, refreshToken, profile, done) => {
    try {
        // find user in database
        let user = await User.findOne({email: profile.emails[0].value}).exec();

        if (user) {
            // if user exits, then set it in req.user
            return done(null, user);
        } else {
            // if user doesn't exist, then create one and set
            // it in req.user
            let newUser = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });

            let savedUser = await newUser.save();

            return done(null, savedUser);
        }
    } catch (error) {
        console.error(error.stack);

        done(error, false);
    }
}))