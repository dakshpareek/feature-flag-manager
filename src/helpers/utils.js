const { getFlag } = require("../services/flags");

function checkFlag(flagName) {
    const flagValue = getFlag(flagName);
    return flagValue;
}

module.exports = {
    checkFlag,
};
