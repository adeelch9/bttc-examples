const hre = require("hardhat");

async function main() {
    const helloWorld = await hre.ethers.getContractFactory("HelloWorld");
    const helloWorldContract = await helloWorld.deploy();
    console.log("Contract deployed to address: ", helloWorldContract.target);

    if (hre.network.name === "hardhat") {
        return;
    }
    console.info("Waiting For Explorer to Sync Contract (10s)...")
    await wait(10)

    try {
        await hre.run("verify:verify", {
            address: helloWorldContract.target,
            contract: "contracts/HelloWorld.sol:HelloWorld",
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
