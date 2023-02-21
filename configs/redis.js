const redis = require('redis')

const {
  redisHost,
  redisPort,
  redisPassword
} = require('../env.configs');

const client = redis.createClient({
  password: redisPassword,
  socket: {
    host: redisHost,
    port: +redisPort
  }
});

module.exports = client
