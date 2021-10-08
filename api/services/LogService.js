const winston = require('winston');

module.exports = {
  createLogger: function () {
    const logFormat = winston.format.printf(function (data) {
      // adding contents of `message` field in an `event` field.
      data.message && (data.event = data.message);
      // Will be passing exact log content to json formatter
      // Setting message field to `undefined` to remove redundant data.
      data.message = undefined;
    });

    // Create custom logger
    winston.loggers.add('default', {
      // Define levels required by Fastify (by default winston has verbose level and does not have trace)
      levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        trace: 4,
        debug: 5
      },
      // Setup log level, overide by env config
      level: _.get(global.app.config, 'logs.level', 'error'),
      // Setup logs format
      format: winston.format.combine(logFormat, winston.format.json()),
      transports: [new winston.transports.Console()]
    });

    // Here we use winston.containers IoC get accessor
    let logger = winston.loggers.get('default');

    // PINO like, we link winston.containers to use only one instance of logger
    logger.child = function () { return winston.loggers.get('default'); };

    return logger;
  },

  logError: function (request, category, error) {
    if (!error) {
      error = {};
    }

    let logObj = {
      level: 'error',
      category: category,
      error: error
    };

    app.fastify.log.error(logObj);
  },

  logInfo: function (request, category, info) {
    if (!info) {
      info = {};
    }

    let logObj = {
      level: 'info',
      category: category,
      info: info
    };

    app.fastify.log.info(logObj);
  }
};
