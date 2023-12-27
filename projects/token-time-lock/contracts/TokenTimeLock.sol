// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.20 and less than 0.9.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenTimeLock {
    // ERC20 basic token contract being held
    IERC20 private _token;

    // beneficiary of tokens after they are released
    address private _beneficiary;

    // timestamp when token release is enabled
    uint256 private _releaseTime;

    constructor(IERC20 token_, address beneficiary_, uint256 releaseTime_) {
        require(
            releaseTime_ > block.timestamp,
            "TokenTimeLock: release time is before current time"
        );
        _token = token_;
        _beneficiary = beneficiary_;
        _releaseTime = releaseTime_;
    }

    // returns the token being held.
    function token() public view virtual returns (IERC20) {
        return _token;
    }

    // returns the beneficiary of the tokens.
    function beneficiary() public view virtual returns (address) {
        return _beneficiary;
    }

    // returns the time when the tokens are released.
    function releaseTime() public view virtual returns (uint256) {
        return _releaseTime;
    }

    // release the tokens held by time lock.
    function release() public virtual {
        require(
            block.timestamp >= releaseTime(),
            "TokenTimeLock: current time is before release time"
        );

        uint256 amount = token().balanceOf(address(this));
        require(amount > 0, "TokenTimeLock: no tokens to release");

        token().transfer(beneficiary(), amount);
    }
}
