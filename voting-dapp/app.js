const CONTRACT_ADDRESS = "0xD19e0c8C4D48AeF479e7E46BdB918010d66a95ae";

const ABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"addCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CandidateNotExist","type":"error"},{"inputs":[],"name":"alreadyVoted","type":"error"},{"inputs":[],"name":"candidateAlreadyExist","type":"error"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"castVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"notOwner","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"VoteCast","type":"event"},{"inputs":[],"name":"getCandidates","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"internalType":"struct Voting.candidate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"highestVotes","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

let provider;
let signer;
let contract;

// ─── Wallet Connection ───────────────────────────────────────────────────────

async function connectWallet() {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const address = await signer.getAddress();
    document.getElementById("connectBtn").innerText = `Connected: ${address.slice(0, 6)}...`;

    await loadCandidates();
    await loadResults();
}

function disconnectWallet() {
    if (!contract) {
        alert("❌ You are not connected!");
        return;
    }
    provider = null;
    signer = null;
    contract = null;
    document.getElementById("connectBtn").innerText = "Connect Wallet";
    document.getElementById("candidatesList").innerHTML = "";
    document.getElementById("winner").innerHTML = "";
    document.getElementById("resultsList").innerHTML = "";
}

// ─── Load Candidates (Voter Panel) ──────────────────────────────────────────

async function loadCandidates() {
    const candidates = await contract.getCandidates();

    const list = document.getElementById("candidatesList");
    list.innerHTML = "";

    if (candidates.length === 0) {
        list.innerHTML = "<p>No candidates yet.</p>";
        return;
    }

    candidates.forEach(function (candidate) {
        list.innerHTML += `
            <div class="candidate-card">
                <p>${candidate.name} — Votes: ${candidate.voteCount}</p>
                <button onclick="castVote('${candidate.name}')">Vote</button>
            </div>
        `;
    });
}

// ─── Add Candidate (Owner Panel) ────────────────────────────────────────────

async function addCandidate() {
    try {
        const name = document.getElementById("candidateName").value.trim();

        if (!name) {
            alert("❌ Please enter a candidate name!");
            return;
        }

        const tx = await contract.addCandidate(name);
        await tx.wait();
        alert("✅ Candidate added!");
        document.getElementById("candidateName").value = "";
        await loadCandidates();
        await loadResults();

    } catch (error) {
        if (error.code === "ACTION_REJECTED") {
            alert("❌ Transaction cancelled!");
        } else if (error.data === "0x88bd5230") {
            alert("❌ Candidate already exists!");
        } else if (error.data === "0x9e87fac8") {
            alert("❌ Only owner can add candidates!");
        } else if (!contract) {
            alert("❌ Please connect your wallet first!");
        } else {
            alert("❌ Something went wrong!");
        }
    }
}

// ─── Cast Vote ───────────────────────────────────────────────────────────────

async function castVote(name) {
    try {
        const tx = await contract.castVote(name);
        await tx.wait();
        alert("✅ Vote cast successfully!");
        await loadCandidates();
        await loadResults();

    } catch (error) {
        if (error.code === "ACTION_REJECTED") {
            alert("❌ Transaction cancelled!");
        } else if (error.data === "0x17b5ed11") {
            alert("❌ You have already voted!");
        } else if (error.data === "0x5a8c9b88") {
            alert("❌ Candidate does not exist!");
        } else if (!contract) {
            alert("❌ Please connect your wallet first!");
        } else {
            alert("❌ Something went wrong!");
        }
    }
}

// ─── Load Results ────────────────────────────────────────────────────────────

async function loadResults() {
    const candidates = await contract.getCandidates();
    const [winnerName, winnerVotes] = await contract.highestVotes();
    const total = await contract.totalVotes();

    // Winner
    const winnerDiv = document.getElementById("winner");
    if (winnerName) {
        winnerDiv.innerHTML = `
            <p>🏆 Winner: <strong>${winnerName}</strong> — ${winnerVotes} votes</p>
            <p>Total Votes: ${total}</p>
        `;
    } else {
        winnerDiv.innerHTML = "<p>No votes cast yet.</p>";
    }

    // All results sorted by votes
    const sorted = [...candidates].sort((a, b) => Number(b.voteCount) - Number(a.voteCount));

    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = "";

    sorted.forEach(function (candidate, index) {
        resultsList.innerHTML += `
            <div class="result-card">
                <p>#${index + 1} — ${candidate.name}: ${candidate.voteCount} votes</p>
            </div>
        `;
    });
}