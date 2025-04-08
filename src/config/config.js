const customizeFile = require("./customize.json");
const envConfig = JSON.parse(JSON.stringify(customizeFile));

module.exports = {
  envConfig,
};
