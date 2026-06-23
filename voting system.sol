// SPDX-License-Identifier: MIT

pragma solidity ^0.8.34;

contract Voting{
    // user can vote only once
    // owner can add candidates
    // vote count for each candidate searately
    // dynamically set the cndidate with highest vote count

    struct candidate{
        string name;
        uint256 voteCount;
    }
    candidate[] candidates;
    address owner;
    uint public totalVotes;
    uint highestVoteCount;
    string winner;

    mapping (address => bool) userVoted;
    mapping (string => bool) candidateExist;
    mapping (string => uint) candidateIndex;

    error notOwner();
    error candidateAlreadyExist();
    error alreadyVoted();
    error CandidateNotExist();

    event VoteCast(address, string);

    constructor(){
        owner = msg.sender;
    }

    // no one else can add the candidte but only the owner
    modifier onlyOwner(){
        if (owner != msg.sender){
            revert notOwner();
        }
        _;
    }

    // add candidate if not already exist
    function addCandidate(string memory _name) onlyOwner external {
            if (candidateExist[_name]){
                revert candidateAlreadyExist();
            }

        candidates.push(candidate(_name, 0));
        candidateExist[_name] = true;
        candidateIndex[_name] = candidates.length - 1;
    }

    // Function to cast a vote for a candidate 
    // id should be passed instead of name
    function castVote(string memory _name) external {
        if (userVoted[msg.sender]) {
            revert alreadyVoted();
        }

        if(!candidateExist[_name]){
            revert CandidateNotExist();
        }
        
        uint index = candidateIndex[_name];
        candidates[index].voteCount++;
        userVoted[msg.sender] = true;
        emit VoteCast(msg.sender, _name);

        if(candidates[index].voteCount > highestVoteCount) {
            highestVoteCount = candidates[index].voteCount;
            winner = candidates[index].name;
        }
        totalVotes++;
    }

    // what if there is a tie in the vote sof two or more?
    function highestVotes() public view returns (string memory, uint) {
        return (winner, highestVoteCount);
    }
}

    
