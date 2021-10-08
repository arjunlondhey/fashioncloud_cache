/* eslint-disable max-len */
/**
 * @fileOverview
 * The development environment defaults are stored in this file. Any additional configuration changes can be
 * done using environment variables used using `env-lift`.
 */

module.exports = require('env-lift').load('fashion-cloud-app', {
  port: 1337,

  env: 'development',

  cache: {
    hosts: {
      read: 'localhost'
    },
    commonOptions: {
      port: 6379,
      password: undefined
    }
  },
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

  constants: {
    CACHE_KEY: 'cache::key',
    LOCK_TTL: 30000,
    REDIS_EXPIRE_TTL: 5 * 60
  },
  routes: {}
});
