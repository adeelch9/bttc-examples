const hre = require("hardhat");

async function main() {
  const simpleERC20 = await hre.ethers.getContractFactory("SimpleERC20");
  const tokenName = "Simple ERC20";
  const tokenSymbol = "SERC20";
  const totalSupply = 1000000;
  const simpleERC20Contract = await simpleERC20.deploy(tokenName, tokenSymbol, totalSupply);
  let name = await simpleERC20Contract.name();
  let symbol = await simpleERC20Contract.symbol();
  let balance = await simpleERC20Contract.balanceOf(simpleERC20Contract.runner.address);
  console.log("Name: ", name);
  console.log("Symbol: ", symbol);
  console.log("Balance: ", balance.toString());

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
