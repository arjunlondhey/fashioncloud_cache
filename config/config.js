/**
 * Based on the environment, will return
 * the complete environment configuration
 */
module.exports = function () {
  let _ = require('lodash'),
    baseSecurityConfig = require('./security'),
    environmentConfig;

  try {
    // eslint-disable-next-line security/detect-non-literal-require
    environmentConfig = require(`./env/${process.env.APP_ENV}`);
  }
  catch (e) {
    // Since no logger instance available, using console
    // eslint-disable-next-line no-process-env
    console.log('Failed to load configuration with given APP_ENV:', process.env.APP_ENV);
    console.log('As a fallback, using development configuration');
    environmentConfig = require('./env/development');

    // eslint-disable-next-line no-process-env
    process.env.APP_ENV = 'development';
  }

  environmentConfig = _.merge({}, baseSecurityConfig, environmentConfig);

  if (environmentConfig.security && !environmentConfig.security.helmet) {
    throw Error('Cannot start server without helmet configuration');
  }

  return environmentConfig;
};
