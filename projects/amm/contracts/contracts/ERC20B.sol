pragma solidity ^0.5.17;

import './UniswapV2ERC20.sol';
/**
 * @dev only for test.
 */
contract ERC20B is UniswapV2ERC20 {
    //token名称
    string public constant name = "token B";
    //token缩写
    string public constant symbol = "token B";

    constructor(address owner) public {
        _mint(owner, 1000000000 * 10**18);
    }
}
