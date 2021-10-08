const _ = require('lodash'),
  randomString = require('randomstring'),

  LogService = require('../services/LogService'),
  Redis = require('../helpers/Redis'),
  CACHE_KEY = app.config.constants.CACHE_KEY,
  LOCK_TTL = app.config.constants.LOCK_TTL,
  LOG_CATEGORY = 'CacheService';


module.exports = {
  /**
   * Get cache entry for key if found else update entry in cache
   * Updating cache strategy:
   * 1. If cache found, update the TTL
   * 2. if cache not found, generate random string, update the record
   *
   * For updating cache, we use redLock to provide atomicity in distributed systems
   * @param  {String} recordId - the record to be fetched
   */
  getCacheEntry: async function (recordId) {
    if (!recordId) {
      return cb(null, []);
    }

    try {
      let record = await Redis.getCacheEntry(CACHE_KEY, recordId);

      if (!record) {
        LogService.logInfo(LOG_CATEGORY, 'Cache miss');
        record = randomString.generate();
      } else {
        LogService.logInfo(LOG_CATEGORY, 'Cache hit');
      }

      let lock = await app.redLock.lock(`${CACHE_KEY}::${recordId}`, LOCK_TTL);
      // Need to lock the resource to update the cache for atomicity
      if (lock) {
        await Redis.updateCacheEntry(CACHE_KEY, recordId, record);
        await lock.unlock();
      } else {
        LogService.logInfo(LOG_CATEGORY, 'Could not acquire lock');
      }

      return record;
    } catch (e) {
      return e;
    }
  },

  /**
   * Create or Update cache entry in DB
   *
   * @param  {String} recordId - the record for which closePoints needs to be updated
   */
  createUpdateCacheEntry: function (recordId, value) {
    if (!recordId) {
      return cb(null);
    }

    return Redis.updateCacheEntry(CACHE_KEY, recordId, value);
  },

  /**
   * Get all baseSet records from cache, it is findALL to the key
   *
   */
  getAllCacheEntries: function () {
    return Redis.getAllCacheEntries(CACHE_KEY);
  },

  /**
   * Delete cache entry for a key
   * @param  {String} recordId - recordId to delete
   */
  deleteCacheForKey: async function (recordId) {
    let lock = await app.redLock.lock(`${CACHE_KEY}::${recordId}`, LOCK_TTL);
    // Need to lock the resource to update the cache for atomicity
    if (lock) {
      Redis.deleteCacheForKey(CACHE_KEY, recordId);
      await lock.unlock();
    } else {
      LogService.logInfo(LOG_CATEGORY, 'Could not acquire lock');
    }

    return;
  },

  /**
   * Delete all cache entries
   */
  deleteAllCache: function () {
    return Redis.deleteAllCache(CACHE_KEY);
  }
}