require('./src/config/vars');

module.exports = {
  redisConnectionString: process.env.REDIS_URL,
  defaultFlagFilePath: './src/examples/defaultFlags.json',
  namespace: 'my_namespace',
};
