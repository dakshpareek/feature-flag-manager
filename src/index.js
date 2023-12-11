const flags = require("./services/flags");
const utils = require("./helpers/utils");

module.exports = {
  getFlag: flags.getFlag,
  checkFlag: utils.checkFlag,
  setFlag: flags.setFlag, // (Optional)
};
