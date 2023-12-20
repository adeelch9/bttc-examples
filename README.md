# BTTC Tutorial Contracts

This repo contains example projects for BTTC. It is divided in independent projects where each of them contains its smart contracts, test environment and unique config files.


## Existing projects

| Project name                | Description                                         | Solidity version(s) |
|-----------------------------|-----------------------------------------------------|---------------------|
| [AMM](./projects/amm)       | Implementation fork of uniswap v2.                  | 0.8.4               |
| [Farms](./projects/farming) | Based on SushiSwap's MasterChef, it includes farms. | 0.8.4                  |


## Create a new project

1 - Create a new folder inside `projects` <br/>
2 - Run `yarn init`

Commands inside the root `package.json` starting with `lerna` will run the corresponding command in each subproject.
