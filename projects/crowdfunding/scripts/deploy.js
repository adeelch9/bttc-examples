
const hre = require("hardhat");

async function main() {

   const crowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
   const crowdFundingContract = await crowdFunding.deploy();
    console.log("CrowdFunding deployed to address: ", crowdFundingContract.target);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
