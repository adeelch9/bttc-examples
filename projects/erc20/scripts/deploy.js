const hre = require("hardhat");

async function main() {
  const simpleERC20 = await hre.ethers.getContractFactory("SimpleERC20");

  const tokenName = "Simple ERC20";
  const tokenSymbol = "SERC20";

  // 100000 * 10^18
  const totalSupply = "100000000000000000000000";
  const simpleERC20ContractDeployed = await simpleERC20.deploy(tokenName, tokenSymbol, totalSupply);
  console.log("ERC20 deployed to address: ", simpleERC20ContractDeployed.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
