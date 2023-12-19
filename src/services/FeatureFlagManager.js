const fs = require('fs');
const RedisClient = require('./RedisClient');

class FeatureFlagManager {
    constructor({ redisConnectionString, defaultFlagFilePath, namespace = 'default'}) {
        this.redisConnectionString = redisConnectionString;
        this.defaultFlagFilePath = defaultFlagFilePath;
        this.namespace = namespace ? `${namespace}:` : 'default:';
        this.defaultNamespace = 'config_default:';
    }

    async init() {
        try {
            this.redisClient = new RedisClient(this.redisConnectionString);
            await this.cacheDefaultFlags();
        } catch (error) {
            console.error('Error connecting to Redis:', error);
        }
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
        }
    }

    async createFlag(flagName, value) {
        const namespacedFlagName = this.getNamespacedKey(flagName);
        await this.redisClient.set(namespacedFlagName, value);
    }

    async getFlag(flagName) {
        const namespacedFlagName = this.getNamespacedKey(flagName);
        let flagValue = await this.redisClient.get(namespacedFlagName);

        if (flagValue === null) {
            const defaultFlagValue = await this.getDefaultFlagValue(flagName);
            flagValue = defaultFlagValue !== null ? defaultFlagValue : flagValue;
        }
        return flagValue;
    }

    async checkFlag(flagName) {
        const flagValue = await this.getFlag(flagName);
        return flagValue !== null ? flagValue : false;
    }

    async getDefaultFlagValue(flagName) {
        const defaultNamespacedFlag = this.getDefaultFlagNamespacedKey(flagName);
        const defaultFlagValue = await this.redisClient.get(defaultNamespacedFlag);
        return defaultFlagValue;
    }

    getDefaultFlagNamespacedKey(key) {
        return `${this.defaultNamespace}${key}`;
    }

    getNamespacedKey(key) {
        return `${this.namespace}${key}`;
    }

    async disconnect() {
        this.redisClient.disconnect();
    }
}

module.exports = FeatureFlagManager;
