# SimpleERC20 Contract

## Description 

A simple smartcontract that uses openzeppelin smartcontract library to create a ERC20 token.
## How To Use

The contract takes 3 variables in constructor. These variables are name,supply and initial supply of the token.The contract has all the standard function of ERC20 like approve,mint transfer etc.
```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract SimpleERC20 is ERC20 {
       constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
```