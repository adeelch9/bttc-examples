const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("HelloWorld", function () {

  it("Should return the  greeting", async function () {
    const Greeter = await ethers.getContractFactory("HelloWorld");
    const greeter = await Greeter.deploy();
    expect(await greeter.getGreeting()).to.equal("Hello World!");
  });
});
