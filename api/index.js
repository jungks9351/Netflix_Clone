const express = require('express');
const user = require('./user');
const bookmark = require('./bookmark');

const router = express.Router();


router.use('/user', user);
router.use('/bookmark', bookmark);

module.exports = router;