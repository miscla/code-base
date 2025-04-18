require('dotenv').config();
const confidence = require('confidence');

const store = new confidence.Store({
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  secretKey: process.env.SECRET_KEY,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  basicAuth: [
    {
      username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD
    }
  ],
  redis: {
    redisHost: process.env.REDIS_CLIENT_HOST,
    redisPort: process.env.REDIS_CLIENT_PORT,
    redisPassword: process.env.REDIS_CLIENT_PASSWORD
  },
});

exports.get = key => store.get(key);
