const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

// 문서
const UserSchema = new Schema({
  userId: String,
  hashedPassword: String,
  nickname: String,
  bookmarks: [String],
});

// this는 문서 인스턴스를 가리킨다
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true or false
};

// hasehdPassword 필드를 지우는 인스턴스 메서드
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

// 스태틱 메서드의 this는 모델을 가리킨다 -> User
UserSchema.statics.findUserId = function (userId) {
  return this.findOne({ userId });
};

// 모델
const User = mongoose.model('User', UserSchema);

module.exports = User;