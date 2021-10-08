/* eslint-disable max-len */
/**
 * @fileOverview
 * The development environment defaults are stored in this file. Any additional configuration changes can be
 * done using environment variables used using `env-lift`.
 */

module.exports = require('env-lift').load('fashion-cloud-app', {
  port: 1337,

  env: 'production',

  // service logger
  logger: {
    error: {
      enabled: true,
      teamIds: 'all',
      userIds: 'all',
      categories: 'all'
    },
    info: {
      enabled: true,
      teamIds: ['team-test'],
      userIds: ['user-test'],
      categories: ['HealthController', 'TestController']
    }
  },

  // fastify pino logger
  logs: {
    level: 'info'
  },

  routes: {}
});
