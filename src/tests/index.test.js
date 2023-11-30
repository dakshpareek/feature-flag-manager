const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../index');

/**
 * Test to see if the server is running
 */
describe('GET /api/v1/', () => {
  test('should return 200 OK', async () => {
    const res = await request(app).get('/api/v1/');
    expect(res.statusCode).toEqual(httpStatus.OK);
  });
  afterAll((done) => {
    done();
  });
});

/**
 * Test to see if swagger doc is not running on test server
 */
describe('GET /api/v1/documentation', () => {
  test('should return 404 NOT_FOUND', async () => {
    const res = await request(app).get('/api/v1/documentation');
    expect(res.statusCode).toEqual(httpStatus.NOT_FOUND);
  });
  afterAll((done) => {
    done();
  });
});
