const User = require('../models/User');

const logger = require('../../../../helpers/lib/logger');
const response = require('../../../../helpers/utils/response');

const { CODE } = require('../../../../helpers/lib/httpCode');

/**
 * @class
 * UserQuery
 * 
 * @function getUsers - A function to get all users.
 * 
 * @function getUserById - A function to get a user.
 * @param {string} req.params.userId - UserId
 */

class UserQuery {
  static async getUsers(req, res) {
    const cx = 'users-getUsers';

    const users = await User.find({});
    if (!users) {
      logger.error(cx, 'Failed to fetch users');
      return response.error(res, 'Failed to fetch users', CODE.INTERNAL_ERROR);
    }

    return response.data(res, 'Users successfully fetched', users);
  }
}

module.exports = UserQuery;
