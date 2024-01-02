# CrowdFunding Contract

## Description

A crowd funding smartcontract that manages crowdfunding campaigns and contributions

## How To Use

The contract has the following struct and variables that will be used in the contract to manage campaigns

```solidity
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

```

Contract has following events which will be emitted on their respective event time.

```solidity
   // Events to log important activities
    event CampaignCreated(uint indexed campaignId, address campaignCreator, string title, STATUS status);

    event CampaignDeleted(uint indexed campaignId, address campaignCreator, STATUS status);

    event ContributionMade(uint indexed campaignId, address contributor, uint amount);

    event RefundMade(uint indexed campaignId, address contributor, uint amount);

```

## Contract functions

A campaign is created in the contract by calling `createCampaign` function

```solidity
   // Function to create a new crowdfunding campaign
   // @param title string title of campaign
   // @param description string description of campaign
   // @param imageURI string imageURI of campaign
   // @param goal uint amount to get in the funding
   // @param endsAt uint deadline timestamp of funding

    function createCampaign(
        string memory title,
        string memory description,
        string memory imageURI,
        uint goal,
        uint endsAt
    ) public
```

`contribute` adds the contributed fund in the contract

```solidity
// @param campaignId uint id of the campaign
function contribute(uint campaignId) public payable nonReentrant
```

`deleteCampaign` Function to allow the campaign creator to delete a campaign

```solidity
 // @param campaignId uint id of the campaign 
    function deleteCampaign(uint campaignId) public
```
`refund` Internal function to refund contributions when a campaign is deleted

```solidity
 // @param campaignId uint id of the campaign  
    function refund(uint campaignId) internal 
```

`getAllCampaigns`  Function to retrieve information about all campaigns

```solidity
function getAllCampaigns() public view returns (Campaign[] memory)
```
`getCampaignDetails` function to retrieve detailed information about a specific campaign

```solidity
 // @param campaignId uint id of the campaign  
function getCampaignDetails(uint campaignId) public view returns
```

`getTotalContributions` Function to retrieve the total contributions for a specific campaign

```solidity
 // @param campaignId uint id of the campaign  
function getTotalContributions(uint campaignId) public view returns 
```

`getTotalContributions` Function to retrieve the latest campaigns (up to the latest 4 campaigns)
    

```solidity
function getLatestCampaigns() public view returns (Campaign[] memory) 
```