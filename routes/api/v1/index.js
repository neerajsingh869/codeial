const express = require('express');
const router = express.Router();
const postsApiV1Router = require('./posts');
const usersApiV1Router = require('./users');

router.use('/posts', postsApiV1Router);
router.use('/users', usersApiV1Router);

module.exports = router;