const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

// 문서
const UserSchema = new Schema({
  userId: String,
  hashedPassword: String,
  nickname: String,
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

// 토큰 생성 인스턴스 메서드
UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // 첫번째 파라미터는 토큰에 넣고 싶은 데이터를 넣는다
    {
      _id: this.id,
      userId: this.userId,
    },
    process.env.JWT_SECRET, // 두번째 파라미터에는 JWT 암호를 넣는다,
    {
      expiresIn: '7d', // 유효기간
    }
  );
  return token;
};

// 스태틱 메서드의 this는 모델을 가리킨다 -> User
UserSchema.statics.findUserId = function (userId) {
  return this.findOne({ userId });
};

// 모델
const User = mongoose.model('User', UserSchema);

module.exports = User;
