const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const postsApiV1Controller = require('../../../controllers/api/vi/posts-api');

router.get('/', postsApiV1Controller.index);
router.delete('/:postId', passport.authenticate('jwt', { session: false }), postsApiV1Controller.destroy);

module.exports = router;