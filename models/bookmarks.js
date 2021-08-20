const mongoose = require('mongoose');

const { Schema } = mongoose;

// 문서
const BookmarkSchema = new Schema({
  userId: String,
  bookmarks: [Object],
});

// 모델
const Bookmarks = mongoose.model('Bookmarks', BookmarkSchema);
// 스태틱 메서드의 this는 모델을 가리킨다 -> User

module.exports = Bookmarks;
