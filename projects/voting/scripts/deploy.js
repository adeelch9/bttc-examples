const hre = require("hardhat");

async function main() {
  // get Voting contract factory
  const Voting = await hre.ethers.getContractFactory("Voting");
  const votingContract = await Voting.deploy();
  console.log("Voting deployed to:", votingContract.target);

    if (hre.network.name === "hardhat") {
        return;
    }
    console.info("Waiting For Explorer to Sync Contract (10s)...")
    await wait(10)

    try {
        await hre.run("verify:verify", {
            address: votingContract.target,
            contract: "contracts/Voting.sol:Voting",
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
