
const hre = require("hardhat");

async function main() {

   const crowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
   const crowdFundingContract = await crowdFunding.deploy();
    console.log("CrowdFunding deployed to address: ", crowdFundingContract.target);

    if (hre.network.name === "hardhat") {
        return;
    }
    console.info("Waiting For Explorer to Sync Contract (10s)...")
    await wait(10)

    try {
        await hre.run("verify:verify", {
            address: crowdFundingContract.target,
            contract: "contracts/CrowdFunding.sol:CrowdFunding",
            constructorArguments: [],
        });
    } catch (error) {
        console.log("Verification Failed.: ", error);
    }

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function wait(timeInSeconds) {
    await new Promise((r) => setTimeout(r, timeInSeconds * 1000));
}
