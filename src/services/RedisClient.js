const Redis = require('ioredis');
const RedisConnection = require('../config/RedisConnection');

class RedisClient extends RedisConnection {
    constructor(redisConnectionString) {
        super();
        this.client = new Redis(redisConnectionString);
        this.client.on('connect', () => {
            console.log('Connected to Redis');
        });
        this.client.on('error', (err) => {
            console.error(`Redis error: ${err}`);
        });
    }

    disconnect() {
        this.client.disconnect();
        console.log('Disconnected from Redis');
    }

    async set(key, value) {
        await this.client.set(key, value);
    }

    async get(key) {
        return await this.client.get(key);
    }

    // Implement other necessary Redis methods as per the interface
}

module.exports = RedisClient;
