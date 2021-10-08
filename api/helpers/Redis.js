const _ = require('lodash'),
  redisService = require('redis'),
  { promisify } = require('util'),
  redis = redisService.createClient({
    host: '127.0.0.1',
    port: '6379'
  }),
  EXPIRE_TTL = 5 * 60,

  redisInstance = {
    del: promisify(redis.del).bind(redis),
    hget: promisify(redis.hget).bind(redis),
    hvals: promisify(redis.hvals).bind(redis),
    hset: promisify(redis.hset).bind(redis),
    hdel: promisify(redis.hdel).bind(redis)
  },
  Errors = require('../helpers/Errors');

module.exports = {
  /**
   * Get cache entry for key
   *
   * @param  {String} recordId - the record to be fetched
   */
  getCacheEntry: function (cacheKey, recordId) {
    if (!recordId) {
      return Errors.invalidParamsError({ instance: recordId });
    }

    return redisInstance.hget(cacheKey, recordId);
  },

  /**
   * Update cache entry in DB
   *
   * @param  {String} recordId - the record for which closePoints needs to be updated
   * @param  {Function} cb - error-first callback
   */
  updateCacheEntry: function (cacheKey, record, value) {
    if (!record) {
      return Errors.invalidParamsError({ instance: record });
    }

    // Setting TTL as N mins, ie auto expire keys after N mins
    return redisInstance.hset(cacheKey, record, value, 'EX', EXPIRE_TTL);
  },

  /**
   * Get all baseSet records from cache, it is findALL to the key
   */
  getAllCacheEntries: function (cacheKey) {
    return redisInstance.hvals(cacheKey);
  },

  /**
   * Delete cache entry for a key
   * @param  {String} recordId - recordId to delete
   */
  deleteCacheForKey: function (cacheKey, recordId) {
    if (!record) {
      return Errors.invalidParamsError({ instance: recordId });
    }

    return redisInstance.hdel(cacheKey, recordId);
  },

  /**
   * Delete all cache entries
   *
   */
  deleteAllCache: function (cacheKey) {
    return redisInstance.del(cacheKey);
  }
}