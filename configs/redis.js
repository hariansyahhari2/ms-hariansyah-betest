const redis = require('redis')

const {
  redisHost,
  redisPort,
  redisPassword
} = require('../env.configs');

const client = redis.createClient({
  user: 'default',
  password: redisPassword,
  host: redisHost,
  port: +redisPort
});

module.exports = client
