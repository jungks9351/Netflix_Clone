
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Bookmarks = require('../../models/bookmarks');

// bookmark 추가 요청 => POST
// /api/bookmark?id=
// {
//   poster: 'url'
// }
exports.addBookmark = async (req, res) => {
  
  const schema = Joi.object().keys({
    poster: Joi.string().required(),
    token: Joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }
  try {
    const {poster, token} = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const {userId} = decoded;

    const user = await Bookmarks.findUserId(userId);
    if (!user) {
      const bookmarks = new Bookmarks({
        userId,
        bookmarks
      });
      await bookmarks.save();
    }
    
    res.status(200).send();
  } catch (error) {
    
  }
};


