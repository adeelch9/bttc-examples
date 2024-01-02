# Hello World Contract

## Description

A simple smartcontract that returns a static string variable initilized in it
## How To Use

There is one public string variable named greet that is initialized with a "Hello world" string and one function that returns the value saved in the string variable
```solidity
contract HelloWorld {
    string public greet = "Hello World!";
 
function getGreeting() public view returns (string memory) {
        return greet;
    }
}
```