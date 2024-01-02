# MarketPlace Contract

## Description

A contract for a basic marketplace for Non-Fungible Tokens
(NFTs), covering aspects of ERC-721 standard, auction mechanisms, and
transaction fees
## How To Use

The contract has the following struct and variables that will be used in the contract 

```solidity
  using SafeERC20 for IERC20;
  uint256 private _orderIds;
  uint256 private _bidIds;

    address public _adminAddress = 0xAbb590532A0FA89F0DAB20f3C121712957A7976D; //  VAULT ADDRESS For Commission

    // To store commission percentage for each mint
    uint8 private _adminCommissionPercentage = 25;

    // Mapping from token to the current ask for the token
    mapping(uint256 => IUtils.Order) private _orders;

    // Mapping from token to the current ask for the token
    mapping(uint256 => IUtils.Bid) private _bids;

    mapping(address => bool) public approvedCurrency;

    mapping(address => bool) public approvedNfts;


    uint256 private constant EXPO = 1e18;

    uint256 private constant BASE = 1000 * EXPO;

```

## Contract functions

`constructor` function assigns the admin role to the deployer wallet address

```solidity
constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }
```

`setAdminAddress()` updates Admin wallet where all commission will go.

```solidity
// @param _newAdminWallet new admin wallet address
    function setAdminAddress(address _newAdminWallet) external override returns 
```

`getCurrentOrderId()` returns the current order id

```solidity
function getCurrentOrderId() public view returns (uint256) 
```
`getCurrentBidId()` returns the current bid id

```solidity
function getCurrentBidId() public view returns (uint256) 
```

`setPauseStatus()` updates the contract pause status

```solidity
function setPauseStatus(bool _pauseStatus)
        external
        returns (bool)
```

`setCommissionPercentage()` updates the commission percentage of the admin

```solidity
// @param _commissionPercentage new percentage
  function setCommissionPercentage(uint8 _commissionPercentage)
        external
        override
        returns (bool)
```

`updateCurrency()` updates the currency which is accepted for bidding 

```solidity
// @param _tokenAddress new token address to accept as payment
// @param _status token status 
 function updateCurrency(address _tokenAddress, bool _status) external override returns (bool)
```

`updateNFTContract()` adds the new NFT in the marketplace

```solidity
// @param _tokenAddress new NFT address to add in the marketplace
// @param _status token status 
    function updateNFTContract(address _tokenAddress, bool _status) external override returns (bool)
```

`getCommissionPercentage()` returns the current commission percentage of admin

```solidity
function getCommissionPercentage()
        external
        view
        override
        returns (uint8)
```

`getOrder()` returns order info 

```solidity
// @param _orderId 
 function getOrder(uint256 _orderId)
        external
        override
        view
        returns (IUtils.Order memory) {
            return _orders[_orderId];
    }
```

`cancelOrder()` cancels order  

```solidity
// @param _orderId 
 function cancelOrder(uint256 _orderId)
        whenNotPaused
        external
        override
        returns (bool)
```

`completeOrder()` completes order and transfers the nft to the user and token to the seller 

```solidity
// @param _orderId 
  function completeOrder(uint256 _orderId)
        whenNotPaused
        external
        override
        returns (bool)
```

`getBid()` returns bid id 

```solidity
// @param _bidId 
  function getBid(uint256 _bidId)
        external
        override
        view
        returns (IUtils.Bid memory) {
            return _bids[_bidId];
    }
```


`cancelBid()` cancels bid  

```solidity
// @param _bidId 
function cancelBid(uint256 _bidId)
        whenNotPaused
        external
        override
        returns (bool) 
```

`acceptBid()` accepts bid and transfers the nft to the user and token to the seller 

```solidity
// @param _bidId 
   function acceptBid(uint256 _bidId)
        whenNotPaused
        external
        override
        returns (bool)
```