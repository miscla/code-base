const { v4: uuid } = require('uuid');

const logger = require('../../../../helpers/lib/logger');
const response = require('../../../../helpers/utils/response');

const Task = require('../models/Task');
const UserTask = require('../models/UserTask');
const TaskHistory = require('../models/TaskHistory');
const TaskComment = require('../models/TaskComment');

const Crypt = require('../../../../helpers/utils/crypt');
const { CODE } = require('../../../../helpers/lib/httpCode');
const {
  createTask
} = require('../../../../helpers/utils/validationPayload');
const Redis = require('../../../../database/redis/redis');
const config = require('../../../../helpers/config/config');
const { Queue } = require('bullmq');

const REDIS_CLIENT_CONFIGURATION = {
    host: config.get('/redis/redisHost'),
    port: config.get('/redis/redisPort'),
    username: 'default',
    passsword: config.get('/redis/redisPassword'),
    auth_pass: config.get('/redis/redisPassword')
};

const redisClient = new Redis(REDIS_CLIENT_CONFIGURATION);
const queueCreate = new Queue("queueCreate", { connection: {
    host: config.get('/redis/redisHost'),
    port: config.get('/redis/redisPort'),
    username: 'default',
    password: config.get('/redis/redisPassword')
} });

class TaskCommand {
    static async createTask(req, res) {
        const cx = 'task-createTask';

        const payload = { ...req.body };

        try {
            const validatedData = createTask.parse(payload);
            const task = await Task.create({
                userAssign: payload.userAssign,
                userCreate: {
                    userId: req.user.dataUser.userId,
                    email: req.user.dataUser.email,
                    role: req.user.dataUser.role
                },
                taskName: payload.taskName
            });
            let payloadInsertMany = [];
            payload?.userAssign.map(value => {
                payloadInsertMany.push({
                    userId: value.userId,
                    name: value.name,
                    email: value.email,
                    taskId: task.taskId,
                    createdAt: task.createdAt
                });
            });
            await UserTask.insertMany(payloadInsertMany);

            await TaskHistory.create({
                taskId: task.taskId,
                createdAt: task.createdAt,
                status: 'created'
            });

            task.userAssign.map(async (value) => {
                const job = await queueCreate.add("queueCreate", value, { removeOnComplete: true });
                // redisClient.worker(job, 'queueCreate');
            });

            return response.data(res, 'Task created successfully!', task);
        } catch (error) {
            return response.error(res, 'Validation error!', CODE.FORBIDDEN);
        }
    }
  
    static async updateTask(req, res) {
        const cx = 'task-updateTask';

        const payload = { ...req.params, ...req.body };
        const findTaskById = await Task.findOne({ taskId: payload.id });

        if (!findTaskById) {
        logger.error(cx, 'Task not found.');
        return response.error(res, 'Task not found!', CODE.NOT_FOUND);
        }

        const data = {
            userAssign: payload.userAssign,
            taskName: payload.taskName,
            status: payload.status ? payload.status : findTaskById.status
        };

        const task = await Task.updateOne({ taskId: payload.id }, data);
        if (!task) {
            logger.error(cx, 'Failed to update task data.');
            return response.error(res, 'Failed to update task data!', CODE.INTERNAL_ERROR);
        }

        await TaskCommand.deleteAllUserTask(payload);

        if (payload.status && task) {
            await TaskHistory.create({
                taskId: findTaskById.taskId,
                status: payload.status
            });

            await redisClient.selectDb(0);
            redisClient.deleteKey(findTaskById.taskId);
        }

        if (payload.comment) {
            await TaskComment.create({
                taskId: findTaskById.taskId,
                status: payload.status,
                comment: payload.comment
            });
        }

        return response.data(res, 'Task updated successfully!', task);
    }
    
    static async deleteAllUserTask(payload) {
        await UserTask.deleteMany({
            taskId: payload.id
        });
        
        let payloadInsertMany = [];
        payload?.userAssign.map(value => {
            payloadInsertMany.push({
                userId: value.userId,
                name: value.name,
                email: value.email,
                taskId: payload.id,
                createdAt: new Date().toISOString()
            });
        });
        await UserTask.insertMany(payloadInsertMany);
        return null;
    }
    
    static async deleteTask(req, res) {
        const cx = 'task-deleteTask';
        const payload = { ...req.params };

        const findTaskById = await Task.findOne({ taskId: payload.id });

        if (!findTaskById) {
            logger.error(cx, 'Task not found.');
            return response.error(res, 'Task not found!', CODE.NOT_FOUND);
        }

        const task = await Task.deleteOne({ taskId: payload.id });
        if (!task) {
            logger.error(cx, 'Failed to delete task.');
            return response.error(res, 'Failed to delete task!', CODE.INTERNAL_ERROR);
        }

        return response.data(res, 'Task deleted successfully!', task);

    }
}

module.exports = TaskCommand;
