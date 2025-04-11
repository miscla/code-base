const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const response = require('./response');
const logger = require('../lib/logger');
const config = require('../config/config');

const { CODE } = require('../lib/httpCode');

/**
 * @class
 * Crypt
 * 
 * @usage
 * For data encrypt/decryption, and JWT usage.
 * 
 * @function hash - To hash a data.
 * @param {string} data - Unhashed data
 * 
 * @function signToken - To compare password and sign token.
 * @param {object} res - Express response object
 * @param {string} data - Fetched data
 * @param {string} payload - Payload from req.body
 */

class Crypt {
  static async hash(data) {
    const salt = await bcrypt.genSalt(10);
    const res = await bcrypt.hash(data, salt);

    return res;
  }

  static async signToken(res, data, payload) {
    const cx = 'crypt-signToken';
    const validate = await bcrypt.compare(payload.password, data.password);

    if (!validate) {
      logger.error(cx, 'Incorrect credentials!');
      return response.error(res, 'Incorrect credentials!', CODE.FORBIDDEN);
    }

    const token = await jwt.sign({ email: payload.email }, config.get('/secretKey'), { expiresIn: '24h' });
    return token;
  }
}

module.exports = Crypt;
