const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home-controller');
const usersRouter = require('./users');
const postsRouter = require('./posts');
const commentsRouter = require('./comments');
const likesRouter = require('./likes');
const apiRouter = require('./api/index');

router.get('/', homeController.home);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
router.use('/likes', likesRouter);

router.use('/api', apiRouter);

module.exports = router;