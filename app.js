
let _ = require('lodash'),
  LogService = require('./api/services/LogService'),
  fastify = require('fastify')({
    trustProxy: true,
    bodyLimit: 1048576 * 100, // 100 Mb
    logger: LogService.createLogger(),
    disableRequestLogging: true,
    ajv: {
      customOptions: {
        removeAdditional: false // by default fasify remove the extra body params from the body
      }
    }
  }),
  environmentConfig = require('./config/config')();

global.app = {};

// Globally expose environment configuration
global.app = {
  config: environmentConfig
};
// Globally expose the fastify variable
global.app.fastify = fastify;

module.exports = async () => {
  try {
    /**
     * Attach the fastify-express middleware
     */
    await fastify.register(require('fastify-express'));
    /**
     * Attach the security and cors module
     */
    fastify.use(require('cors')(environmentConfig.security.cors));
    fastify.register(require('fastify-helmet'), environmentConfig.security.helmet);

    /**
     * Attach the routes
     */
    fastify.register(require('./config/routes'));

    /**
    * Initialize the ORM with db connection,
    *
    * and make sure db connection is successful
    */

    /* To allow connections from outside docker */
    let address = await global.app.fastify.listen('1337', '0.0.0.0');

    console.log(`Server lifted at address ${address}`);
  }

  catch (e) {
    console.log('Error during lifting the server', e);

    process.exit();
  }
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports();
