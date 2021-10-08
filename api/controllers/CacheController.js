/**
 * CacheController
 *
 * @description :: Server-side logic for handling cache related features
 */

const LogService = require('../services/LogService'),
  CacheService = require('../services/CacheService'),
  ErrorService = require('../services/ErrorService'),

  Response = require('../helpers/Response'),
  Errors = require('../helpers/Errors'),
  LOG_CATEGORY = 'CacheController';

module.exports = {
  /**
   * Create new cache entry for a key
   *
   * @param {Object} req The request object
   * @param {Object} res The response object
   */
  create: async function (req, res) {
    let key = req?.body?.id,
      value = req?.body?.value;

    if (!key || !value) {
      return ErrorService.sendError(res, Errors.badRequest({ detail: 'invalid arguments passed in request' }));
    }


    try {
      await CacheService.createUpdateCacheEntry(key, value);

      return Response.generateResponse('createCache', { updated: true });
    }
    catch (err) {
      LogService.logError(req, LOG_CATEGORY, '', '', err);
      return ErrorService.sendError(res, err);
    }
  },

  /**
   * Update cache entry for a key
   *
   * @param {Object} req The request object
   * @param {Object} res The response object
   */
  update: async function (req, res) {
    let key = req?.params?.id,
      value = req?.body?.value;

    if (!key || !value) {
      return ErrorService.sendError(res, Errors.badRequest({ detail: 'invalid arguments passed in request' }));
    }

    try {
      await CacheService.createUpdateCacheEntry(key, value);

      return Response.generateResponse('updateCache', { updated: true });
    }
    catch (err) {
      LogService.logError(req, LOG_CATEGORY, '', '', err);
      return ErrorService.sendError(res, err);
    }
  },

  /**
  * Get cache entry for a key
  *
  * @param {Object} req The request object
  * @param {Object} res The response object
  */
  findOne: async function (req, res) {
    let key = req?.params?.id;

    if (!key) {
      return ErrorService.sendError(res, Errors.badRequest({ detail: 'invalid arguments passed in request' }));
    }

    try {
      let record = await CacheService.getCacheEntry(key);

      return Response.generateResponse('findOneCache', { record });
    }
    catch (err) {
      LogService.logError(req, LOG_CATEGORY, '', '', err);
      return ErrorService.sendError(res, err);
    }
  },

  /**
   * Create all entries in cache
   *
   * @param {Object} req The request object
   * @param {Object} res The response object
   */
  find: async function (req, res) {
    try {
      let records = await CacheService.getAllCacheEntries();

      return Response.generateResponse('findCache', { record: records });
    }
    catch (err) {
      LogService.logError(req, LOG_CATEGORY, '', '', err);
      return ErrorService.sendError(res, err);
    }
  },

  /**
   * Delete cache entry for a key
   *
   * @param {Object} req The request object
   * @param {Object} res The response object
   */
  deleteOne: async function (req, res) {
    let key = req?.params?.id;

    if (!key) {
      return ErrorService.sendError(res, Errors.badRequest({ detail: 'invalid arguments passed in request' }));
    }

    try {
      await CacheService.deleteCacheForKey(key);

      return Response.generateResponse('delCacheKey', { success: true });
    }
    catch (err) {
      LogService.logError(req, LOG_CATEGORY, '', '', err);
      return ErrorService.sendError(res, err);
    }
  },

  /**
   * Delete all cache entries
   *
   * @param {Object} req The request object
   * @param {Object} res The response object
   */
  delete: async function (req, res) {
    try {

      await CacheService.deleteAllCache();

      return Response.generateResponse('delCache', { success: true });
    }
    catch (err) {
      LogService.logError(req, LOG_CATEGORY, '', '', err);
      return ErrorService.sendError(res, err);
    }
  }
};
