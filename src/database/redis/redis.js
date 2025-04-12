// const wrapper = require('../../utils/wrapper');
const wrapper = require('../../helpers/utils/response');

const pool = require('./connection');
const validate = require('validate.js');

const logger = require('./../../helpers/lib/logger');
// const logger = require('../../utils/logger');

class Redis {

  constructor(config) {
    this.config = config;
  }

  async selectDb(index) {
    let client = await pool.getConnection(this.config);
    if (client.err) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      logger.error('redis-selectDb', err, 'error', true);
      return wrapper.error(err, 'Failed to select db on Redis');
    });

    clientRedis.select(index, async (err) => {
      if (err) {
        logger.error('redis-db', `change db to ${index}, : ${err}`, 'error', true);
        return wrapper.error(err, 'Failed to select db on Redis');
      }
    });
  }
  async setData(key, value) {

    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const convertToString = JSON.stringify({
      data: value
    });
    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      logger.error('redis-setData', err, 'error', true);
      return wrapper.error(err, 'Failed to set data on Redis');
    });

    clientRedis.set(key, convertToString);
  }

  async setDataEx(key, duration, value) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const convertToString = JSON.stringify({
      data: value
    });
    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      logger.error('redis-setDataEx', err, 'error', true);
      return wrapper.error(err, 'Failed to set data on Redis');
    });
    clientRedis.set(key, convertToString, 'EX', duration);
  }


  async setDataNx(key, duration, value) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const convertToString = JSON.stringify({
      data: value
    });
    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      logger.error('redis-setDataNx', err, 'error', true);
      return wrapper.error(err, 'Failed to set data on Redis');
    });
    return clientRedis.set(key, convertToString, 'NX', duration);
  }

  async getData(key) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.error('redis-getData', err, 'error', true);
      return wrapper.error(err, 'Failed Get data From Redis');
    });
    return new Promise(((resolve, reject) => {
      clientRedis.get(key, (err, replies) => {
        if (err) {
          reject(wrapper.error(err, '', 404));
        }
        resolve(replies);
      });
    }));
  }

  async getAllKeys(key) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.error('redis-getAllKeys', err, 'error', true);
      return wrapper.error(err, 'Failed Get data From Redis');
    });
    return new Promise(((resolve, reject) => {
      clientRedis.keys(key, (err, replies) => {
        if (err) {
          reject(wrapper.error(err, '', 404));
        }
        resolve(replies);
      });
    }));
  }

  async deleteKey(key) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.error('redis-deleteKey', err, 'error', true);
      return wrapper.error(err, 'Failed Get data From Redis');
    });
    return new Promise(((resolve, reject) => {
      clientRedis.del(key, (err, replies) => {
        if (err) {
          reject(wrapper.error(err, '', 404));
        }
        resolve(replies);
      });
    }));
  }

  async setZeroAttemp(key, duration) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.error('redis-setZeroAttemp', err, 'error', true);
      return wrapper.error(err, 'Failed Get data From Redis');
    });
    return new Promise(((resolve, reject) => {
      clientRedis.set(key, 0, 'EX', duration, (err, replies) => {
        if (err) {
          reject(wrapper.error(err, '', 404));
        }
        resolve(replies);
      });
    }));
  }

  async incrAttempt(key) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.error('redis-incrAttempt', err, 'error', true);
      return wrapper.error(err, 'Failed Get data From Redis');
    });
    return new Promise(((resolve, reject) => {
      clientRedis.incr(key, (err, replies) => {
        if (err) {
          reject(wrapper.error(err, '', 404));
        }
        resolve(replies);
      });
    }));
  }

  async setReminder(key, value, expire, action) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.error('redis-setReminder', err, 'error', true);
      return wrapper.error(err, 'Failed Get data From Redis');
    });
    return new Promise(((resolve, reject) => {
      clientRedis
        .multi()
        .set(`${key}`, value)
        .set(`${action}-${key}`, value)
        .expire(`${action}-${key}`, expire)
        .exec((error, reply) => {
          if (error) {
            reject(error);
          } else {
            resolve(reply);
          }
        });
    }));
  }

  async deleteKeyWildcard(key) {
    let client = await pool.getConnection(this.config);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(this.config);
    }
    const clientRedis = client[0].client;

    clientRedis.on('error', (err) => {
      logger.error('redis-deleteKey', err, 'error', true);
      return wrapper.error(err, 'Failed Get data From Redis');
    });
    return new Promise(((resolve, reject) => {
      clientRedis.keys(key, (err, rows) => {
        if (rows.length > 0) {
          clientRedis.del(rows, (err, replies) => {
            if (replies === 1) {
              resolve(replies);
            }else{
              reject(wrapper.error(err, '', 404));
            }
          });
        }else{
          reject(wrapper.error(err, '', 404));
        }
      });
    }));
  }

  async checkConnection () {
    let client = await pool.getConnection(this.config);
    const isConnected = await pool.checkConnection();
    if (validate.isEmpty(client) || !isConnected) {
      client = await pool.createConnectionPool(this.config);
      return false;
    }
    return client[0].connected;
  }

  async worker(job, jobName) {
    try {
      let client = await pool.getConnection(this.config);
      if (validate.isEmpty(client)) {
        client = await pool.createConnectionPool(this.config);
      }
      const clientRedis = client[0].client;
      const unsubscribe = await clientRedis.subscribe("job_response", (message) => {
        const response = JSON.parse(message);
        console.log("Response from publisher:", response);
  
        if (response.jobId === job.id) {
          if (response.error) {
            throw new Error(response.error);
          } else {
            console.log(`Job ${job.id} completed successfully with result: ${response.result}`);
            // res.status(200).send({ result: response.result });
          }
        } else {
          console.warn(`Received response for unknown job ID: ${response.jobId}`);
        }
      });
    } catch (error) {
      console.error(`Job ${job.id} failed with error: ${error}`);
      // res.status(500).send({ error });
    }
  }

}


module.exports = Redis;
