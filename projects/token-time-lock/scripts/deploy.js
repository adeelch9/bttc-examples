
const hre = require("hardhat");

async function main() {

  // deploy Erc20Token
  const tokenName = "SimpleERC20";
  const tokenSymbol = "ERC20";
  const tokenSupply = 1000000;
  const Erc20Token = await hre.ethers.getContractFactory("SimpleERC20");
  const erc20Token = await Erc20Token.deploy(tokenName, tokenSymbol, tokenSupply);

  const TokenTimeLock = await hre.ethers.getContractFactory("TokenTimeLock");
  const tokenTimeLock = await TokenTimeLock.deploy(erc20Token.target,erc20Token.runner.address, 1703765190);

  console.log("TokenTimeLock deployed to:", tokenTimeLock.target);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
