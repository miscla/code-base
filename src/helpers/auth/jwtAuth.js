const jwt = require('jsonwebtoken');

const config = require('../config/config');
const { CODE } = require('../lib/httpCode');
const response = require('../utils/response');
const User = require('../../api/controller/users/models/User');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.get('/secretKey'), async (err, user) => {
      if (err) {
        return response.error(res, 'Invalid token!', CODE.FORBIDDEN);
      }

      const dataUser = await User.findOne({
        email: user.email
      });
      user = {
        ...user,
        dataUser
      };
      req.user = user;
      next();
    });
  } else {
    return response.error(res, 'Token has expired!', CODE.UNAUTHORIZED);
  }
};

module.exports = {
  authenticateJWT
};
