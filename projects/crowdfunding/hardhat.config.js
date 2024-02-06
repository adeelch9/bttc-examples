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
    },
    bttc_mainnet: {
      url: "https://rpc.bt.io/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 199,
    },
  },
    etherscan: {
        apiKey: {
            bttc_testnet: '5ITUQA681SDC1Z79KBQDXJQUSVNXG3WSMN'
        },
        customChains: [
            {
                network: "bttc_testnet",
                chainId: 1029,
                urls: {
                    apiURL: "https://api-testnet.bttcscan.com/api",
                    browserURL: "https://testnet.bttcscan.com"
                }
            }
        ]
    },
  allowUnlimitedContractSize: true,
}
