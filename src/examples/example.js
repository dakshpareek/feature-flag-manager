require('../config/vars');

const FeatureFlagManager = require('../services/FeatureFlagManager');

// Connecting to Redis and performing operations
(async () => {
  try {
    const featureFlagManager = new FeatureFlagManager();

    await featureFlagManager.init();

    // Set a flag
    await featureFlagManager.createFlag('exampleFlag', true);
    console.log('Flag set.');

    // Check if the flag exists
    const flagExists = await featureFlagManager.checkFlag('exampleFlag');
    console.log('Flag exists:', flagExists);

    // Get Flag Value
    const flagValue = await featureFlagManager.getFlag('exampleFlag');
    console.log('Flag value:', flagValue);

    // Check Default Flag Exists
    const defaultFlagExists = await featureFlagManager.checkFlag('defaultFlag');
    console.log('Default Flag exists:', defaultFlagExists);

    // Get Default Flag Value
    const defaultFlagValue = await featureFlagManager.getFlag('defaultFlag');
    console.log('Default Flag value:', defaultFlagValue);

    // Check Non-existent Flag
    const nonExistentFlag = await featureFlagManager.checkFlag('nonExistentFlag');
    console.log('Non-existent Flag:', nonExistentFlag);

    // Check Flag Set via Default Flags File
    const anotherDefaultFlagExists = await featureFlagManager.checkFlag('anotherDefaultFlag');
    console.log('Another Default Flag exists:', anotherDefaultFlagExists);

    const allFlags = await featureFlagManager.listFlags();
    console.log(`All flags: ${allFlags}`);
    // Disconnect from Redis
    await featureFlagManager.disconnect();
  } catch (error) {
    console.error('Error in operations:', error);
  }
})();
