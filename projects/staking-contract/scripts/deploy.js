const hre = require("hardhat");

async function main() {
  const simpleERC20 = await hre.ethers.getContractFactory("SimpleERC20");
  const tokenName = "Simple ERC20";
  const tokenSymbol = "SERC20";
  const totalSupply = 1000000;
  const simpleERC20Contract = await simpleERC20.deploy(tokenName, tokenSymbol, totalSupply);
  const StakingContract = await hre.ethers.getContractFactory("StakingRewards");
  const stakingContract = await StakingContract.deploy(simpleERC20Contract.target,simpleERC20Contract.target);

  console.log("SimpleERC20 deployed to:", simpleERC20Contract.target);
  console.log("StakingRewards deployed to:", stakingContract.target);


    if (hre.network.name === "hardhat") {
        return;
    }
    console.info("Waiting For Explorer to Sync Contract (10s)...")
    await wait(10)

    try {
        await hre.run("verify:verify", {
            address: simpleERC20Contract.target,
            contract: "contracts/SimpleERC20.sol:SimpleERC20",
            constructorArguments: [tokenName, tokenSymbol, totalSupply],
        });

        await hre.run("verify:verify", {
            address: stakingContract.target,
            contract: "contracts/StakingRewards.sol:StakingRewards",
            constructorArguments: [simpleERC20Contract.target,simpleERC20Contract.target],
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
