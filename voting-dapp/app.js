const CONTRACT_ADDRESS = "0xD19e0c8C4D48AeF479e7E46BdB918010d66a95ae";
const ABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"addCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CandidateNotExist","type":"error"},{"inputs":[],"name":"alreadyVoted","type":"error"},{"inputs":[],"name":"candidateAlreadyExist","type":"error"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"castVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"notOwner","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"VoteCast","type":"event"},{"inputs":[],"name":"getCandidates","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"internalType":"struct Voting.candidate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"highestVotes","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

let provider;  // blockchain se connection
let signer;    // jo wallet connected hai uska object
let contract;  // smart contract ka object

async function connectWallet() {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const address = await signer.getAddress();
    document.getElementById("connectBtn").innerText = `Connected: ${address.slice(0,6)}...`;
    

    await loadCandidates();
}

async function loadCandidates() {
    const candidates = await contract.getCandidates();
    
    const list = document.getElementById("candidatesList");
    list.innerHTML = "";  // pehle clear karo

    candidates.forEach(function(candidate, index) {
        list.innerHTML += `
            <div>
                <p>${candidate.name} — Votes: ${candidate.voteCount}</p>
                <button onclick="castVote('${candidate.name}')">Vote</button>
            </div>
        `;
    });
}

async function addCandidate() {
    try {
        const name = document.getElementById("candidateName").value;
        const tx = await contract.addCandidate(name);
        await tx.wait();
        alert("Candidate added!");
        await loadCandidates();
    } catch (error) {
    if (error.message.includes("candidateAlreadyExist") || 
        error.data?.errorName === "candidateAlreadyExist") {
        alert("❌ Candidate already exists!");
    } else if (error.message.includes("notOwner") ||
        error.data?.errorName === "notOwner") {
        alert("❌ Only owner can add candidates!");
    } else {
        alert("❌ Something went wrong!");
    }
    }
}