# Voting DApp

A decentralized voting system built in Solidity as my first independently written smart contract,
after completing the Cyfrin Updraft Solidity 101 course.

A minimal frontend was also built using HTML, CSS, and Ethers.js to understand how a smart contract connects to a real interface and how the full Web3 flow works end to end.

## Features
- Only the owner can add candidates
- Each wallet address can vote only once
- Tracks vote count per candidate separately
- Dynamically updates the winner as votes are cast
- Custom errors for gas-efficient reverts
- Events emitted on every vote cast
- Frontend connects via MetaMask and displays live results

## Concepts Applied

**Smart Contract**
- Structs — candidate data structure
- Mappings — tracking voters, candidates, and indexes
- Modifiers — onlyOwner access control
- Custom errors — notOwner, alreadyVoted, CandidateNotExist, candidateAlreadyExist
- Events — VoteCast
- Constructor — setting contract owner

**Frontend**
- Ethers.js — connecting frontend to smart contract
- MetaMask wallet connection and disconnection
- Reading contract state — getCandidates, highestVotes, totalVotes
- Writing to contract — addCandidate, castVote
- Error handling — custom contract errors mapped to user-friendly messages

## Deployment
- Smart contract deployed on Sepolia Testnet
- Frontend runs locally via Live Server

## Known Limitations
- Tie votes not handled — winner stays as whoever reached that count first
- Candidate names are case-sensitive — "Ali" and "ali" treated as different candidates
- Voting period has no deadline — voting stays open indefinitely
- Only single wallet testing done — multi-wallet flow not fully tested

## Tools Used
- [Remix IDE](https://remix.ethereum.org)
- Solidity ^0.8.34
- Ethers.js v6
- MetaMask
- Sepolia Testnet + faucet
- VS Code + Live Server

## Live Server
<img width="944" height="428" alt="Screenshot 2026-06-28 115203" src="https://github.com/user-attachments/assets/e97fa239-df06-4e26-9fc1-bb16b10526b1" />
<img width="934" height="428" alt="image" src="https://github.com/user-attachments/assets/31c2596a-1d5c-4533-aab9-24e5f1015c65" />

## Next Steps
- Fix case sensitivity — normalize candidate names to lowercase
- Add voting deadline — time-based access control in SC
- Handle tie votes
- Allow decentralized candidate registration

## Part of My Learning Journey
- [CryptoZombies](https://cryptozombies.io) — Solidity basics
- [Cyfrin Updraft Course](https://updraft.cyfrin.io/courses/solidity)
- [Solidity Learning Repo](https://github.com/ksehar99/learning-solidity-cyfrin)
