const redisDeletePattern = async (redis, pattern) => {
  const cb = () => {};

  redis.keys(pattern + '*', (err, keys) => {
    if (err) {
      return cb(err);
    }
    if (keys.length) {
      keys.forEach((key) => {
        redis.del(key, cb);
      })
    }

    return cb(null);
  });
}

module.exports = redisDeletePattern;
