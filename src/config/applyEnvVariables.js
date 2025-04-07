const fs = require('fs');
const filePath = `${__dirname}/customize.json`;
fs.unlinkSync(filePath);

const { BASE_URL } = process.env;

const customizedJson = {
  BASE_URL,
};

console.log('Below is the config files details:');
console.log(JSON.stringify(customizedJson));

fs.writeFileSync(filePath, JSON.stringify(customizedJson));
