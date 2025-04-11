const router = require('express').Router();

const UserQuery = require('./controller/users/query/domain');
const UserCommand = require('./controller/users/command/domain');

const jwtAuth = require('../helpers/auth/jwtAuth');
const basicAuth = require('../helpers/auth/basicAuth');
const privileges = require('../helpers/auth/privileges');

const { rateLimit } = require('express-rate-limit')

// Initialize basic authentication.
router.use(basicAuth.init());

const limiter = rateLimit({
	windowMs: 1,
	// windowMs: 15 * 60 * 1000,
	limit: 3,
	standardHeaders: 'draft-8',
	legacyHeaders: false
})

router.use(limiter)

/**
 * @modules
 * Users module.
 */
router.get('/api/users', jwtAuth.authenticateJWT, privileges.checkPrivilege('admin'),  UserQuery.getUsers);
router.get('/api/users/:userId', basicAuth.isAuthenticated, UserQuery.getUserById);

router.post('/api/users', basicAuth.isAuthenticated, UserCommand.createUsers);
router.post('/api/users/login', basicAuth.isAuthenticated, UserCommand.loginUsers);

router.put('/api/users/:userId', jwtAuth.authenticateJWT, UserCommand.updateUsers);
router.delete('/api/users/:userId', jwtAuth.authenticateJWT, UserCommand.deleteUsers);

module.exports = router;
