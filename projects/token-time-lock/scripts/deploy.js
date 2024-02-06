
const hre = require("hardhat");

async function main() {

  // deploy Erc20Token
  const tokenName = "SimpleERC20";
  const tokenSymbol = "ERC20";
  const tokenSupply = 1000000;
  // create timestamp for 1 year from now
  const releaseTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
  const Erc20Token = await hre.ethers.getContractFactory("SimpleERC20");
  const erc20Token = await Erc20Token.deploy(tokenName, tokenSymbol, tokenSupply);

  const TokenTimeLock = await hre.ethers.getContractFactory("TokenTimeLock");
  const tokenTimeLock = await TokenTimeLock.deploy(erc20Token.target,erc20Token.runner.address,releaseTime );

  console.log("TokenTimeLock deployed to:", tokenTimeLock.target);

    if (hre.network.name === "hardhat") {
        return;
    }
    console.info("Waiting For Explorer to Sync Contract (10s)...")
    await wait(10)

    try {
        await hre.run("verify:verify", {
            address: erc20Token.target,
            contract: "contracts/SimpleERC20.sol:SimpleERC20",
            constructorArguments: [tokenName, tokenSymbol, tokenSupply],
        });

        await hre.run("verify:verify", {
            address: tokenTimeLock.target,
            contract: "contracts/TokenTimeLock.sol:TokenTimeLock",
            constructorArguments: [erc20Token.target,erc20Token.runner.address,releaseTime],
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
