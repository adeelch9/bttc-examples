# Prerequisites  


-   [Nodejs](https://nodejs.org/en) v18.19.0 or higher

# Install packages   
```shell
npm install 
```
# Deployment  

Copy ".env.example" file content and create a .env file for managing the private key of the deployer.
Add deployer's wallet's private key eg 
```shell
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```
Run the following command to compile and deploy the contracts on local hardhat network
```shell
npm run deploy
```

Run the following command to compile and deploy the contracts on bttc testnet network
```shell
npm run deploy:testnet
```
Testnet configuration is added in "hardhat.config.js" file


After deployment the output of the script will be the addresses of the contracts  

```
SimpleERC20 deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
StakingRewards deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

# Contract Testing

Run the following command to run the tests. Tests are located in test/ folder .
```shell
npx hardhat test
```

# Contract Testing Coverage

Run the following command to check the contract test cases coverage  .
```shell
npx hardhat coverage
```




