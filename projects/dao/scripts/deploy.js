const hre = require("hardhat");

async function main() {
  const vendingMachine = await hre.ethers.getContractFactory("VendingMachine");
  const vendingMachineContract = await vendingMachine.deploy();
  // deploy the Dao contract
  const simpleDAO = await hre.ethers.getContractFactory("SimpleDAO");
  const simpleDAOContract = await simpleDAO.deploy(vendingMachineContract.target, 1000,["buy_cupcakes", "no_cupcakes"])
  console.log("Vending Machine Contract deployed at", vendingMachineContract.target);
  console.log("Simple DAO Contract deployed at", simpleDAOContract.target);

    if (hre.network.name === "hardhat") {
        return;
    }
    console.info("Waiting For Explorer to Sync Contract (10s)...")
    await wait(10)

    try {
        await hre.run("verify:verify", {
            address: vendingMachineContract.target,
            contract: "contracts/VendingMachine.sol:VendingMachine",
            constructorArguments: [],
        });

        await hre.run("verify:verify", {
            address: simpleDAOContract.target,
            contract: "contracts/SimpleDAO.sol:SimpleDAO",
            constructorArguments: [vendingMachineContract.target, 1000,["buy_cupcakes", "no_cupcakes"]],
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
