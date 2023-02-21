const { promisify } = require('util');

const { redisDeletePattern } = require('../utils');
const { redisTTL } = require('../env.configs');

const client = require('../configs/redis');

const cacheMiddleware = (customKey) => {
  return async (req, res, next) => {
    let cacheKey;
    if (customKey) {
      cacheKey = customKey;
    } else {
      cacheKey = res.credentials ? `${res.credentials.userName}${req.url}` : `${req.body.userName}${req.url}`;
    }
    const rcTtl = redisTTL;

    const getAsync = promisify(client.get).bind(client);

    if (
      req.headers['cache-control']
      && req.headers['cache-control'].toLowerCase() === 'no-cache'
    ) {
      const urlKeyList = req.url.split('/');
      const keyUrl = urlKeyList[1];
      let invalidateCacheKey = res.credentials ? `${res.credentials.userName}/${keyUrl}` : `${req.body.userName}/${keyUrl}`;

      await Promise.all([
        redisDeletePattern(client, invalidateCacheKey),
        redisDeletePattern(client, customKey)
      ])
      return next();
    }

    const data = await getAsync(cacheKey);

    if (data) {
      res.setHeader('Content-type', 'application/json');
      return res.send(JSON.parse(data));
    }

    const oldSend = res.send;
    res.send = (body) => {
      if (res.statusCode === 200) {
        client.setex(cacheKey, rcTtl, JSON.stringify(body));
      }
      res.send = oldSend;
      res.send(body);
    };

    return next();
  };
};

module.exports = cacheMiddleware;
