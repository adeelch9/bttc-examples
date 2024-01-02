const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BN } = require('@openzeppelin/test-helpers');
describe("SimpleERC20", function () {
 // deploy erc20 contract in beforeEach
   const NAME = "SimpleERC20";
    const SYMBOL = "ERC20";
    const INITIAL_SUPPLY = '1000000000000000000000000'; // 1M tokens with 18 decimals
  beforeEach(async function () { 
    const SimpleERC20 = await ethers.getContractFactory("SimpleERC20");
    this.simpleERC20 = await SimpleERC20.deploy(NAME, SYMBOL, INITIAL_SUPPLY);
  });

  it("Should return the name", async function () {
    expect(await this.simpleERC20.name()).to.equal(NAME);
  });

  it("Should return the symbol", async function () {
    expect(await this.simpleERC20.symbol()).to.equal(SYMBOL);
  });

  it("Should return the decimals", async function () {
    expect(await this.simpleERC20.decimals()).to.equal(18);
  });

});
