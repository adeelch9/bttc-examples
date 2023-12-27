// contracts/Crowdfunding.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrowdFunding {
    // Address of the contract owner
    address private immutable owner;

    // Counter for generating campaign IDs
    uint private nextId = 1;

    // Array to store campaign information
    Campaign[] public campaigns;

    // Flag to prevent reentrant calls
    bool private locked;

    // Modifier to prevent reentrant calls
    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    // Struct to define the structure of a crowdfunding campaign
    struct Campaign {
        uint id;
        address campaignCreator;
        string title;
        string description;
        string imageURI;
        uint goal;
        uint startsAt;
        uint endsAt;
        STATUS status;
        uint totalContributions;
        address[] contributors;
        uint[] contributionAmounts;
    }

    // Enum representing the status of a campaign
    enum STATUS {
        ACTIVE,
        DELETED,
        SUCCESSFUL,
        UNSUCCEEDED
    }

    // Events to log important activities
    event CampaignCreated(uint indexed campaignId, address campaignCreator, string title, STATUS status);
    event CampaignDeleted(uint indexed campaignId, address campaignCreator, STATUS status);
    event ContributionMade(uint indexed campaignId, address contributor, uint amount);
    event RefundMade(uint indexed campaignId, address contributor, uint amount);

    constructor() {
        owner = msg.sender;
    }

    // Function to create a new crowdfunding campaign
    function createCampaign(
        string memory title,
        string memory description,
        string memory imageURI,
        uint goal,
        uint endsAt
    ) public {
        // Validation checks for input parameters
        require(bytes(title).length > 0, 'Title must not be empty');
        require(bytes(description).length > 0, 'Description must not be empty');
        require(bytes(imageURI).length > 0, 'Image URI must not be empty');
        require(goal > 0, 'Goal must be greater than zero');
        require(endsAt > block.timestamp, 'Ends time must be greater than the current time');

        // Create a new campaign and add it to the array
        campaigns.push(Campaign(
            nextId++,
            msg.sender,
            title,
            description,
            imageURI,
            goal,
            block.timestamp,
            endsAt,
            STATUS.ACTIVE,
            0,
            new address[](0),
            new uint[](0)
        ));

        // Emit an event to log the creation of the campaign
        emit CampaignCreated(nextId - 1, msg.sender, title, STATUS.ACTIVE);
    }

    // Function to allow contributors to contribute funds to a campaign
    function contribute(uint campaignId) public payable nonReentrant {
        // Retrieve the campaign based on the campaign ID
        Campaign storage campaign = campaigns[campaignId];

        // Validation check for contribution amount
        require(msg.value > 0, 'Contribution amount must be greater than zero');

        // Calculate the remaining funds needed to reach the campaign goal
        uint remainingFundsNeeded = campaign.goal - campaign.totalContributions;

        // Handle contributions based on the remaining funds needed
        if (msg.value <= remainingFundsNeeded) {
            campaign.totalContributions += msg.value;
        } else {
            // Handle excess contributions and refunds
            uint excessAmount = msg.value - remainingFundsNeeded;
            uint refundedAmount = msg.value - excessAmount;

            // Refund the excess amount to the contributor
            payable(msg.sender).transfer(excessAmount);

            // Update the total contributions with the refunded amount
            campaign.totalContributions += refundedAmount;

            // Mark the campaign as successful if the goal is reached
            if (campaign.totalContributions >= campaign.goal) {
                campaign.status = STATUS.SUCCESSFUL;
            }
        }

        // Record the contributor and contribution amount
        campaign.contributors.push(msg.sender);
        campaign.contributionAmounts.push(msg.value);

        // Emit an event to log the contribution
        emit ContributionMade(campaignId, msg.sender, msg.value);
    }

    // Function to allow the campaign creator to delete a campaign
    function deleteCampaign(uint campaignId) public {
        // Retrieve the campaign based on the campaign ID
        Campaign storage campaign = campaigns[campaignId];

        // Validation check: Only the campaign creator can delete the campaign
        require(campaign.campaignCreator == msg.sender);

        // Refund contributors when the campaign is deleted
        refund(campaignId);

        // Mark the campaign as deleted
        campaign.status = STATUS.DELETED;

        // Emit an event to log the deletion of the campaign
        emit CampaignDeleted(campaignId, msg.sender, STATUS.DELETED);
    }

    // Internal function to refund contributions when a campaign is deleted
    function refund(uint campaignId) internal {
        // Retrieve the campaign based on the campaign ID
        Campaign storage campaign = campaigns[campaignId];

        // Iterate through contributors and refund their contributions
        for (uint i = 0; i < campaign.contributors.length; i++) {
            address contributor = campaign.contributors[i];
            uint contributionAmount = campaign.contributionAmounts[i];

            // Refund the contribution amount to the contributor
            payable(contributor).transfer(contributionAmount);

            // Update the total contributions
            campaign.totalContributions -= contributionAmount;
        }
    }

    // Function to retrieve information about all campaigns
    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    // Function to retrieve detailed information about a specific campaign
    function getCampaignDetails(uint campaignId) public view returns (
        uint id,
        address campaignCreator,
        string memory title,
        string memory description,
        string memory imageURI,
        uint goal,
        uint startsAt,
        uint endsAt,
        STATUS status,
        uint totalContributions,
        address[] memory contributors,
        uint[] memory contributionAmounts
    ) {
        Campaign memory campaign = campaigns[campaignId];
        return (
            campaign.id,
            campaign.campaignCreator,
            campaign.title,
            campaign.description,
            campaign.imageURI,
            campaign.goal,
            campaign.startsAt,
            campaign.endsAt,
            campaign.status,
            campaign.totalContributions,
            campaign.contributors,
            campaign.contributionAmounts
        );
    }

    // Function to retrieve the total contributions for a specific campaign
    function getTotalContributions(uint campaignId) public view returns (uint) {
        return campaigns[campaignId].totalContributions;
    }

    // Function to retrieve the current time
    function currentTime() public view returns (uint) {
        return (block.timestamp * 1000) + 1000;
    }

    // Function to retrieve the latest campaigns (up to the latest 4 campaigns)
    function getLatestCampaigns() public view returns (Campaign[] memory) {
        require(campaigns.length > 0, "No campaigns found.");

        // Determine the start index based on the number of campaigns
        uint startIndex = campaigns.length > 4 ? campaigns.length - 4 : 0;
        uint latestCampaignsCount = campaigns.length - startIndex;

        // Create an array for the latest campaigns
        Campaign[] memory latestCampaigns = new Campaign[](latestCampaignsCount);
    
        // Populate the array with the latest campaigns
        for (uint i = 0; i < latestCampaignsCount; i++) {
            latestCampaigns[i] = campaigns[campaigns.length - 1 - i];
        }

        return latestCampaigns;
    }
}