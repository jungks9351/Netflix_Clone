const express = require('express');
const userController = require('./userController');

const router = express.Router();

router.post('/', userController.register);

module.exports = router;