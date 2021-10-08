// eslint-disable-next-line no-process-env
let expect = require('chai').expect,
  server;

describe('HealthController', function () {

  before(async () => {
    await require('../../app')();
    server = global.app.fastify;
  })

  describe('GET / => .status', function () {
    it('should respond with 200 OK', async function () {
      let res = await server.inject({
        method: 'GET',
        url: '/'
      });

      let body = JSON.parse(res.body);
      expect(res.statusCode).to.equal(200);
      expect(body).to.have.keys('load', 'mem', 'uptime', 'version');
      expect(body.load).to.be.an('array');
      expect(body.mem).to.be.a('number');
      expect(body.uptime).to.be.a('number');
      expect(body.version).to.be.a('string');
    });
  });
});
