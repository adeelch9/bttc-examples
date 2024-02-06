# Prerequisites


-   [Nodejs](https://nodejs.org/en) v18.19.0 or higher


# Steps for running and deploying the contracts
- [ ] [Install Dependencies.](#install-packages)
- [ ] [Setup .env file.](#setup-.env-file)
- [ ] [Deploy the contracts Locally.](#deployment-local)
- [ ] [Deploy the contracts BTTC Test Network.](#deployment-on-bttc-testnet)

## Testing
- [ ] [Run the tests.](#contract-testing)
- [ ] [Run the tests coverage.](#contract-testing-coverage)


# Install packages
```shell
npm install 
```

# Setup .env file
Copy ".env.example" file content and create a .env file for managing the private key of the deployer.
Add deployer's wallet's private key e.g
```
PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY>
```

# Deployment Local

Run the following command to compile and deploy the contracts on local hardhat network
```shell
npm run deploy
```

# Deployment on BTTC Testnet
Run the following command to compile and deploy the contracts on bttc testnet network
```shell
npm run deploy:testnet
```
Testnet configuration is added in "hardhat.config.js" file

After deployment the output of the script will be the addresses of the contracts


```
Token Time Lock deployed to address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

# Contract Testing

Run the following command to run the tests. Tests are located in test folder.

```shell
npm run test
```
# Contract Testing Coverage
Run the following command to check the contract test cases coverage  .
```shell
npx run coverage
```
