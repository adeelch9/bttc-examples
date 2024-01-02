# TokenTimeLock Contract

## Description

This smartcontract holds an ERC20 token for a specific time period and releases after the release time has passed

## How To Use

The contract has the following struct,variables and events that will be used in the contract

```solidity
    // ERC20 basic token contract being held
    IERC20 private _token;

    // beneficiary of tokens after they are released
    address private _beneficiary;

    // timestamp when token release is enabled
    uint256 private _releaseTime;
```

## Contract functions

constructor function takes 3 params for initializing the contract

```solidity
// @param token_ ERC20 token address to hold
// @param beneficiary_ beneficiary of tokens after they are released
// @param releaseTime_ timestamp when token release is enabled
constructor(IERC20 token_, address beneficiary_, uint256 releaseTime_)
```

`token()` function returns the token address being held.

```solidity
function token() public view virtual returns (IERC20)
```

`beneficiary()` function returns the beneficiary of the tokens.

```solidity
function beneficiary() public view virtual returns (address)
```

`releaseTime()` function returns the time when the tokens are released.

```solidity
function releaseTime() public view virtual returns (uint256)
```

`release()` function release the tokens held by time lock.
```solidity
function release() public virtual
```