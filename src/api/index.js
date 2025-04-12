const router = require('express').Router();

const UserQuery = require('./controller/users/query/domain');
const UserCommand = require('./controller/users/command/domain');

const TaskCommand = require('./controller/tasks/command/domain');
const TaskQuery = require('./controller/tasks/query/domain');

const jwtAuth = require('../helpers/auth/jwtAuth');
const basicAuth = require('../helpers/auth/basicAuth');
const privileges = require('../helpers/auth/privileges');

const worker = require('../helpers/utils/worker');

const { rateLimit } = require('express-rate-limit')
const { Worker } = require('bullmq');

// Initialize basic authentication.
router.use(basicAuth.init());

// const limiter = rateLimit({
// 	windowMs: 1,
// 	// windowMs: 15 * 60 * 1000,
// 	limit: 3,
// 	standardHeaders: 'draft-8',
// 	legacyHeaders: false
// })

// router.use(limiter)

/**
 * @modules
 * Users module.
 */
router.get('/api/users', jwtAuth.authenticateJWT, privileges.checkPrivilege('admin'),  UserQuery.getUsers);

router.post('/api/users', basicAuth.isAuthenticated, UserCommand.createUsers);
router.post('/api/users/login', basicAuth.isAuthenticated, UserCommand.loginUsers);

/**
 * @modules
 * Task module.
 */
router.post('/api/task', jwtAuth.authenticateJWT, privileges.checkPrivilege('admin,manager'), TaskCommand.createTask);
router.put('/api/task/:id', jwtAuth.authenticateJWT, privileges.checkPrivilege('admin,manager,user'),  TaskCommand.updateTask);
router.delete('/api/task/:id', jwtAuth.authenticateJWT, privileges.checkPrivilege('admin,manager'),  TaskCommand.deleteTask);
router.get('/api/task/:id', jwtAuth.authenticateJWT, privileges.checkPrivilege('admin,manager,user'),  TaskQuery.getTaskById);
router.get('/api/task/user/:id', jwtAuth.authenticateJWT, privileges.checkPrivilege('admin,manager,user'),  TaskQuery.getTaskUserById);

worker.init();

module.exports = router;
