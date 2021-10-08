const _ = require('lodash'),
  EXPIRE_TTL = app.config.constants.REDIS_EXPIRE_TTL,
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

    return app.redisUtil.hget(cacheKey, recordId);
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
    return app.redisUtil.hset(cacheKey, record, value, 'EX', EXPIRE_TTL);
  },

  /**
   * Get all baseSet records from cache, it is findALL to the key
   */
  getAllCacheEntries: function (cacheKey) {
    return app.redisUtil.hvals(cacheKey);
  },

  /**
   * Delete cache entry for a key
   * @param  {String} recordId - recordId to delete
   */
  deleteCacheForKey: function (cacheKey, recordId) {
    if (!record) {
      return Errors.invalidParamsError({ instance: recordId });
    }

    return app.redisUtil.hdel(cacheKey, recordId);
  },

  /**
   * Delete all cache entries
   *
   */
  deleteAllCache: function (cacheKey) {
    return app.redisUtil.del(cacheKey);
  }
}