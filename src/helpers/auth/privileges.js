
const response = require('../utils/response');
const { CODE } = require('../lib/httpCode');

const checkPrivilege = (role) => async (req, res, next) => {
    // console.log(req.user.dataUser.role);
    // const privileges = req.user.dataUser.role || '';
    const userRole = req.user.dataUser.role == role || false;
    console.log(userRole);

    if(!userRole) return response.error(res, 'Your role is not allowed', CODE.FORBIDDEN);

next();
};

module.exports = {
  checkPrivilege
};