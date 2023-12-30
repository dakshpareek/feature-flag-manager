const Redis = require('ioredis');
const RedisConnection = require('../config/RedisConnection');
const { RedisConnectionError } = require('../errors/RedisClient.error');

class RedisClient extends RedisConnection {
  constructor(redisConnectionString) {
    super();
    this.client = new Redis(redisConnectionString);
    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });
    this.client.on('error', (err) => {
      console.error(`Redis error: ${err}`);
      throw new RedisConnectionError('Failed to connect to Redis');
    });
  }

  static async validateConnection(redisConnectionString) {
    const testClient = new Redis(redisConnectionString, {
      maxRetriesPerRequest: 0,
    });

    try {
      // Use a simple Redis command to test the connection
      await testClient.ping();
      console.log('Redis connection string is valid.');
      return true;
    } catch (error) {
      console.log(error);
      throw new RedisConnectionError('Failed to connect to Redis');
    } finally {
      testClient.disconnect();
    }
  }

  async testConnection() {
    try {
      // Use a simple Redis command to test the connection
      const testKey = 'test_key';
      await this.client.set(testKey, 'test_value');
      await this.client.del(testKey);
      console.log('Redis connection test successful.');
    } catch (error) {
      console.error('Error testing Redis connection:', error);
      throw new RedisConnectionError('Failed to test Redis connection', error);
    }
  }

  disconnect() {
    this.client.disconnect();
    console.log('Disconnected from Redis');
  }

  async set(key, value) {
    await this.client.set(key, value);
  }

  async get(key) {
    return this.client.get(key);
  }

  async keys(pattern) {
    return this.client.keys(pattern);
  }

  async del(key) {
    await this.client.del(key);
  }

  // Implement other necessary Redis methods as per the interface
}

module.exports = RedisClient;
