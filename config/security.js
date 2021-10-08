module.exports.security = {
  cors: {
    origin: true,
    methods: 'GET,POST,PUT,DELETE,HEAD,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type,Cookie,x-access-token',
    exposedHeaders: '',
    preflightContinue: false
  },
  helmet: { // xssFilter, noSniff default config used present in fastify-helmet
    frameguard: {
      action: 'deny'
    },
    referrerPolicy: {
      policy: 'same-origin'
    },
    strictTransportPolicy: {
      maxAge: 63072000,
      includeSubDomains: false
    }
  }
};
