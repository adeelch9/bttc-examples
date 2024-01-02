const hre = require("hardhat");

async function main() {
  const multiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");
  const owners = [
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
  ];
  const multiSigWalletContract = await multiSigWallet.deploy(
    owners,
    owners.length
  );
  console.log("Multisig wallet deployed at", multiSigWalletContract.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
