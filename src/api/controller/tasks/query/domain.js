const Task = require('../models/Task');

const logger = require('../../../../helpers/lib/logger');
const response = require('../../../../helpers/utils/response');

const { CODE } = require('../../../../helpers/lib/httpCode');

const Redis = require('../../../../database/redis/redis');
const config = require('../../../../helpers/config/config');

const REDIS_CLIENT_CONFIGURATION = {
  host: config.get('/redis/redisHost'),
  port: config.get('/redis/redisPort'),
  username: 'default',
  passsword: config.get('/redis/redisPassword'),
  auth_pass: config.get('/redis/redisPassword')
};
const redisClient = new Redis(REDIS_CLIENT_CONFIGURATION);

class TaskQuery {
  static async getTasks(req, res) {
    const cx = 'task-getTasks';

    const tasks = await Task.find({});
    if (!tasks) {
      logger.error(cx, 'Failed to fetch tasks');
      return response.error(res, 'Failed to fetch tasks', CODE.INTERNAL_ERROR);
    }

    return response.data(res, 'tasks successfully fetched', tasks);
  }

  static async getTaskById(req, res) {
    const cx = 'tasks-getTaskById';
    const payload = { ...req.params };

    let paramAggregate = [
        {
            $match: { taskId: payload.id }
        },
        {
            $lookup: {
                from: 'task_history',
                localField: 'taskId',
                foreignField: 'taskId',
                pipeline: [{
                    $sort: {
                        createdAt: 1
                    }
                }],
                as: 'taskHistory'
            }
        },
        {
            $lookup: {
                from: 'task_comments',
                localField: 'taskId',
                foreignField: 'taskId',
                pipeline: [{
                    $sort: {
                        createdAt: 1
                    }
                }],
                as: 'taskComments'
            }
        },
    ];
    const task = await Task.aggregate(paramAggregate);
    if (!task) {
      logger.error(cx, 'Task data not found.');
      return response.error(res, 'Task data not found!', CODE.NOT_FOUND);
    }

    return response.data(res, 'Task successfully fetched', task);
  }

  static async getTaskUserById(req, res) {
    const cx = 'tasks-getTaskUserById';
    const payload = { ...req.params, ...req.query };

    const skip = (payload.page - 1) * payload.size;
    const task = await Task.find({ 'userAssign.userId': payload.id, status: payload.status })
        .skip(skip)
        .limit(parseInt(payload.size));
    if (!task) {
      logger.error(cx, 'Task data not found.');
      return response.error(res, 'Task data not found!', CODE.NOT_FOUND);
    }
    const total = await Task.countDocuments({
        'userAssign.userId': payload.id,
        status: payload.status
    });
    
    await redisClient.selectDb(0);
    task.map(value => {
      redisClient.setDataEx(value.taskId, 86400, value);
    });

    const metaData = {
        page: payload.page,
        size: payload.size,
        totalData: total,
        totalPages: Math.ceil(total / payload.size)
    };
    return response.pagination(res, 'Task successfully fetched', task, metaData);
  }
}

module.exports = TaskQuery;
