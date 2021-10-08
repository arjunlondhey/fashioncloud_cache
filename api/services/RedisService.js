let _ = require('lodash'),
  Redis = require('redis'),
  { promisify } = require('util');

module.exports = {
  /**
   * @param {Object} options - identity config.
   * @param {function} onReady Callback when redis gets connected
   * @param {function} onEnd Callback when we are not able to connect to redis after retries
   */
  getClient (options) {
    let redis;

    REDIS_OPTIONS = {
      port: _.get(options, 'commonOptions.port'),
      host: _.get(options, 'hosts.read'),
      password: _.get(options, 'commonOptions.password', ''),
      connectTimeout: 10000
    };

    redis = Redis.createClient({
      host: _.get(options, 'hosts.read'),
      port: _.get(options, 'commonOptions.port')
    });

    redis.on('ready', () => {
      console.log('redis started ')
    });

    // In case there is trouble connecting with redis, and the max number of retries
    // have been exhausted, i.e it will not try to reconnect anymore, ioredis emits
    // an `end` event.
    redis.on('end', () => {
      console.log('redis stopped ')
    });

    return redis;
  },

  getRedisUtil () {
    return {
      del: promisify(app.redis.del).bind(app.redis),
      hget: promisify(app.redis.hget).bind(app.redis),
      hvals: promisify(app.redis.hvals).bind(app.redis),
      hset: promisify(app.redis.hset).bind(app.redis),
      hdel: promisify(app.redis.hdel).bind(app.redis)
    }
  }
};
