const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BN } = require('@openzeppelin/test-helpers');
describe("SimpleERC721", function () {
  beforeEach(async function () { 
    const SimpleERC721 = await ethers.getContractFactory("SimpleERC721");
    this.simpleERC721 = await SimpleERC721.deploy();
  });

  it("Should return token uri", async function () {
    await this.simpleERC721.safeMint(this.simpleERC721.runner.address,1,"https://ipfs.io/ipfs/QmZPb8Z4r6Zk6YJZd5qg9kZs6Yt7c8E3h2i1QK3Q8L4v9A");
    expect(await this.simpleERC721.tokenURI(1)).to.equal("https://ipfs.io/ipfs/QmZPb8Z4r6Zk6YJZd5qg9kZs6Yt7c8E3h2i1QK3Q8L4v9A");
  });

  it("Should return the token interface", async function () {
    expect(await this.simpleERC721.supportsInterface("0xffffffff")).to.equal(false);
  });


});
