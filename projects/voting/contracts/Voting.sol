// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.20 and less than 0.9.0
pragma solidity ^0.8.20;

contract Voting {
    struct Voter {
        string uid;
        uint candidateIDVote;
    }
    struct Candidate {
        string name;
        string party;
        bool doesExist;
    }
    uint numCandidates; // declares a state variable - number Of Candidates
    uint numVoters;
    uint256 voteDeadline;

    // These mappings will hold all the candidates and Voters respectively
    mapping(uint => Candidate) candidates;
    mapping(uint => Voter) voters;

    // event for candidate registration logging
    event candidateRegistered(uint candidateID);

    // event for vote  logging
    event voteRegistered(uint voterID, uint candidateID);
    constructor() {
        numCandidates = 0;
    }

    // set vote deadline
    function setVoteDeadline(uint256 _voteDeadline) public {
        require(voteDeadline == 0, "Vote deadline already set");
        voteDeadline = _voteDeadline;
    }

    // get vote deadline
    function getVoteDeadline() public view returns (uint256) {
        return voteDeadline;
    }

    function addCandidate(string calldata name, string calldata party) public {
        // check if the vote deadline has passed"
        require(
            voteDeadline > 0 && block.timestamp < voteDeadline,
            "Voting deadline has passed or not set"
        );
        // candidateID is the return variable
        uint candidateID = numCandidates++;
        // Create new Candidate Struct with name and saves it to storage.
        candidates[candidateID] = Candidate(name, party, true);
        emit candidateRegistered(candidateID);
    }

    function vote(string calldata uid, uint candidateID) public {
        // check if the vote deadline has passed"
        require(block.timestamp < voteDeadline, "Voting deadline has passed");
        // checks if the struct exists for that candidate
        if (candidates[candidateID].doesExist == true) {
            uint voterID = numVoters++; //voterID is the return variable
            voters[voterID] = Voter(uid, candidateID);
            emit voteRegistered(voterID, candidateID);
        }
    }

    function getWinner() public view returns (string memory winnerName) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < numCandidates; p++) {
            if (totalVotes(p) > winningVoteCount) {
                winningVoteCount = totalVotes(p);
                winnerName = candidates[p].name;
            }
        }
    }

    function totalVotes(uint candidateID) public view returns (uint) {
        uint numOfVotes = 0;
        for (uint i = 0; i < numVoters; i++) {
            if (voters[i].candidateIDVote == candidateID) {
                numOfVotes++;
            }
        }
        return numOfVotes;
    }
}
