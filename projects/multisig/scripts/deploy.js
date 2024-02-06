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

    if (hre.network.name === "hardhat") {
        return;
    }
    console.info("Waiting For Explorer to Sync Contract (10s)...")
    await wait(10)

    try {
        await hre.run("verify:verify", {
            address: multiSigWalletContract.target,
            contract: "contracts/MultiSigWallet.sol:MultiSigWallet",
            constructorArguments: [owners,owners.length],
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
