const HealthController = require('../api/controllers/HealthController'),
  CacheController = require('../api/controllers/CacheController');

module.exports = function (fastify, opts, done) {
  // routes for health controller
  fastify.get('/', {
    handler: HealthController.status
  });

  fastify.get('/cache', {
    handler: CacheController.find
  });

  fastify.get('/cache/:id', {
    handler: CacheController.findOne
  });

  fastify.post('/cache', {
    handler: CacheController.create
  });

  fastify.put('/cache/:id', {
    handler: CacheController.update
  });

  fastify.delete('/cache/:id', {
    handler: CacheController.deleteOne
  });

  fastify.delete('/cache', {
    handler: CacheController.delete
  });
  done();
};
