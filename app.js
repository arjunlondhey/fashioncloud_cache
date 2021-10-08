
let _ = require('lodash'),
  Redlock = require('redlock'),
  LogService = require('./api/services/LogService'),
  RedisService = require('./api/services/RedisService'),
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

    // Authentication Service initialize (Heimdal)
    global.app.redis = await RedisService.getClient(_.get(environmentConfig, 'cache'));

    // RedLock is required to provide atomicity on update/delete cache calls
    global.app.redLock = new Redlock(
      // you should have one client for each independent redis node
      // or cluster
      [global.app.redis],
      {
        // the expected clock drift; for more details
        // see http://redis.io/topics/distlock
        driftFactor: 0.01, // multiplied by lock ttl to determine drift time

        // the max number of times Redlock will attempt
        // to lock a resource before erroring
        retryCount: 3,

        // the time in ms between attempts
        retryDelay: 200, // time in ms

        // the max time in ms randomly added to retries
        // to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter: 200 // time in ms
      }
    );

    global.app.redisUtil = RedisService.getRedisUtil();
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
