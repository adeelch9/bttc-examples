# DAO Contract

## Description

This simple proof of concept DAO smart contract sends ether to the digital vending machine
only if the majority of the DAO members vote "yes" to buy digital cookies. If the majority of the DAO members decide not to send ether, the members who deposited ether are able to withdraw the ether they deposited.

## How To Use

The contract has the following struct,variables and errors that will be used in the contract 

```solidity
    // address of vending machine
    address payable public VendingMachineAddress;

    uint public voteEndTime;

    // balance of ether in the smart contract
    uint public DAObalance;

    // allow withdrawals
    mapping(address=>uint) balances;

    // proposal decision of voters
    uint public decision;

    // default set as false
    // makes sure votes are counted before ending vote
    bool public ended;

    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    struct Proposal {
        string name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    // address of the person who set up the vote
    address public chairperson;

    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    //error handlers

    /// The vote has already ended.
    error voteAlreadyEnded();
    /// The auction has not ended yet.
    error voteNotYetEnded();
```

## Contract functions

constructor function takes 3 params for initializing the contract

```solidity
   // @param _VendingMachineAddress is the address where the ether will be sent
   // @param _voteTime deadline of vote
   // @param imageURI string[] ["buy_cupcakes", "no_cupcakes"]
constructor(
        address payable _VendingMachineAddress,
        uint _voteTime,
        string[] memory proposalNames
    )
```

deposit ether to the DAO smart contract by using `DepositEth` function <br>
    - anyone can deposit ether to the DAO smart contract <br>
    - members must deposit at least 1 eth into DAO ,this is to avoid complications during withdrawl if the DAO voted to buy cupcakes

```solidity
    function DepositEth() public payable
```

deposit ether to the DAO smart contract by using `DepositEth` function <br>
    - anyone can deposit ether to the DAO smart contract <br>
    - members must deposit at least 1 eth into DAO ,this is to avoid complications during withdrawl if the DAO voted to buy cupcakes

`giveRightToVote` function is used to give access to a user to give vote,only the chairperson can decide who can vote

```solidity
    function giveRightToVote(address voter) public
```

`vote` function is used to submit vote on a specific proposal,proposals are in format 0,1,2,...
```solidity
    function vote(uint proposal) public 
```

`countVote` function is used to count the vote and return the winning propsoal id 
```solidity
function countVote() public returns (uint winningProposal_)
```

`withdraw` function is used to withdraw amount from contract .Individuals can only withdraw what they deposited.But if proposal "buy_cupcakes" won,users will not be able to withdraw ether
```solidity
    function withdraw(uint amount) public
```


`checkCupCakeBalance` checks the cupcake balance of contract address
```solidity
    function checkCupCakeBalance() public
```

