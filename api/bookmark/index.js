const express = require('express');
const bookmarkController = require('./bookmarkController');

const router = express.Router();

router.post('/', bookmarkController.addBookmark);
router.delete('/', bookmarkController.removeBookmark);
router.get('/list', bookmarkController.getBookmarkList);

module.exports = router;
