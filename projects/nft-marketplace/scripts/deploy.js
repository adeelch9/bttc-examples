const hre = require("hardhat");

async function main() {
  const marketPlace = await hre.ethers.getContractFactory("MarketPlace");
  const marketPlaceContract = await marketPlace.deploy();
  console.log("Market Place Contract deployed at", marketPlaceContract.target);

    if (hre.network.name === "hardhat") {
        return;
    }
    console.info("Waiting For Explorer to Sync Contract (10s)...")
    await wait(10)

    try {
        await hre.run("verify:verify", {
            address: marketPlaceContract.target,
            contract: "contracts/MarketPlace.sol:MarketPlace",
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
