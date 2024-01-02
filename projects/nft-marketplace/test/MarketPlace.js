const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");
const hre = require("hardhat");

describe("MarketPlace", async function () {
  // deploy erc20 contract in beforeEach
  const NAME = "SimpleERC20";
  const SYMBOL = "ERC20";
  const INITIAL_SUPPLY = "1000000000000000000000000"; // 1M tokens with 18 decimals
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  beforeEach(async function () {
    this.accounts = await ethers.getSigners();
    const marketPlace = await hre.ethers.getContractFactory("MarketPlace");
    this.marketPlaceContract = await marketPlace.deploy();
    // deploy NFT contract
    const nft = await hre.ethers.getContractFactory("SimpleERC721");
    this.nftContract = await nft.deploy();
    // deploy erc20 contract
    const erc20 = await ethers.getContractFactory("SimpleERC20");
    this.erc20Contract = await erc20.deploy(NAME, SYMBOL, INITIAL_SUPPLY);
  });

  it("should set admin address", async function () {
    await this.marketPlaceContract.setAdminAddress(this.accounts[0].address);
    expect(await this.marketPlaceContract._adminAddress()).to.equal(
      this.accounts[0].address
    );
  });

  it("should not set admin address if not admin", async function () {
    await expect(
      this.marketPlaceContract
        .connect(this.accounts[1])
        .setAdminAddress(this.accounts[0].address)
    ).to.be.revertedWith("Caller is not a admin");
  });
  it("should not set an empty address as admin", async function () {
    await expect(
      this.marketPlaceContract.setAdminAddress(
        "0x0000000000000000000000000000000000000000"
      )
    ).to.be.revertedWith("Admin Wallet cannot be empty address");
  });

  it("should get current order id", async function () {
    expect(await this.marketPlaceContract.getCurrentOrderId()).to.equal(0);
  });

  it("should get current bid id", async function () {
    expect(await this.marketPlaceContract.getCurrentBidId()).to.equal(0);
  });
  it("should set pause status", async function () {
    await this.marketPlaceContract.setPauseStatus(true);
    expect(await this.marketPlaceContract.paused()).to.equal(true);
  });
  it("should not set pause status if not admin", async function () {
    await expect(
      this.marketPlaceContract.connect(this.accounts[1]).setPauseStatus(true)
    ).to.be.revertedWith("Caller is not a admin");
  });

  it("should pause and unpause the contract", async function () {
    await this.marketPlaceContract.setPauseStatus(true);
    expect(await this.marketPlaceContract.paused()).to.equal(true);
    await this.marketPlaceContract.setPauseStatus(false);
    expect(await this.marketPlaceContract.paused()).to.equal(false);
  });

  it("should set commission percentage", async function () {
    // set commission percentage and check if it is set by getting event
    await this.marketPlaceContract.setCommissionPercentage(10);
    expect(await this.marketPlaceContract.getCommissionPercentage()).to.equal(
      10
    );
  });

  // it should nopt set commission percentage if not admin
  it("should not set commission percentage if not admin", async function () {
    await expect(
      this.marketPlaceContract.connect(this.accounts[1]).setCommissionPercentage(10)
    ).to.be.revertedWith("Caller is not a admin");
  });

  // it should update currency
  it("should update currency", async function () {
    await this.marketPlaceContract.updateCurrency(
      "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
      true
    );
  });

  // it should not update currency if not admin

  it("should not update currency if not admin", async function () {
    await expect(
      this.marketPlaceContract
        .connect(this.accounts[1])
        .updateCurrency("0x88c6c46ebf353a52bdbab708c23d0c81daa8134a", true)
    ).to.be.revertedWith("Caller is not a admin");
  });

  // it should update nft contract address
  it("should update nft contract address", async function () {
    await this.marketPlaceContract.updateNFTContract(
      "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
      true
    );
  });

  // it should not update nft contract address if not admin
  it("should not update nft contract address if not admin", async function () {
    await expect(
      this.marketPlaceContract
        .connect(this.accounts[1])
        .updateNFTContract("0x88c6c46ebf353a52bdbab708c23d0c81daa8134a", true)
    ).to.be.revertedWith("Caller is not a admin");
  });

  // it should not set order if NFT is not approved by admin
  it("should not set order if NFT is not approved by admin", async function () {
    await expect(
      this.marketPlaceContract.setOrder(
        "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
        1,
        "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
        1,
        1
      )
    ).to.be.revertedWith("NFT is not approved by admin");
  });

  // it should not set order if currency is not approved by admin

  it("should not set order if currency is not approved by admin", async function () {
    await this.marketPlaceContract.updateNFTContract(
      "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
      true
    );
    await expect(
      this.marketPlaceContract.setOrder(
        "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
        1,
        "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
        1,
        1
      )
    ).to.be.revertedWith("Currency is not approved by admin");
  });

  // it should not set order if askAmount is zero
  it("should not set order if askAmount is zero", async function () {
    await this.marketPlaceContract.updateNFTContract(
      "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
      true
    );
    await this.marketPlaceContract.updateCurrency(
      "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
      true
    );
    await expect(
      this.marketPlaceContract.setOrder(
        "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
        1,
        "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
        0,
        1
      )
    ).to.be.revertedWith("Ask Amount Cannot be Zero");
  });

  // it should not set order if expiry date is less than current date

  it("should not set order if expiry date is less than current date", async function () {
    await this.marketPlaceContract.updateNFTContract(
      "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
      true
    );
    await this.marketPlaceContract.updateCurrency(
      "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
      true
    );
    await expect(
      this.marketPlaceContract.setOrder(
        "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
        1,
        "0x88c6c46ebf353a52bdbab708c23d0c81daa8134a",
        1,
        1
      )
    ).to.be.revertedWith("Expiry Time cannot be in Past");
  });

  //  it should set order
  it("should set order", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // get order
    const order = await this.marketPlaceContract.getOrder(1);
    expect(order[0]).to.equal(1);
  });

  // it should not set order if user is not owner of NFT
  it("should not set order if user is not owner of NFT", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[1].address, 1, "");
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await expect(
      this.marketPlaceContract.setOrder(
        this.nftContract.target,
        1,
        this.erc20Contract.target,
        1,
        1704249344
      )
    ).to.be.revertedWith("You are not owner of Token Id");
  });

  // it should not set order if NFT is not approved by user

  it("should not set order if NFT is not approved by user", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await expect(
      this.marketPlaceContract.setOrder(
        this.nftContract.target,
        1,
        this.erc20Contract.target,
        1,
        1704249344
      )
    ).to.be.revertedWith("Market Contract is not allowed to manage this Token ID");
  });

  // it should cancel order
  it("should cancel order", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // cancel order
   let tx = await this.marketPlaceContract.cancelOrder(1);
    // get order
    const order = await this.marketPlaceContract.getOrder(1);
    expect(order[8]).to.equal(2);  
   
  });

  // it should not cancel order if order is not present
  it("should not cancel order if order is not present", async function () {
    // cancel order
    await expect(
      this.marketPlaceContract.cancelOrder(1)
    ).to.be.revertedWith("Invalid Order Id");
  });

  // it should not cancel order if order status is not open
  it("should not cancel order if order status is not open", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // cancel order
    await this.marketPlaceContract.cancelOrder(1);
    // cancel order
    await expect(
      this.marketPlaceContract.cancelOrder(1)
    ).to.be.revertedWith("Order status is not Open");
  });

  // it should not cancel order if user is not owner of NFT

  it("should not cancel order if user is not owner of NFT", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // cancel order
    // connect with second account
    await expect(
      this.marketPlaceContract
        .connect(this.accounts[1])
        .cancelOrder(1)
    ).to.be.revertedWith("You Don't have right to cancel order");
  });

  // it should complete order

  it("should complete order", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // approve erc20 contract
    await this.erc20Contract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // complete order
    await this.marketPlaceContract.completeOrder(1);
    // get order
    const order = await this.marketPlaceContract.getOrder(1);
    expect(order[8]).to.equal(0);
  });

  // it should not complete order if order is not present
  it("should not complete order if order is not present", async function () {
    // complete order
    await expect(
      this.marketPlaceContract.completeOrder(1)
    ).to.be.revertedWith("Invalid Order Id");
  });

  // it should not complete order if order status is not open
  it("should not complete order if order status is not open", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // approve erc20 contract
    await this.erc20Contract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // complete order
    await this.marketPlaceContract.completeOrder(1);
    // complete order
    await expect(
      this.marketPlaceContract.completeOrder(1)
    ).to.be.revertedWith("Order status is not Open");
  });

  // it should get bid
  it("should get bid", async function () {
    const bid = await this.marketPlaceContract.getBid(1);
    expect(bid[0]).to.equal(0);
  });

  // it should add bid
  it("should add bid", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // approve erc20 contract
    await this.erc20Contract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // send amount to second account
    await this.erc20Contract.transfer(this.accounts[1].address, 100);
    // approve erc20 contract
    await this.erc20Contract.connect(this.accounts[1]).approve(this.marketPlaceContract.target, 1);
    // add bid from second account
    await this.marketPlaceContract.connect(this.accounts[1]).addBid(this.nftContract.target, 1,this.erc20Contract.target, 1, 1704249344);
    // get bid
    const bid = await this.marketPlaceContract.getBid(1);
    expect(bid[0]).to.equal(1);
  });

  // it should cancel bid
  it("should cancel bid", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // approve erc20 contract
    await this.erc20Contract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // send amount to second account
    await this.erc20Contract.transfer(this.accounts[1].address, 100);
    // approve erc20 contract
    await this.erc20Contract.connect(this.accounts[1]).approve(this.marketPlaceContract.target, 1);
    // add bid from second account
    await this.marketPlaceContract.connect(this.accounts[1]).addBid(this.nftContract.target, 1,this.erc20Contract.target, 1, 1704249344);
    // cancel bid
    await this.marketPlaceContract.cancelBid(1);
    // get bid
    const bid = await this.marketPlaceContract.getBid(1);
    expect(bid[0]).to.equal(1);
  });

  // it should not cancel bid if bid is not present
  it("should not cancel bid if bid is not present", async function () {
    // cancel bid
    await expect(
      this.marketPlaceContract.cancelBid(1)
    ).to.be.revertedWith("Invalid Bid Id");
  });

  // it should not cancel bid if bid status is not open
  it("should not cancel bid if bid status is not open", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // approve erc20 contract
    await this.erc20Contract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // send amount to second account
    await this.erc20Contract.transfer(this.accounts[1].address, 100);
    // approve erc20 contract
    await this.erc20Contract.connect(this.accounts[1]).approve(this.marketPlaceContract.target, 1);
    // add bid from second account
    await this.marketPlaceContract.connect(this.accounts[1]).addBid(this.nftContract.target, 1,this.erc20Contract.target, 1, 1704249344);
    // cancel bid
    await this.marketPlaceContract.cancelBid(1);
    // cancel bid
    await expect(
      this.marketPlaceContract.cancelBid(1)
    ).to.be.revertedWith("Bid status is not Open");
  });

  // it should not cancel bid if user is not owner of NFT
  it("should not cancel bid if user is not owner of NFT", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.connect(this.accounts[0]).approve(this.marketPlaceContract.target, 1);
    // approve erc20 contract
    await this.erc20Contract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // send amount to second account
    await this.erc20Contract.transfer(this.accounts[1].address, 100);
    // approve erc20 contract
    await this.erc20Contract.connect(this.accounts[1]).approve(this.marketPlaceContract.target, 1);
    // add bid from second account
    await this.marketPlaceContract.connect(this.accounts[1]).addBid(this.nftContract.target, 1,this.erc20Contract.target, 1, 1704249344);
    // cancel bid
    // connect with second account
    await expect(
      this.marketPlaceContract
        .connect(this.accounts[2])
        .cancelBid(1)
    ).to.be.revertedWith("You Don't have right to cancel order");
  });

  // it should accept bid
  it("should accept bid", async function () {
    // mint nft token id 1
    await this.nftContract.safeMint(this.accounts[0].address, 1, "");
    // approve nft contract
    await this.nftContract.approve(this.marketPlaceContract.target, 1);
    // approve erc20 contract
    await this.erc20Contract.approve(this.marketPlaceContract.target, 1);
    // update nft contract
    await this.marketPlaceContract.updateNFTContract(
      this.nftContract.target,
      true
    );
    // update currency
    await this.marketPlaceContract.updateCurrency(
      this.erc20Contract.target,
      true
    );
    // set order
    await this.marketPlaceContract.setOrder(
      this.nftContract.target,
      1,
      this.erc20Contract.target,
      1,
      1704249344
    );
    // send amount to second account
    await this.erc20Contract.transfer(this.accounts[1].address, 100);
    // approve erc20 contract
    await this.erc20Contract.connect(this.accounts[1]).approve(this.marketPlaceContract.target, 1);
    // add bid from second account
    await this.marketPlaceContract.connect(this.accounts[1]).addBid(this.nftContract.target, 1,this.erc20Contract.target, 1, 1704249344);
    // accept bid
    await this.marketPlaceContract.acceptBid(1);
    // get bid
    const bid = await this.marketPlaceContract.getBid(1);
    expect(bid[0]).to.equal(1);
  });

  
  // it should not accept bid if bid is not present
  it("should not accept bid if bid is not present", async function () {
    // accept bid
    await expect(
      this.marketPlaceContract.acceptBid(1)
    ).to.be.revertedWith("Invalid Order Id");
  });
});
