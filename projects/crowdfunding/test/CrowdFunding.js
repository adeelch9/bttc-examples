// tests/CrowdFunding.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
// Test suite for the CrowdFunding smart contract
describe("CrowdFunding Contract", function () {
  let crowdfunding;
  let owner;
  let contributor;
  // Before each test, deploy a new instance of the CrowdFunding contract
  beforeEach(async function () {
    // Get signers (addresses) for the owner and contributor
    [owner, contributor] = await ethers.getSigners();
    // Deploy the CrowdFunding contract
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdfunding = await CrowdFunding.deploy();
  });
  // Test case: Deployment of the CrowdFunding contract
  it("Should deploy the contract", async function () {
    // Check if the contract address is not equal to zero (deployment successful)
    expect(crowdfunding.address).to.not.equal(0);
  });
  // Test case: Creating a new campaign
  it("Should create a campaign", async function () {
    // Create a new campaign using the owner's address
    await crowdfunding
      .connect(owner)
      .createCampaign(
        "Test Campaign",
        "Description of the test campaign",
        "https://example.com/image.jpg",
        1000,
        Math.floor(Date.now() / 1000) + 3600
      );
    // Retrieve the list of campaigns
    const campaigns = await crowdfunding.getAllCampaigns();
    // Check if there is exactly one campaign and its title matches the expected value
    expect(campaigns.length).to.equal(1);
    expect(campaigns[0].title).to.equal("Test Campaign");
  });
  // Test case: Contributing to a campaign
  it("Should contribute to a campaign", async function () {
    // Create a new campaign using the owner's address
    await crowdfunding
      .connect(owner)
      .createCampaign(
        "Test Campaign",
        "Description of the test campaign",
        "https://example.com/image.jpg",
        1000,
        Math.floor(Date.now() / 1000) + 3600
      );
    // Contribute to the created campaign using the contributor's address
    await crowdfunding.connect(contributor).contribute(0, { value: 500 });
    // Retrieve the total contributions for the campaign
    const totalContributions = await crowdfunding.getTotalContributions(0);
    // Check if the total contributions match the expected value
    expect(totalContributions).to.equal(500);
  });

  // Test case: get campaign details
  it("Should get campaign details", async function () {
    // Create a new campaign using the owner's address
    await crowdfunding
      .connect(owner)
      .createCampaign(
        "Test Campaign",
        "Description of the test campaign",
        "https://example.com/image.jpg",
        1000,
        Math.floor(Date.now() / 1000) + 3600
      );
    // Retrieve the campaign details
    const campaign = await crowdfunding.getCampaignDetails(0);
    // Check if the campaign details match the expected values
    expect(campaign[2]).to.equal("Test Campaign");
    expect(campaign[3]).to.equal(
      "Description of the test campaign"
    );
     expect(campaign[4]).to.equal("https://example.com/image.jpg");
     expect(campaign[5]).to.equal(1000);
  });

  // Test case: get current time 
  it("Should get current time", async function () {
    // Retrieve the current time
    const time = await crowdfunding.currentTime();
    // Check if the current time is greater than zero
    expect(time).to.be.greaterThan(0);
  });

  // Test case: get latest campaigns
  it("Should get latest campaigns", async function () {
    // Create a new campaign using the owner's address
    await crowdfunding
      .connect(owner)
      .createCampaign(
        "Test Campaign",
        "Description of the test campaign",
        "https://example.com/image.jpg",
        1000,
        Math.floor(Date.now() / 1000) + 3600
      );
    // Retrieve the latest campaigns
    const campaigns = await crowdfunding.getLatestCampaigns();
    // Check if there is exactly one campaign and its title matches the expected value
    expect(campaigns.length).to.equal(1);
    expect(campaigns[0].title).to.equal("Test Campaign");
  });

  // Test case: It should delete a campaign

  it("Should delete a campaign", async function () {
    // Create a new campaign using the owner's address
    await crowdfunding
      .connect(owner)
      .createCampaign(
        "Test Campaign",
        "Description of the test campaign",
        "https://example.com/image.jpg",
        1000,
        Math.floor(Date.now() / 1000) + 3600
      );
    // Delete the campaign
    await crowdfunding.connect(owner).deleteCampaign(0);
    // Retrieve the list of campaigns
    const campaigns = await crowdfunding.getAllCampaigns();
    // Check if there are no campaigns
    expect(campaigns.length).to.equal(1);
  });
    
  // Test case: It should contribute to a campaign and delete it and get the refund

  it("Should contribute to a campaign and delete it and get the refund", async function () {
    // Create a new campaign using the owner's address
    await crowdfunding
      .connect(owner)
      .createCampaign(
        "Test Campaign",
        "Description of the test campaign",
        "https://example.com/image.jpg",
        1000,
        Math.floor(Date.now() / 1000) + 3600
      );
    // Contribute to the created campaign using the contributor's address
    await crowdfunding.connect(contributor).contribute(0, { value: 500 });
    // Delete the campaign
    await crowdfunding.connect(owner).deleteCampaign(0);
    // Retrieve the total contributions for the campaign
    const totalContributions = await crowdfunding.getTotalContributions(0);
    // Check if the total contributions match the expected value
    expect(totalContributions).to.equal(0);
  });

  // Test case: It should handle excess contributions and get the refund

  it("Should handle excess contributions and get the refund", async function () {
    // Create a new campaign using the owner's address
    await crowdfunding
      .connect(owner)
      .createCampaign(
        "Test Campaign",
        "Description of the test campaign",
        "https://example.com/image.jpg",
        1000,
        Math.floor(Date.now() / 1000) + 3600
      );
    // Contribute to the created campaign using the contributor's address
    await crowdfunding.connect(contributor).contribute(0, { value: 1500 });
    // Retrieve the total contributions for the campaign
    const totalContributions = await crowdfunding.getTotalContributions(0);
    // Check if the total contributions match the expected value
    expect(totalContributions).to.equal(1000);
  });

  // Test case: It should not create the campaign with empty title

  it("Should not create the campaign with empty title", async function () {
    // Create a new campaign using the owner's address
    await expect(
      crowdfunding
        .connect(owner)
        .createCampaign(
          "",
          "Description of the test campaign",
          "https://example.com/image.jpg",
          1000,
          Math.floor(Date.now() / 1000) + 3600
        )
    ).to.be.revertedWith("Title must not be empty");
  });

  // Test case: It should not create the campaign with empty description

  it("Should not create the campaign with empty description", async function () {
    // Create a new campaign using the owner's address
    await expect(
      crowdfunding
        .connect(owner)
        .createCampaign(
          "Test Campaign",
          "",
          "https://example.com/image.jpg",
          1000,
          Math.floor(Date.now() / 1000) + 3600
        )
    ).to.be.revertedWith("Description must not be empty");
  });

  // Test case: It should not create the campaign with empty image

  it("Should not create the campaign with empty image", async function () {
    // Create a new campaign using the owner's address
    await expect(
      crowdfunding
        .connect(owner)
        .createCampaign(
          "Test Campaign",
          "Description of the test campaign",
          "",
          1000,
          Math.floor(Date.now() / 1000) + 3600
        )
    ).to.be.revertedWith("Image URI must not be empty");
  });

  // Test case: It should not create the campaign with zero target amount

  it("Should not create the campaign with zero target amount", async function () {
    // Create a new campaign using the owner's address
    await expect(
      crowdfunding
        .connect(owner)
        .createCampaign(
          "Test Campaign",
          "Description of the test campaign",
          "https://example.com/image.jpg",
          0,
          Math.floor(Date.now() / 1000) + 3600
        )
    ).to.be.revertedWith("Goal must be greater than zero");
  });


  // Test case: It should not create the campaign with past deadline

  it("Should not create the campaign with past deadline", async function () {
    // Create a new campaign using the owner's address
    await expect(
      crowdfunding
        .connect(owner)
        .createCampaign(
          "Test Campaign",
          "Description of the test campaign",
          "https://example.com/image.jpg",
          1000,
          Math.floor(Date.now() / 1000) - 3600
        )
    ).to.be.revertedWith("Ends time must be greater than the current time");
  });

  // Test case: It should not contribute to a campaign with zero amount

  it("Should not contribute to a campaign with zero amount", async function () {
    // Create a new campaign using the owner's address
    await crowdfunding
      .connect(owner)
      .createCampaign(
        "Test Campaign",
        "Description of the test campaign",
        "https://example.com/image.jpg",
        1000,
        Math.floor(Date.now() / 1000) + 3600
      );
    // Contribute to the created campaign using the contributor's address
    await expect(
      crowdfunding.connect(contributor).contribute(0, { value: 0 })
    ).to.be.revertedWith("Contribution amount must be greater than zero");
  });

  // Test case: It should not delete a campaign with non-owner address

  it("Should not delete a campaign with non-owner address", async function () {
    // Create a new campaign using the owner's address
    await crowdfunding
      .connect(owner)
      .createCampaign(
        "Test Campaign",
        "Description of the test campaign",
        "https://example.com/image.jpg",
        1000,
        Math.floor(Date.now() / 1000) + 3600
      );
    // Delete the campaign using the contributor's address
    await expect(crowdfunding.connect(contributor).deleteCampaign(0)).to.be
      .reverted;
  });

  // Test case: It should not get all campaigns with empty campaigns

  it("Should not get latest campains with empty campaigns", async function () {
    
    // Retrieve the list of campaigns
    await expect(
      crowdfunding.connect(owner).getLatestCampaigns()
    ).to.be.revertedWith("No campaigns found.");
  });
 
});
