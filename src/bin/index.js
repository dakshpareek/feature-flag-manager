#!/usr/bin/env node

const fs = require('fs');
const { program } = require('commander');
const figlet = require('figlet');
const { promisify } = require('util');

const path = require('path');
const resolveFrom = require('resolve-from');
const FeatureFlagManager = require('../services/FeatureFlagManager');

// Promisify common functions.
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

console.log(figlet.textSync('Feature Flag Manager'));

// Initialize FeatureFlagManager only if not already initialized
const featureFlagManager = new FeatureFlagManager();

async function initializeFeatureFlagManager() {
  if (featureFlagManager.configFile) {
    try {
      await featureFlagManager.init();
    } catch (error) {
      console.error('Error initializing FeatureFlagManager:', error);
      throw error;
    }
  } else {
    throw 'Config file not found.';
  }
}

program.version('1.0.0');

// Initialize if the command is 'init'
program
  .command('init')
  .description('Create a fresh config file.')
  .action(async () => {
    const modulePath = resolveFrom.silent(process.cwd(), 'feature-flag-library');
    if (featureFlagManager.configFile) {
      console.log(`Error: config file already exists at ${featureFlagManager.configFile}`);
    } else {
      const stubPath = './feature-flag.config.js';
      try {
        const featureFlagLibraryPath = resolveFrom.silent(process.cwd(), 'feature-flag-library');
        const modulePath = featureFlagLibraryPath
          ? path.join(path.dirname(featureFlagLibraryPath), 'sub/flag.config.js')
          : './src/sub/flag.config.js';
        const code = await readFile(modulePath);

        await writeFile(stubPath, code);
        console.log('Created file.');
      } catch (error) {
        console.error('Error creating file:', error);
      }
    }
    exitApp();
  });

// Test configuration
program
  .command('test-config')
  .description('Test the correctness of the configuration')
  .action(async () => {
    try {
      await featureFlagManager.testConfiguration();
    } catch (error) {
      console.error(error.toResponse().message);
      exitApp(1);
    }
    exitApp();
  });

// List all flags
program
  .command('list-flags')
  .description('List all available flags')
  .action(async () => {
    await initializeFeatureFlagManager();
    const allFlags = await featureFlagManager.listFlags();
    console.log('All Flags:', allFlags);
    exitApp();
  });

program
  .command('set-flag <flagName> <value>')
  .description('Set a flag with a given name and value')
  .action(async (flagName, value) => {
    await initializeFeatureFlagManager();
    await featureFlagManager.createFlag(flagName, value === 'true');
    console.log(`Flag "${flagName}" set to ${value}`);
    exitApp();
  });

// Get a flag
program
  .command('get-flag <flagName>')
  .description('Get the value of a flag by its name')
  .action(async (flagName) => {
    await initializeFeatureFlagManager();
    const flagValue = await featureFlagManager.getFlag(flagName);
    if (flagValue !== null) {
      console.log(`Flag "${flagName}" has value: ${flagValue}`);
    } else {
      console.log(`Flag "${flagName}" does not exist.`);
    }
    exitApp();
  });

// Check flag existence
program
  .command('check-flag <flagName>')
  .description('Check if a flag exists by its name')
  .action(async (flagName) => {
    await initializeFeatureFlagManager();
    const flagExists = await featureFlagManager.checkFlag(flagName);
    console.log(`Flag "${flagName}" exists: ${flagExists}`);
    exitApp();
  });

program
  .command('remove-flag <flagName>')
  .description('Remove a flag by its name')
  .action(async (flagName) => {
    await initializeFeatureFlagManager();
    await featureFlagManager.removeFlag(flagName);
    exitApp();
  });

program.parse(process.argv);

function exitApp(code = 0) {
  process.exit(code);
}
