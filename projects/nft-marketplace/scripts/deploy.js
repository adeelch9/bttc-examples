const hre = require("hardhat");

async function main() {
  const marketPlace = await hre.ethers.getContractFactory("MarketPlace");
  const marketPlaceContract = await marketPlace.deploy(); 
  console.log("Market Place Contract deployed at", marketPlaceContract.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
