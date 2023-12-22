# Feature Flag Manager

A flexible and easy-to-use library for managing feature flags in your Node.js applications.

## Overview

Feature flags (or feature toggles) allow you to enable or disable certain features in your application without changing code. This library provides a simple interface to handle feature flags with support for Redis caching.


## Installation

Install the library via npm:

```bash
npm install feature-flag-library
```

## Quick Start

### Initialize Configuration

Create a fresh configuration file. This will generate a sample configuration file for you.
```
npx feature-flag-manager init
```

### 

```
const FeatureFlagManager = require('feature-flag-library');
const featureFlagManager = new FeatureFlagManager();

// Initialize FeatureFlagManager with default configuration
await featureFlagManager.init();

// Set a feature flag
await featureFlagManager.createFlag('newFeature', true);

// Check if the feature is enabled
const isEnabled = await featureFlagManager.checkFlag('newFeature');
console.log('New feature is enabled:', isEnabled);

// Get the value of a feature flag
const value = await featureFlagManager.getFlag('newFeature');
console.log('Value of new feature:', value);

// Disconnect from Redis when done
await featureFlagManager.disconnect();
```

## Commands

### Initialize
Create a fresh configuration file

```
npx feature-flag-manager init
```

### Test Configuration
Verify the correctness of your configuration:

```
npx feature-flag-manager test-config
```

### List Flags
List all available flags:

```
npx feature-flag-manager list-flags
```

### Set Flag
Set a flag with a given name and value:

``` 
npx feature-flag-manager set-flag newFeature true
```

### Get Flag
Get the value of a flag by its name:

```
npx feature-flag-manager get-flag newFeature
```

### Check Flag
Check if a flag exists by its name:

``` 
npx feature-flag-manager check-flag newFeature
```

### Remove Flag
Remove a flag by its name:

``` 
npx feature-flag-manager remove-flag newFeature
```

