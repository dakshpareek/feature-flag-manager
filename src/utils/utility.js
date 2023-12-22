const fs = require('fs');
const path = require('path');

function findUpConfig(cwd, name, extensions) {
  return escalade(cwd, (dir, names) => {
    for (const ext of extensions) {
      const filename = `${name}.${ext}`;
      if (names.includes(filename)) {
        return path.join(dir, filename);
      }
    }
    return false;
  });
}

function escalade(dir, callback) {
  let currentDir = path.resolve(dir);
  const { root } = path.parse(currentDir);
  let names = fs.readdirSync(currentDir);

  while (currentDir !== root) {
    const result = callback(currentDir, names);
    if (result) {
      return result;
    }

    currentDir = path.dirname(currentDir);
    names = fs.readdirSync(currentDir);
  }

  return null;
}

async function openConfigFile(configPath) {
  const importFile = require('./importFile');
  const config = await importFile(configPath);
  return config;
}

module.exports = {
  findUpConfig,
  openConfigFile,
};
