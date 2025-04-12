const redis = require('redis');
// const logger = require('../../utils/logger');
const logger = require('./../../helpers/lib/logger');

// https://redis.io/topics/pubsub
// http://redis.js.org/#api-publish-subscribe
class redisPubSub {
  constructor(options) {
    this.options = options;
    this.pubClient = redis.createClient({
      host: options.host,
      port: options.port,
      password: options.password,
      auth_pass:options.password,
      db: options.db
    });

    this.subClient = redis.createClient({
      host: options.host,
      port: options.port,
      password: options.password,
      auth_pass:options.password,
      db: options.db
    });

    this.client = redis.createClient({
      host: options.host,
      port: options.port,
      password: options.password,
      auth_pass:options.password,
      db: options.db
    });

  }

  listen(){
    this.client.on('ready', () => {
      this.client.config('SET', 'notify-keyspace-events', 'Ex');
      logger.info('redis-Connection', 'redis set notify keyspace events');
    });
  }

  publish(message, cb) {
    this.pubClient.publish(this.options.channel, message, (error, reply) => {
      cb(error, reply);
    });
    // this.pubClient.expire(this.options.channel, 10);
  }

  subscribe() {
    this.subClient.subscribe(this.options.channel);
  }

  on(event, cb) {
    this.subClient.on(event, (channel, message) => {
      cb(channel, message);
    });
  }


}

module.exports = redisPubSub;
