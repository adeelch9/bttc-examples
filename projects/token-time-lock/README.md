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
TokenTimeLock deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```