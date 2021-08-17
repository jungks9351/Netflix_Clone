const Joi = require('joi');
const { schema } = require('../../models/user');
const User = require('../../models/user');

exports.test = async (req, res) => {
  res.status(200).send('connected server');
};

// 회원가입 요청 => POST
// /api/user/register
// {
//   userId: "",
//   password: "",
//   passwordConfirm: "",
//   nickname: ""
// }
exports.register = async (req, res) => {

  const { userId, password, passwordConfirm, nickname } = req.body;

  const idSchema = Joi.string()
    .pattern(/^[A-Za-z0-9]{4,10}$/)
    .min(4)
    .max(10)
    .required();

  const pwSchema = Joi.string()
    .pattern(
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/
    )
    .min(8)
    .required();

  const pwConfirmSchema = Joi.object().keys({
    password: Joi.string()
      .pattern(
        /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/
      )
      .min(8)
      .required(),
    passwordConfirm: Joi.ref('password'),
  });

  const nicknameSchema = Joi.string()
    .pattern(/^.{2,10}$/)
    .min(2)
    .max(10)
    .required();

  const idResult = idSchema.validate(userId);
  const pwResult = pwSchema.validate(password);
  const pwConfirmResult = pwConfirmSchema.validate({ password, passwordConfirm });
  const nicknameResult = nicknameSchema.validate(nickname);
  
  const exists = await User.findUserId(userId);

  if (exists) {
    res.status(409).send({
      position: 'userId',
      message: '중복된 아이디입니다.'}); // 아이디 중복
    return;
  }
  
  if (idResult.error) {
    res.status(400).send({
      position: 'userId',
      message: '잘못된 아이디입니다.'});
    return;
  }

  if (pwResult.error) {
    res.status(400).send({
      position: 'password',
      message: '잘못된 비밀번호입니다.'});
    return;
  }

  if (pwConfirmResult.error) {
    res.status(400).send({
      position: 'passwordConfirm',
      message: '비밀번호가 일치하지 않습니다.'});
    return;
  }

  if (nicknameResult.error) {
    res.status(400).send({
      position: 'nickName',
      message: '잘못된 닉네임입니다.'});
    return;
  }


  try {

    const user = new User({
      userId,
      nickname,
    });

    await user.setPassword(password);
    await user.save();

    res.status(200).json(user.serialize());
  } catch (e) {
    res.status(500).send(e);
  }
};