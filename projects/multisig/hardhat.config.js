require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    bttc_testnet: {
      url: "https://pre-rpc.bt.io/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1029,
      timeout: 100_000
    },
  },
  allowUnlimitedContractSize: true,
}