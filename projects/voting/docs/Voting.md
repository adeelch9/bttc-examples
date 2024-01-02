# Voting Contract

## Description 

A voting smartcontract that registers candidates and performs voting on it.
## How To Use

The contract has the following struct and variables that will be used in the contract to save the voting data
```solidity
 // saves voter info i-e id and candidate id whom the voter voted
  struct Voter {
        string uid;
        uint candidateIDVote;
    } 

    // has candidate information like name party etc
 struct Candidate {
        string name;
        string party;
        bool doesExist;
    } 

    uint numCandidates; // declares a state variable - number Of Candidates
    uint numVoters;  // number of voter voted 
    uint256 voteDeadline; // state variable for saving deadline

    // These mappings will hold all the candidates and Voters respectively
    mapping(uint => Candidate) candidates;
    mapping(uint => Voter) voters;
```

Contract has following events which will be emitted on their respective event time.
```solidity
    // event for candidate registration logging
    event candidateRegistered(uint candidateID);

    // event for vote  logging
    event voteRegistered(uint voterID, uint candidateID);
```
## Contract functions
set vote deadline sets the voting deadline in the contract by calling `setVoteDeadline` function
```solidity
     // @param _voteDeadline Timestamp value of the deadline
    function setVoteDeadline(uint256 _voteDeadline) public 
```

Get vote deadline sets the voting deadline in the contract by calling `getVoteDeadline` function
```solidity
    function getVoteDeadline() public view returns (uint256)
```
`addCandidate` function adds candidate in the contract
```solidity
// @param name string name of candidate
// @param party string name of party

function addCandidate(string calldata name, string calldata party) public
```

`vote` function  votes to a specific candidate
```solidity
// @param uid string uid of user
// @param candidateID uint id of candidate
function vote(string calldata uid, uint candidateID) public
```

`getWinner` function  returns the candidate who won by vote
```solidity
function getWinner() public view returns (string memory winnerName)
```

`totalVotes` function  returns total vote of a specific candidate
```solidity
// @param candidateID uint id of candidate
function totalVotes(uint candidateID) public view returns (uint)
```