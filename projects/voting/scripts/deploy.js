const hre = require("hardhat");

async function main() {
  // get Voting contract factory
  const Voting = await hre.ethers.getContractFactory("Voting");
  const votingContract = await Voting.deploy();
  console.log("Voting deployed to:", votingContract.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
