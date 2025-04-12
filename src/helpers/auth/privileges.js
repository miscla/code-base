
const response = require('../utils/response');
const { CODE } = require('../lib/httpCode');

const checkPrivilege = (role) => async (req, res, next) => {
    let roleArray = role.split(",");
    const validationRole = roleArray.includes(req.user.dataUser.role) || false
    // const userRole = req.user.dataUser.role == role || false;

    if(!validationRole) return response.error(res, 'Your role is not allowed', CODE.FORBIDDEN);

next();
};

module.exports = {
  checkPrivilege
};