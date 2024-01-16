
const hre = require("hardhat");

async function main() {

  // deploy Erc20Token
  const tokenName = "SimpleERC20";
  const tokenSymbol = "ERC20";
  const tokenSupply = 1000000;
  // create timestamp for 1 year from now
  const releaseTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
  const Erc20Token = await hre.ethers.getContractFactory("SimpleERC20");
  const erc20Token = await Erc20Token.deploy(tokenName, tokenSymbol, tokenSupply);

  const TokenTimeLock = await hre.ethers.getContractFactory("TokenTimeLock");
  const tokenTimeLock = await TokenTimeLock.deploy(erc20Token.target,erc20Token.runner.address,releaseTime );

  console.log("TokenTimeLock deployed to:", tokenTimeLock.target);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
