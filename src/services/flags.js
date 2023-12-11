const flags = {};

function getFlag(flagName) {
    if (!flags.hasOwnProperty(flagName)) {
        throw new Error(`Flag "${flagName}" doesn't exist.`);
    }
    return flags[flagName].value;
}

function setFlag(flagName, value) {
    flags[flagName] = { value };
}

module.exports = {
    getFlag,
    setFlag,
};
