
const hre = require("hardhat");
const feeToSetter="0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1"; //有权更改 feeTo 地址的账户,为当前合约部署者

async function main() {

  const uniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const UniswapV2Factory = await uniswapV2Factory.deploy(feeToSetter);

  // DELOY WATP 
  const WATP = await hre.ethers.getContractFactory("WATP");
  const watp = await WATP.deploy();

  // DELOY UniswapV2Router02
  const uniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
  const UniswapV2Router02 = await uniswapV2Router02.deploy(UniswapV2Factory.target,watp.target);

  // deploy multiCall
  const multiCall = await hre.ethers.getContractFactory("Multicall");
  const MultiCall = await multiCall.deploy();

  // get init code hash
  const initCodeHash = await UniswapV2Factory.INIT_CODE_PAIR_HASH();
  console.log("initCodeHash:", initCodeHash);

  console.log("UniswapV2Factory deployed to:", UniswapV2Factory.target);
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
