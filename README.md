# Voting Smart Contract

A decentralized voting system built in Solidity as part of my blockchain
learning journey. This was my first independently written smart contract
after completing the Cyfrin Updraft Solidity 101 course.

## Features
- Only the owner can add candidates — no middleman-free candidate registration yet
- Each address can vote only once
- Tracks vote count per candidate separately
- Dynamically updates the winner as votes are cast
- Custom errors for gas-efficient reverts
- Events emitted on every vote cast

## Concepts Applied
- Structs — candidate data structure
- Mappings — tracking voters, candidates, and indexes
- Modifiers — onlyOwner access control
- Custom errors — notOwner, alreadyVoted, CandidateNotExist
- Events — VoteCast
- Constructor — setting contract owner

## Deployment
- Deployed on Sepolia Testnet

## Known Limitations
- Tie votes not handled — if two candidates have equal votes,
  winner stays as whoever reached that count first
- Candidate names are case-sensitive
- Candidate registration is centralized — only owner can add candidates

## Tools Used
- [Remix IDE](https://remix.ethereum.org)
- Solidity ^0.8.34
- MetaMask
- Sepolia Testnet + faucet

## Next Steps
- Connect this contract with Python using Web3.py
- Add tie-breaking logic
- Allow decentralized candidate registration

## Part of My Learning Journey
- [CryptoZombies](https://cryptozombies.io) — Solidity basics
- [Cyfrin Updraft Course](https://updraft.cyfrin.io/courses/solidity)
- [Solidity Learning Repo](https://github.com/ksehar99/learning-solidity-cyfrin)
