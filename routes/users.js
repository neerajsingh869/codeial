const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportLocal = require('../config/passport-local-strategy');
const passportGoogle = require('../config/passport-google-oauth-strategy');
const usersController = require('../controllers/users-controller');
const postsContoller = require('../controllers/posts-controller');
const verifyAccessTokenMiddleware = require('../middlewares/reset-password-middleware');

console.log('users router loaded successfully');

// router for rendering signup page
router.get('/signup', passport.checkNotAuthentication, usersController.signup);

// router for rendering signin page
router.get('/signin', passport.checkNotAuthentication, usersController.signin);

// router for user signup
router.post('/create', usersController.create);

// router for user signin
router.post('/start-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/signin' }
), usersController.startSession);

// router for user signout
router.get('/end-session', passport.checkAuthentication, usersController.endSession);

// router for user's profile page give user-id
router.get('/profile/:userId', passport.checkAuthentication, usersController.profile);

// router to update user's profile
router.post('/update-profile/:userId', passport.checkAuthentication, usersController.updateProfile);

// router for user signin through google auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router to handle google's redirect after successfull authentication
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/signin' }), usersController.startSession);

// route to reset user's password
router.get('/reset-password', verifyAccessTokenMiddleware.verifyAccessToken, usersController.resetPassword);

// router to handle reset password logic
router.post('/reset-password', verifyAccessTokenMiddleware.verifyAccessToken, usersController.updatePassword);

// route to render forgot password page
router.get('/forgot-password', usersController.forgotPassword);

// router to handle forgot password logic
router.post('/forgot-password', usersController.startResetPasswordProcess)

// router to handle logic to add user as friend
router.get('/add-friend/:friendId', passport.checkAuthentication, usersController.addFriend);

// router to handle logic for removing friend from friend list
router.get('/remove-friend/:friendId', passport.checkAuthentication, usersController.removeFriend);

module.exports = router;