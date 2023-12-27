const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

let releaseTime = new Date(addMinutes(new Date(), 3)).getTime() 
releaseTime = Math.floor(releaseTime / 1000);
describe("TokenTimeLock", function () {
  const NAME = "SimpleERC20";
  const SYMBOL = "ERC20";
  const INITIAL_SUPPLY = "1000000000000000000000000"; // 1M tokens with 18 decimals
  before(async function () {
    const SimpleERC20 = await ethers.getContractFactory("SimpleERC20");
    this.simpleERC20 = await SimpleERC20.deploy(NAME, SYMBOL, INITIAL_SUPPLY);
    const TokenTimeLock = await ethers.getContractFactory("TokenTimeLock");
    this.tokenTimeLock = await TokenTimeLock.deploy(
      this.simpleERC20.target,
      this.simpleERC20.runner.address,
      releaseTime
    );
  });

  it("should have the correct token", async function () {
    expect(await this.tokenTimeLock.token()).to.equal(this.simpleERC20.target);
  });

  it("should have the correct beneficiary", async function () {
    expect(await this.tokenTimeLock.beneficiary()).to.equal(
      this.simpleERC20.runner.address
    );
  });

  it("should have the correct release time", async function () {
    expect(await this.tokenTimeLock.releaseTime()).to.equal(releaseTime);
  });

  it("should not release before time limit", async function () {
    await expect(this.tokenTimeLock.release()).to.be.revertedWith(
      "TokenTimeLock: current time is before release time"
    );
  });

  it("should not release just before time limit", async function () {
    await time.increaseTo(releaseTime - time.duration.seconds(3));
    await expect(this.tokenTimeLock.release()).to.be.revertedWith(
      "TokenTimeLock: current time is before release time"
    );
  });

  it("should release just after limit", async function () {
    // increase blocktime by 5 minutes
    await time.increaseTo(releaseTime + time.duration.minutes(1));
    await expect(this.tokenTimeLock.release()).to.be.revertedWith(
      "TokenTimeLock: no tokens to release"
    );
  });

  it("should release all tokens after time limit", async function () {
    await time.increaseTo(releaseTime + time.duration.minutes(5));
    await this.simpleERC20.transfer(this.tokenTimeLock.target, INITIAL_SUPPLY);
    await this.tokenTimeLock.release();
    expect(await this.simpleERC20.balanceOf(this.simpleERC20.runner.address)).to.equal(INITIAL_SUPPLY);
  });
});

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000)
}
