const redis = require('redis');

// const logger = require('../../utils/logger');
const logger = require('./../../helpers/lib/logger');

// const globalConfig = require('../../../infra/configs/global_config');
const globalConfig = require('../../helpers/config/config');

let connectionPool = [];
const ctx = 'redis-connection';

const retryStrategy = async (options) => {
  if (options.error) {
    if (options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error
      // and flush all commands with a individual errors
      logger.error('redis', 'The server refused the connection');
      return new Error('The server refused the connection');
    }
    if (options.error.code === 'ECONNRESET') {
      logger.error('redis', 'The server reset the connection');
      return new Error('The server reset the connection');
    }
    if (options.error.code === 'ETIMEDOUT') {
      logger.error('redis', 'The server timeouted the connection');
      return new Error('The server timeouted the connection');
    }
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    // End reconnecting after a specific timeout and flush all commands
    // with a individual error
    logger.error('redis', 'Retry time exhausted');
    return new Error('Retry time exhausted');
  }
  if (options.attempt > 10) {
    // End reconnecting with built in error
    logger.error('redis', 'Retry attempt exceed');
    return undefined;
  }
  // reconnect after
  return Math.min(options.attempt * 1000 * 60);
};

const createConnectionPool = async (config) => {
  try {
    const client = redis.createClient({
      retry_strategy: retryStrategy,
      ...config,
    });

    client.on('error', (err) => {
      connectionPool.push({ config, client, connected: false });
      logger.error(ctx, `Redis Client error: ${err}`);
    });

    client.on('ready', () => {
      connectionPool.push({ config, client, connected: true });
      logger.info(ctx, 'Redis Client Is Ready');
    });

    return connectionPool;
  } catch (error) {
    logger.error(ctx, 'error create connection redis');
    return null;
  }
};

const checkConnection = async () => {
  try {
    return connectionPool[0].connected;
  } catch (err) {
    logger.error(ctx, err);
    return false;
  }
};

const getConnection = async (config) => {
  const isConnected = await checkConnection();
  if (isConnected) {
    return connectionPool;
  }
  const result = await createConnectionPool(config);
  return result;
};

const init = async () => {
  createConnectionPool({
    host: globalConfig.get('/redis/redisHost'),
    port: globalConfig.get('/redis/redisPort'),
    username: 'default',
    passsword: globalConfig.get('/redis/redisPassword'),
    auth_pass: globalConfig.get('/redis/redisPassword')
  });
};

const closeConnection = async () => {
  const redisClient = await getConnection();

  return new Promise((resolve, reject) => {
    redisClient[0].client.quit(err => {
      if (err) {
        logger.error('redis-closeConnection', 'redis fail to close connection');
        reject(err);
      } else {
        logger.info('redis-closeConnection', 'redis success to close connection');
        resolve(true);
      }
    });
  });
};

module.exports = {
  createConnectionPool,
  getConnection,
  init,
  closeConnection,
  checkConnection
};
