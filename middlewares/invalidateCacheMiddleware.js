const client = require('../configs/redis');
const { redisDeletePattern } = require('../utils');

const invalidateCacheMiddleware = (customKeyList = []) => {
  return async (req, res, next) => {
    const urlKeyList = req.url.split('/');
    const keyUrl = urlKeyList[1];

    let cacheKey = res.credentials ? `${res.credentials.userName}/${keyUrl}` : `${req.body.userName}/${keyUrl}`;

    customKeyList.push(cacheKey);

    const promises = [];

    customKeyList.map((key) => {
      promises.push(redisDeletePattern(client, key));
    })

    await Promise.all(promises);

    return next();
  };
};

module.exports = invalidateCacheMiddleware;
