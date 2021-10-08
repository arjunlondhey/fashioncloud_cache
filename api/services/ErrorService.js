/**
 * Send error only from policy or Controller layer
 */
const _ = require('lodash'),
  CustomError = require('../helpers/CustomError'),
  UNKNOWN_ERROR = 'unknown',

  LogService = require('./LogService'),
  LOG_CATEGORY = 'ErrorService';

module.exports = {
  /**
   * Will send the supported errors in response
   *
   * @param {Object} res Fastify response object
   * @param {Object} err CustomError object
   * @param {Number} err.status Http status - 400
   * @param {String} err.name error codeName - invalidParamError
   * @param {String} err.message error message - message for consumers
   * @param {String} err.detail error message - identifier
   * @param {String} err.instance error message - workspace/b7877ba7-ea35-4d3b-9c07-8981b2a5acaa
   */
  sendError: function (res, err) {
    // define body explicity so error response format is always consistant
    let body = {
      error: {
        status: err && err.status || 500,
        name: err && err.name || UNKNOWN_ERROR
      }
    };

    // only custom error are exposed to clients
    if (err instanceof CustomError) {
      body.error.message = err.message || '';
      body.error.detail = err.detail || '';
      body.error.instance = err.instance || '';
    }
    else {
      const unexpectedError = {
        message: err.message || '',
        stack: err.stack || ''
      };

      LogService.logError({}, LOG_CATEGORY, '', '', unexpectedError);
    }

    res.code(body.error.status).send(body);
  }
}