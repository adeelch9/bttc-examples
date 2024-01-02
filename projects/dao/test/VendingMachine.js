const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");
const hre = require("hardhat");

describe("VendingMachine", async function () {
  const accounts = await ethers.getSigners();
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

    beforeEach(async function () {
      // deploy the VendingMachine contract
      const VendingMachine = await ethers.getContractFactory("VendingMachine");
      this.machine = await VendingMachine.deploy();
    });
    it("Should get owner", async function () {
      const contractOwner = await this.machine.owner();
      expect(contractOwner).to.equal(await this.machine.runner.address);
    });

    it("Should machine balance", async function () {
      let balance = await this.machine.cupcakeBalances(this.machine.target);
      expect(balance).to.equal(100);
    });

    it("Should be able to refill", async function () {
      let amount = 100;

      await this.machine.refill(amount);

      let balance = await this.machine.cupcakeBalances(this.machine.target);
      expect(balance).to.equal(200);
    });

    it("Should be able to purchase", async function () {
      const amount = 1;
      const ethValue = "1000000000000000000"; // 1 eth
      await this.machine.purchase(amount, { value: ethValue });
      let balance = await this.machine.cupcakeBalances(this.machine.target);
      expect(balance).to.equal(99);
    });


    it("Should not be able to refill if not owner", async function () {
      let amount = 100;
      await expect(
        this.machine.connect(accounts[1]).refill(amount)
      ).to.be.revertedWith("Only the owner can refill.");
    });
    it("Should not be able to purchase if not enough eth", async function () {
      const amount = 1;
      const ethValue = "100000000000000000"; // 0.1 eth
      await expect(
        this.machine.purchase(amount, { value: ethValue })
      ).to.be.revertedWith("You must pay at least 1 ETH per cupcake");
    });

    it("Should not be able to purchase if not enough cupcakes", async function () {
      const amount = 101;
      const ethValue = "101000000000000000000"; // 101 eth
      await expect(
        this.machine.purchase(amount, { value: ethValue })
      ).to.be.revertedWith("Not enough cupcakes in stock to complete this purchase");
    });

});
