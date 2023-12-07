const express = require('express');
const passport = require('passport');
const router = express.Router();
const commentsContoller = require('../controllers/comments-controller');

// router to save user's comment on a specific post
router.post('/save-comment/:postId', passport.checkAuthentication, commentsContoller.saveComment);

// router to delete user's comment
router.get('/destroy/:commentId', passport.checkAuthentication, commentsContoller.deleteComment);

module.exports = router;