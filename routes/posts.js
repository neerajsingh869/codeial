const express = require('express');
const passport = require('passport');
const router = express.Router();
const postsContoller = require('../controllers/posts-controller');

// router to post user's post
router.post('/save-post', passport.checkAuthentication, postsContoller.savePost);

// router to delete user's post
router.get('/destroy/:postId', passport.checkAuthentication, postsContoller.deletePost);

module.exports = router;