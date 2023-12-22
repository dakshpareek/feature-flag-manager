const fs = require('fs');
const RedisClient = require('./RedisClient');

const { findUpConfig, openConfigFile } = require('../utils/utility');
const { FeatureFlagInitializationError, FeatureFlagConfigurationError, FeatureFlagCacheError } = require('../errors/FeatureFlagManager.error');

class FeatureFlagManager {
  constructor() {
    this.defaultNamespace = 'config_default:';
    this.configFile = findUpConfig(process.cwd(), 'feature-flag', ['config.js']);
  }

  async init() {
    try {
      if (!this.configFile) {
        throw new FeatureFlagInitializationError('Config file not found.');
      }

      this.configData = await openConfigFile(this.configFile);
      await this.setConfigs(this.configData);
      this.redisClient = new RedisClient(this.redisConnectionString);
      await this.cacheDefaultFlags();
    } catch (error) {
      console.error('Error initializing FeatureFlagManager:', error);
      throw new FeatureFlagInitializationError('Failed to initialize FeatureFlagManager');
    }
  }

  async testConfiguration() {
    if (!this.configFile) {
      throw new FeatureFlagConfigurationError('Config file not found.');
    }
    this.configData = await openConfigFile(this.configFile);
    await this.setConfigs(this.configData);
    await RedisClient.testConnectionString(this.redisConnectionString);
    await this.testDefaultFlagFile(); // Add a method to test the default flag file
    console.log('Configuration is valid.');
  }

  async testDefaultFlagFile() {
    try {
      if (this.defaultFlagFilePath) {
        const defaultFlags = JSON.parse(fs.readFileSync(this.defaultFlagFilePath, 'utf8'));
        console.log('Default flag file is valid.');
      }
    } catch (error) {
      throw new FeatureFlagConfigurationError('Failed to test default flag file', error);
    }
  }

  async setConfigs(config) {
    if (!config.redisConnectionString) {
      throw new FeatureFlagConfigurationError('Redis connection string is missing in the configuration.');
    }
    this.redisConnectionString = config.redisConnectionString;
    this.defaultFlagFilePath = config.defaultFlagFilePath;
    this.namespace = config.namespace ? `${config.namespace}:` : 'default:';
  }

  async cacheDefaultFlags() {
    try {
      if (this.defaultFlagFilePath) {
        const defaultFlags = JSON.parse(fs.readFileSync(this.defaultFlagFilePath, 'utf8'));
        for (const flag in defaultFlags) {
          const namespacedFlag = this.getDefaultFlagNamespacedKey(flag);
          await this.redisClient.set(namespacedFlag, defaultFlags[flag]);
        }
      }
    } catch (error) {
      console.error('Error loading or caching default flags:', error);
      throw new FeatureFlagCacheError('Failed to load or cache default flags', error);
    }
  }

  async createFlag(flagName, value) {
    try {
      const namespacedFlagName = this.getNamespacedKey(flagName);
      await this.redisClient.set(namespacedFlagName, value);
    } catch (error) {
      console.error(`Error creating flag "${flagName}":`, error);
      throw new FeatureFlagCacheError(`Failed to create flag "${flagName}"`, error);
    }
  }

  async getFlag(flagName) {
    try {
      const namespacedFlagName = this.getNamespacedKey(flagName);
      let flagValue = await this.redisClient.get(namespacedFlagName);

      if (flagValue === null) {
        const defaultFlagValue = await this.getDefaultFlagValue(flagName);
        flagValue = defaultFlagValue !== null ? defaultFlagValue : flagValue;
      }
      return flagValue;
    } catch (error) {
      console.error(`Error getting flag "${flagName}":`, error);
      throw new FeatureFlagCacheError(`Failed to get flag "${flagName}"`, error);
    }
  }

  async checkFlag(flagName) {
    try {
      const flagValue = await this.getFlag(flagName);
      return flagValue !== null ? flagValue : false;
    } catch (error) {
      console.error(`Error checking flag "${flagName}":`, error);
      throw new FeatureFlagCacheError(`Failed to check flag "${flagName}"`, error);
    }
  }

  async listFlags(includeDefaultFlags = true) {
    try {
      let keys = await this.redisClient.keys(`${this.namespace}*`);

      if (includeDefaultFlags) {
        const defaultKeys = await this.redisClient.keys(`${this.defaultNamespace}*`);
        keys = keys.concat(defaultKeys);
      }

      return keys.map((key) => key.replace(`${this.defaultNamespace}`, '').replace(`${this.namespace}`, ''));
    } catch (error) {
      console.error('Error listing flags:', error);
      throw new FeatureFlagCacheError('Failed to list flags', error);
    }
  }

  async removeFlag(flagName) {
    try {
      const defaultFlagValue = await this.getDefaultFlagValue(flagName);
      if (defaultFlagValue !== null) {
        console.log(`Cannot remove flag "${flagName}" from the default namespace.`);
        return;
      }

      const namespacedFlagName = this.getNamespacedKey(flagName);
      const flagValue = await this.redisClient.get(namespacedFlagName);

      if (flagValue !== null) {
        await this.redisClient.del(namespacedFlagName);
        console.log(`Flag "${flagName}" removed.`);
      } else {
        console.log(`Flag "${flagName}" does not exist.`);
      }
    } catch (error) {
      console.error(`Error removing flag "${flagName}":`, error);
      throw new FeatureFlagCacheError(`Failed to remove flag "${flagName}"`, error);
    }
  }

  async getDefaultFlagValue(flagName) {
    try {
      const defaultNamespacedFlag = this.getDefaultFlagNamespacedKey(flagName);
      const defaultFlagValue = await this.redisClient.get(defaultNamespacedFlag);
      return defaultFlagValue;
    } catch (error) {
      console.error(`Error getting default flag value for "${flagName}":`, error);
      throw new FeatureFlagCacheError(`Failed to get default flag value for "${flagName}"`, error);
    }
  }

  getDefaultFlagNamespacedKey(key) {
    return `${this.defaultNamespace}${key}`;
  }

  getNamespacedKey(key) {
    return `${this.namespace}${key}`;
  }

  async disconnect() {
    try {
      if (this.redisClient) {
        this.redisClient.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
      // Log the error and continue; disconnecting is not a critical operation
    }
  }
}

module.exports = FeatureFlagManager;
