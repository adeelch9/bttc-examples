const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");
describe("StakingRewards", async function () {
  // deploy erc20 contract in beforeEach
  const NAME = "SimpleERC20";
  const SYMBOL = "ERC20";
  const INITIAL_SUPPLY = "1000000000000000000000000"; // 1M tokens with 18 decimals
  const accounts = await ethers.getSigners();

  beforeEach(async function () {
    const SimpleERC20 = await ethers.getContractFactory("SimpleERC20");
    this.simpleERC20 = await SimpleERC20.deploy(NAME, SYMBOL, INITIAL_SUPPLY);
    const stakingRewards = await ethers.getContractFactory("StakingRewards");
    this.stakingRewards = await stakingRewards.deploy(
      this.simpleERC20.target,
      this.simpleERC20.target
    );
  });

  it("should return last time reward appplied", async function () {
    expect(await this.stakingRewards.lastTimeRewardApplicable()).to.equal(0);
  });

  it("should return reward per token", async function () {
    expect(await this.stakingRewards.rewardPerToken()).to.equal(0);
  });
  it("should return earned", async function () {
    expect(
      await this.stakingRewards.earned(this.stakingRewards.runner.address)
    ).to.equal(0);
  });

  it("should set reward duration", async function () {
    await this.stakingRewards.setRewardsDuration(100);
    expect(await this.stakingRewards.duration()).to.equal(100);
  });

  it("should stake tokens", async function () {
    // approve tokens
    const amount = 100;
    await this.simpleERC20.approve(this.stakingRewards.target, amount);
    await this.stakingRewards.stake(amount);
    expect(
      await this.stakingRewards.balanceOf(this.stakingRewards.runner.address)
    ).to.equal(amount);
  });

  it("should withdraw tokens", async function () {
    const amount = 100;
    await this.simpleERC20.approve(this.stakingRewards.target, amount);
    await this.stakingRewards.stake(amount);
    await this.stakingRewards.withdraw(amount);
    expect(
      await this.stakingRewards.balanceOf(this.stakingRewards.runner.address)
    ).to.equal(0);
  });
  it("should get reward", async function () {
    await this.stakingRewards.getReward();
  });

  it("should notify reward amount", async function () {
    // stake 1m tokens
    const amount = 1000000000;
    await this.simpleERC20.approve(this.stakingRewards.target, amount);
    await this.stakingRewards.stake(amount);
    await this.stakingRewards.setRewardsDuration(1);
    await this.stakingRewards.notifyRewardAmount(1);
    await this.stakingRewards.getReward();
    await this.stakingRewards.notifyRewardAmount(2);
    expect(await this.stakingRewards.rewardRate()).to.equal(2);
  });
  it("should not set reward duration if not owner", async function () {
    await expect(
      this.stakingRewards.connect(accounts[1]).setRewardsDuration(100)
    ).to.be.revertedWith("not authorized");
  });

  it("should not stake if amount is 0", async function () {
    await expect(this.stakingRewards.stake(0)).to.be.revertedWith("amount = 0");
  });

  it("should not withdraw if amount is 0", async function () {
    await expect(this.stakingRewards.withdraw(0)).to.be.revertedWith(
      "amount = 0"
    );
  });

  it("should not notify reward amount if reward rate is 0", async function () {
    await this.stakingRewards.setRewardsDuration(1);
    await expect(this.stakingRewards.notifyRewardAmount(0)).to.be.revertedWith(
      "reward rate = 0"
    );
  });

  it("should not notify reward amount if reward amount is greater than balance", async function () {
    await this.stakingRewards.setRewardsDuration(1);
    await expect(this.stakingRewards.notifyRewardAmount(1)).to.be.revertedWith(
      "reward amount > balance"
    );
  });

});
