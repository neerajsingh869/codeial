const express = require('express');
const router = express.Router();
const passport = require('passport');
const likesController = require('../controllers/likes-controller');

router.post('/toggle', passport.checkAuthentication, likesController.toggleLike);

module.exports = router;