# BTTC Tutorial Contracts

This repo contains example projects for BTTC. It is divided in independent projects where each of them contains its smart contracts, test environment and unique config files.


## Existing projects

| Project name                                  | Description                                            | Solidity version(s) |
|-----------------------------------------------|--------------------------------------------------------|---------------------|
| [Hello World](./projects/hello-world)         | Hello World Contract example.                          | 0.8.4               |
| [Token ERC20](./projects/erc20)               | ERC20 Contract example.                                | 0.8.4               |
| [Simple Voting](./projects/voting)            | Voting Contract example.                               | 0.8.4               |
| [Time Lock](./projects/token-time-lock)       | Token Time Lock Contract example.                      | 0.8.4               |
| [CrowdFunding](./projects/crowdfunding)       | Simple Crowd Funding Contract example.                 | 0.8.4               |
| [MultiSig Wallet](./projects/multisig)        | MultiSig Wallet Contract example.                      | 0.8.4               |
| [DAO](./projects/dao)                         | Decentralize Autonomous Organization Contract example. | 0.8.4               |
| [Staking](./projects/staking-contract)        | Simple Staking Contract example.                       | 0.8.4                  |
| [NFT Marketplace](./projects/nft-marketplace) | Basic NFT marketplace contract example.                | 0.8.4               |

## Create a new project

1 - Create a new folder inside `projects` <br/>
2 - Run `yarn init`

Commands inside the root `package.json` starting with `lerna` will run the corresponding command in each subproject.
