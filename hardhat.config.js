require("@nomiclabs/hardhat-waffle");
const dotenv = require("dotenv");

dotenv.config();

const RINKEBY_ACCOUNT_1 = '84566c8a1763d634e65bbf94efdcfe220128c1818b3a205617b03504c53a073c';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.RINKEBY_INFURA_KEY}`,
      accounts: [`0x${RINKEBY_ACCOUNT_1}`]
    },
  },
};
