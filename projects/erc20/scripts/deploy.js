const hre = require("hardhat");

async function main() {
  const simpleERC20 = await hre.ethers.getContractFactory("SimpleERC20");

  const tokenName = "Simple ERC20";
  const tokenSymbol = "SERC20";

  // 100000 * 10^18
  const totalSupply = "100000000000000000000000";
  const simpleERC20ContractDeployed = await simpleERC20.deploy(tokenName, tokenSymbol, totalSupply);
  console.log("ERC20 deployed to address: ", simpleERC20ContractDeployed.target);

    if (hre.network.name === "hardhat") {
        return;
    }
    console.info("Waiting For Explorer to Sync Contract (10s)...")
    await wait(10)

    try {
        await hre.run("verify:verify", {
            address: simpleERC20ContractDeployed.target,
            contract: "contracts/SimpleERC20.sol:SimpleERC20",
            constructorArguments: [tokenName, tokenSymbol, totalSupply],
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
