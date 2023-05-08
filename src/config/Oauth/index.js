const githubPassportConfig = require("./githubOauth");
const googlePassportConfig = require("./googleOauth");

module.exports = () => {
  googlePassportConfig();
  githubPassportConfig();
};
