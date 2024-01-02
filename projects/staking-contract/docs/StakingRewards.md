# StakingRewards Contract

## Description

This contract is an example of token staking . It stakes tokens and gives rewards to the users who staked the 
## How To Use

The contract has the following struct and variables that will be used in the contract 

```solidity
 IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    address public owner;

    // Duration of rewards to be paid out (in seconds)
    uint public duration;
    // Timestamp of when the rewards finish
    uint public finishAt;
    // Minimum of last updated time and reward finish time
    uint public updatedAt;
    // Reward to be paid out per second
    uint public rewardRate;
    // Sum of (reward rate * dt * 1e18 / total supply)
    uint public rewardPerTokenStored;
    // User address => rewardPerTokenStored
    mapping(address => uint) public userRewardPerTokenPaid;
    // User address => rewards to be claimed
    mapping(address => uint) public rewards;

    // Total staked
    uint public totalSupply;
    // User address => staked amount
    mapping(address => uint) public balanceOf;

```

## Contract functions

`constructor` function takes two parameters to initialize the contract

```solidity
// @param _stakingToken token address which will be staked
// @param _rewardToken token address which will be rewarded
constructor(address _stakingToken, address _rewardToken)
```

`lastTimeRewardApplicable()`returns the timestamp when the last reward was applied ,

```solidity
// @param campaignId uint id of the campaign
function lastTimeRewardApplicable() public view returns (uint)
```

`rewardPerToken()` returns the reward rate per token

```solidity
   function rewardPerToken() public view returns (uint)
```
`stake()` function stakes the amount in the contract and updates the rewards rate respectively by calling 
`updateReward` modifier

```solidity
 // @param _amount amount to stake 
function stake(uint _amount) external updateReward(msg.sender)
```
`withdraw()` function withdraws the amount in the contract and updates the rewards rate respectively by calling 
`updateReward` modifier

```solidity
 // @param _amount amount to withdraw 
function withdraw(uint _amount) external updateReward(msg.sender)
```

`earned()` function return the amount that is earned by a specific account

```solidity
// @param _account address of account to get earned tokens amount
function earned(address _account) public view returns (uint)
```

`getReward()` function withdraws the reward amount in the contract and updates the balance respectively by calling 
`updateReward` modifier

```solidity
function getReward() external updateReward(msg.sender)
```
`setRewardsDuration()` function sets the reward duration in the contract. It can be only set by the owner

```solidity
function setRewardsDuration(uint _duration) external onlyOwner
```
