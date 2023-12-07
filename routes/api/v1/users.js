const express = require('express');
const router = express.Router();
const usersApiV1Controller = require('../../../controllers/api/vi/users-api');

router.post('/', usersApiV1Controller.createSession);

module.exports = router;