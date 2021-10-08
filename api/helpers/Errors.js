/**
 * All the supported errorNames is API
 */
const _ = require('lodash'),
  CustomError = require('./CustomError'),

  /**
   * @param {Number} status - status of the error
   * @param {String} name - error name
   * @param {String} message - optional
   * @param {String} detail - optional
   * @param {String} instance - optional
   * @param {...any} args any Error class argument
   * @returns {Object} error obj that can be used in ErrorService to send error
   */
  createError = function (status, name, message, detail, instance, ...args) {
    return new CustomError(status, name, message, detail, instance, ...args);
  };

module.exports = {
  serverError: (options = {}) => {
    const {
      name = 'serverError',
      message = 'Internal Server Error.',
      detail,
      instance
    } = options;

    return new createError(500, {
      name,
      message,
      detail,
      instance
    });
  },

  badRequest: function (options = {}) {
    const {
      name = 'badRequest',
      message = 'Invalid Request.',
      detail,
      instance
    } = options;

    return new createError(400,
      name,
      message,
      detail,
      instance);
  },

  internalServerError: function ({ message, detail, instance }) {
    return createError(500,
      'internalServerError',
      message,
      detail,
      instance);
  },
  functionRequiredParamError: function ({ message, detail, instance }) {
    return createError(500,
      'serverError',
      message,
      detail,
      instance);
  },

  invalidParamsError: function ({ detail, instance }) {
    return createError(400,
      'badRequest',
      'The specified parameter is in an invalid format',
      detail,
      instance);
  },

  notFound: function ({ message, detail, instance }) {
    return createError(404,
      'badRequest',
      message || 'The requested resource not found',
      detail,
      instance);
  }
};
