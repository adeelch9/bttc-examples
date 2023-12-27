const hre = require("hardhat");

async function main() {
  const helloWorld = await hre.ethers.getContractFactory("HelloWorld");
  const helloWorldContract = await helloWorld.deploy();
  let greeting = await helloWorldContract.getGreeting();
  console.log("Contract deployed to address: ", helloWorldContract.target);
  console.log("Greeting function says ", greeting);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
