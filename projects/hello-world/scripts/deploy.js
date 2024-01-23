const hre = require("hardhat");

async function main() {
  const helloWorld = await hre.ethers.getContractFactory("HelloWorld");
  const helloWorldContract = await helloWorld.deploy();
  console.log("Contract deployed to address: ", helloWorldContract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
