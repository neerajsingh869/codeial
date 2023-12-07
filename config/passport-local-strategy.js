const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// authenticate incoming requests using passport local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        let user = await User.findOne({ email }).exec();

        if (!user || user.password !== password) {
            req.flash('error', 'Invalid email or password');
            return done(null, false);
        }

        done(null, user);   
    } catch (error) {
        req.flash('error', 'Error in finding user');
        done(error);
    }
}));

// serializeUser persist store id into session
// (created by express-session middleware)
// after successful authentication i.e after 
// getting success from passport strategy
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// deserializeUser used to retrieve user data from 
// the session. All the endpoints hitting the server
// passes through this method, so you can easily
// find whether the user is authenticated or not
passport.deserializeUser(async (id, done) => {
    try {
        let user = await User.findById(id).exec();
        done(null, user);   
    } catch (error) {
        req.flash('error', 'Error in finding user');
        done(error);
    }
})

// middleware method to check if user is authenticated or not
passport.checkAuthentication = (req, res, next) => {
    if ( req.isAuthenticated() ) {
        return next();
    }
    req.flash('error', 'Forbidden');
    res.redirect('/users/signin');
}

// middleware method to check if user is not authenticate
passport.checkNotAuthentication = (req, res, next) => {
    if ( !req.isAuthenticated() ) {
        return next();
    }
    req.flash('error', 'Forbidden');
    res.redirect('/');
}

// middleware method to store user info from session cookie
// to locals so that it can be used to render ejs page
passport.setAuthenticatedUser = (req, res, next) => {
    if ( req.isAuthenticated() ) {
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;