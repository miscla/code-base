const { CODE } = require('../lib/httpCode');

/**
 * @class
 * Response
 * 
 * @usage
 * As a wrapper to return data.
 * 
 * @function data - To return data with 200 status code.
 * @param {object} res - Express response object
 * @param {string} message - Message response
 * @param {object} data - Returned data
 * 
 * @function error - To return data with error status codes.
 * @param {object} res - Express response object
 * @param {string} message - Message response
 * @param {number} code - Error code
 */

class Response {
  static data(res, message, data) {
    return res.status(CODE.SUCCESS).json({
      success: true,
      data: data,
      message: message,
      code: CODE.SUCCESS,
    });
  }

  static error(res, message, code) {
    return res.status(code).json({
      success: false,
      data: null,
      message: message,
      code: code,
    });
  }
}

module.exports = Response;
