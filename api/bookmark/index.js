const express = require('express');
const bookmarkController = require('./bookmarkController');

const router = express.Router();

router.post('/', bookmarkController.addBookmark);

module.exports = router;