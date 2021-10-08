/**
 * HealthController
 *
 * @description :: Server-side logic for handling health check requests
 */

const os = require('os'),
  LogService = require('../services/LogService'),

  LOG_CATEGORY = 'HealthController';

module.exports = {
  /**
   * This is a function to respond to api calls on root
   *
   * @param {Object} req The request object
   * @param {Object} res The response object
   */
  status: function (req, res) {
    let applicationVersion = require('../../package.json').version,
      uptime = -1,
      mem = -1,
      load = [];

    try {
      mem = os.freemem() / os.totalmem();
      load = os.loadavg();
      uptime = os.uptime();
    }

    catch (err) {
      LogService.logError(req, LOG_CATEGORY, '', '', err);
    }

    res.send({
      version: applicationVersion,
      uptime: uptime,
      mem: mem,
      load: load
    });
  }
};
