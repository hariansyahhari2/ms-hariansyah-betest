const redis = require('redis')

const {
  redisHost,
  redisPort,
  redisPassword
} = require('../env.configs');

const client = redis.createClient({
  url: redisHost
});

module.exports = client
