const express = require('express');
const userController = require('./userController');

const router = express.Router();

router.get('/', userController.test);
router.post('/register', userController.register);

module.exports = router;