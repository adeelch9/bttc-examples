const hre = require("hardhat");

async function main() {
  const simpleERC20 = await hre.ethers.getContractFactory("SimpleERC20");
  const tokenName = "Simple ERC20";
  const tokenSymbol = "SERC20";
  const totalSupply = 1000000;
  const simpleERC20Contract = await simpleERC20.deploy(tokenName, tokenSymbol, totalSupply);
  const StakingContract = await hre.ethers.getContractFactory("StakingRewards");
  const stakingContract = await StakingContract.deploy(simpleERC20Contract.target,simpleERC20Contract.target);
 
  console.log("SimpleERC20 deployed to:", simpleERC20Contract.target);
  console.log("StakingRewards deployed to:", stakingContract.target);

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
