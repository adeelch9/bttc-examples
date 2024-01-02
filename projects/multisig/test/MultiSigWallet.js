const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");
const hre = require("hardhat");
describe("MultiSigWallet",async function () {
const accounts =await hre.ethers.getSigners();
const owners = [accounts[0].address, accounts[1].address, accounts[2].address];

  const requiredConfirmations = 3;
  beforeEach(async function () {
    const multiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    this.MultiSigWallet = await multiSigWallet.deploy(
      owners,
      requiredConfirmations
    );
  });

  it("Should return invalid address while submitting transaction", async function () {
    const invalidAddress = "0x0000000000000000000000000000000000000000";
    await expect(
      this.MultiSigWallet.submitTransaction(invalidAddress)
    ).to.be.revertedWith("Invalid address");
  });
  it("Should return invalid value while submitting transaction", async function () {
    await expect(
      this.MultiSigWallet.submitTransaction(owners[0], { value: 0 })
    ).to.be.revertedWith("Transfer amount must be grater than 0 ");
  });

  it("Should submit transaction", async function () {
    const transaction = await this.MultiSigWallet.submitTransaction(owners[0], {
      value: 1000,
    });
    expect(transaction)
      .to.emit(this.MultiSigWallet, "Submission")
      .withArgs(0, owners[0], 1000, owners[0]);
  });
   
  it("Should return invalid transaction id while confirming transaction", async function () {
    const invalidTransactionId = 100;
    await expect(
      this.MultiSigWallet.confirmTransaction(invalidTransactionId)
    ).to.be.revertedWith("Invalid transaction");
  });

  it("Should not confirm transaction if already confirmed", async function () {
    await this.MultiSigWallet.submitTransaction(owners[0], { value: 1000 });
    await this.MultiSigWallet.confirmTransaction(0);
    await expect(
      this.MultiSigWallet.confirmTransaction(0)
    ).to.be.revertedWith("Transaction is already confirm by owner");
  });

  it("Should return invalid transaction id while checking transaction", async function () {
    const invalidTransactionId = 100;
    await expect(
      this.MultiSigWallet.isTransactionConfirmed(invalidTransactionId)
    ).to.be.revertedWith("Invalid transaction");
  });

  it("Should check if the transaction is confirmed", async function () {
    await this.MultiSigWallet.submitTransaction(owners[0], { value: 1000 });
    await this.MultiSigWallet.confirmTransaction(0);
    expect(await this.MultiSigWallet.isTransactionConfirmed(0)).to.be.false;
  });

  it("Should return invalid transaction id while executing transaction", async function () {
    const invalidTransactionId = 100;
    await expect(
      this.MultiSigWallet.executeTransaction(invalidTransactionId)
    ).to.be.revertedWith("Invalid transaction");
  });

  it("Should not execute transaction if already executed", async function () {
    await this.MultiSigWallet.submitTransaction(owners[0], { value: 1000 });
    await this.MultiSigWallet.confirmTransaction(0);
    await this.MultiSigWallet.executeTransaction(0);
    await expect(
      this.MultiSigWallet.executeTransaction(0)
    ).to.be.revertedWith("Transaction is already executed");
  });


  // it should confirm the transaction
  it("Should confirm the transaction", async function () {
    await this.MultiSigWallet.submitTransaction(owners[0], { value: 1000 });
    await this.MultiSigWallet.connect(await ethers.getSigner(owners[0])).confirmTransaction(0);
    await this.MultiSigWallet.connect(await ethers.getSigner(owners[1])).confirmTransaction(0);
    await this.MultiSigWallet.connect(await ethers.getSigner(owners[2])).confirmTransaction(0);
    expect(await this.MultiSigWallet.isTransactionConfirmed(0)).to.be.true;
  });

});
