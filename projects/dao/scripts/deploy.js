const hre = require("hardhat");

async function main() {
  const vendingMachine = await hre.ethers.getContractFactory("VendingMachine");
  const vendingMachineContract = await vendingMachine.deploy();
  // deploy the Dao contract
  const simpleDAO = await hre.ethers.getContractFactory("SimpleDAO");
  const simpleDAOContract = await simpleDAO.deploy(vendingMachineContract.target, 1000,["buy_cupcakes", "no_cupcakes"])
  console.log("Vending Machine Contract deployed at", vendingMachineContract.target);
  console.log("Simple DAO Contract deployed at", simpleDAOContract.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
