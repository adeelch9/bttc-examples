const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");
const hre = require("hardhat");

describe("SimpleDAO", async function () {
  const [deployer, account1, account2, account3, account4] =
    await hre.ethers.getSigners();
  beforeEach(async function () {
    const VendingMachine = await ethers.getContractFactory("VendingMachine");
    this.Vendingmachine = await VendingMachine.deploy();
    const proposals = ["buy_cupcake", "no_cupcakes"];
    const SimpleDAO = await ethers.getContractFactory("SimpleDAO");
    this.dao = await SimpleDAO.deploy(this.Vendingmachine.target, 1, proposals);
    for (let i = 1; i < 3; i++) {
      let voters = await hre.ethers.getSigners();
      await this.dao.giveRightToVote(voters[i].address);
    }
  });
  it("Should check machine address", async function () {
    expect(await this.dao.VendingMachineAddress()).to.equal(
      this.Vendingmachine.target
    );
  });
  it("Should check cupcake Balance", async function () {
    expect(await this.dao.checkCupCakeBalance()).to.equal(0);
  });
  it("Should count votes", async function () {
    await this.dao.vote(0);
    await this.dao.countVote();
    expect(await this.dao.decision()).to.equal(0);
    expect(await this.dao.ended()).to.equal(true);
  });

  it("Should deposit ether", async function () {
    await this.dao.DepositEth({ value: 100 });
  });

  it("Should withdraw ether", async function () {
    await this.dao.DepositEth({ value: 100 });
    await this.dao.withdraw(100);
  });

  // it should end the voting process
  it("Should end the voting process", async function () {
    await this.dao.vote(0);
    await this.dao.DepositEth({ value: "1000000000000000000" });
    await this.dao.countVote();
    await this.dao.EndVote();
    const amount = 1;
    const ethValue = "1000000000000000000"; // 1 eth
    await this.Vendingmachine.purchase(amount, { value: ethValue });
    let balance = await this.Vendingmachine.cupcakeBalances(
      this.Vendingmachine.target
    );
    expect(balance).to.equal(98);
  });

  it("Should not deposit ether", async function () {
    await expect(
      this.dao.DepositEth({ value: "10000000000000000000" })
    ).to.be.revertedWith("1 Ether balance has been reached");
  });

  it("Should not allow to vote twice", async function () {
    await this.dao.vote(0);
    await expect(this.dao.vote(0)).to.be.revertedWith("Already voted.");
  });

  it("Should not allow to giveRightToVote other than owner", async function () {
    await expect(
      this.dao.connect(account1).giveRightToVote(account2.address)
    ).to.be.revertedWith("Only chairperson can give right to vote.");
  });

  it("Should not allow to vote with weight 0", async function () {
    await expect(this.dao.connect(account4).vote(0)).to.be.revertedWith(
      "Has no right to vote"
    );
  });

    it("Should not allow to End vote without counting", async function () {
        await expect(this.dao.EndVote()).to.be.revertedWith("Must count vote first");
    });

    // it should not allow to withdraw more than deposited
    it("Should not allow to withdraw more than deposited", async function () {
        await expect(this.dao.withdraw(100)).to.be.revertedWith("amount > balance");
    });

    

});
