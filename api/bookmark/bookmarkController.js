const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Bookmarks = require('../../models/bookmarks');
const mongoose = require('mongoose');

// bookmark 추가 요청 => POST
// /api/bookmark?id=
// headers: {
//  Authorization: token
// }
// {
//   poster: 'url'
// }
exports.addBookmark = async (req, res) => {
  // poster, token은 필수
  const schema = Joi.object().keys({
    poster: Joi.string().required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error);
    return;
  }

  const { poster } = req.body;
  const { authorization: token } = req.headers;
  const { id: movieId } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { userId } = decoded;

    // 이미 북마크를 한 유저라면 기존 문서에 bookmark 추가
    const bookmarks = await Bookmarks.findOneAndUpdate(
      { userId },
      { $addToSet: { bookmarks: { movieId, poster } } },
      { upsert: true, new: true } // 문서가 생성되지 않은 유저라면 새 북마크 문서를 생성
    ).exec();

    // 북마크 추가 반영된 데이터를 응답
    res.status(200).json(bookmarks);
  } catch (e) {
    res.status(500).send(e);
  }
};

// bookmark 삭제 요청 => DELETE
// /api/bookmark?id=
// headers: {
//  Authorization: token
// }
exports.removeBookmark = async (req, res) => {
  const { authorization: token } = req.headers;
  const { id: movieId } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;

    const bookmarks = await Bookmarks.findOneAndUpdate(
      { userId },
      { $pull: { bookmarks: { movieId } } },
      { new: true }
    ).exec();

    // 북마크 삭제 반영된 데이터를 응답
    res.status(200).json(bookmarks);
  } catch (e) {
    res.status(500).send(e);
  }
};

// bookmark 리스트 요청 => GET
// /api/bookmark/list
// headers: {
//  Authorization: token
// }
exports.getBookmarkList = async (req, res) => {
  const { authorization: token } = req.headers;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;

    const { bookmarks } = await Bookmarks.findOne({ userId }).exec();
    res.status(200).json(bookmarks);
  } catch (e) {
    res.status(500).send(e);
  }
};
